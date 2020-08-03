/* globals document, KeyboardEvent */
import createTimeoutModal from './index';
// currently not implemented in jsdom.
// https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.CICA = {
    SERVICE_URL: 'CW_URL',
    ANALYTICS_TRACKING_ID: 'CW_GA_TRACKING_ID',
    SESSION_DURATION: 3000
};

jest.mock('axios', () => {
    return {
        get: () => {
            return Promise.resolve('something went right');
        }
    };
});

describe('Timeout Modal', () => {
    describe('happy path', () => {
        it('should initialise a modal', () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-1"
                        class="govuk-modal__box"
                        aria-labelledby="test-1-title"
                        aria-describedby="test-1-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-1-title">Test 1 heading</span>
                            <div class="govuk-modal__content" id="test-1-content">
                                <p class="govuk-body">Test 1 modal body text</p>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;
            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-1',
                resumeElement: '.govuk-modal__continue'
            });
            const modalElement = document.querySelector('#govuk-modal-test-1');
            expect(modalElement.querySelector('dialog').hasAttribute('open')).toEqual(true);
        });

        it('should show the modal after a specified interval of milliseconds', async () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-2" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-2"
                        class="govuk-modal__box"
                        aria-labelledby="test-2-title"
                        aria-describedby="test-2-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-2-title">Test 1 heading</span>
                            <div class="govuk-modal__content" id="test-2-content">
                                <p class="govuk-body">Test 2 modal body text</p>
                            </div>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;
            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-2',
                showIn: [1000]
            });
            expect(
                document
                    .querySelector('#govuk-modal-test-2')
                    .classList.contains('govuk-modal--open')
            ).toEqual(false);
            // emulate a delay.
            await new Promise(r => setTimeout(r, 1200));
            expect(
                document
                    .querySelector('#govuk-modal-test-2')
                    .classList.contains('govuk-modal--open')
            ).toEqual(true);
        });

        it('should periodically update the content of a modal', async () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-3" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-3"
                        class="govuk-modal__box"
                        aria-labelledby="test-3-title"
                        aria-describedby="test-3-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-3-title">Test 1 heading</span>
                            <div class="govuk-modal__content" id="test-3-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;
            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-3'
            });
            expect(document.querySelector('.govuk-modal__time-remaining').innerHTML).toEqual(
                '3 seconds'
            );
            // emulate a delay.
            await new Promise(r => setTimeout(r, 1000));
            expect(document.querySelector('.govuk-modal__time-remaining').innerHTML).toEqual(
                '2 seconds'
            );
            // emulate a delay.
            await new Promise(r => setTimeout(r, 1000));
            expect(document.querySelector('.govuk-modal__time-remaining').innerHTML).toEqual(
                '1 second'
            );
        });

        it('should resume a modal counting down when CTA is clicked', async () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-3" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-3"
                        class="govuk-modal__box"
                        aria-labelledby="test-3-title"
                        aria-describedby="test-3-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-3-title">Test 1 heading</span>
                            <div class="govuk-modal__content" id="test-3-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-3',
                resumeElement: '.govuk-modal__continue'
            });
            expect(document.querySelector('.govuk-modal__time-remaining').innerHTML).toEqual(
                '3 seconds'
            );
            // emulate a delay.
            await new Promise(r => setTimeout(r, 1000));
            // click resume button.
            document.body.querySelector('.govuk-modal__continue').click();
            // emulate a delay.
            await new Promise(r => setTimeout(r, 500));
            expect(document.querySelector('.govuk-modal__time-remaining').innerHTML).toEqual(
                '3 seconds'
            );
        });

        it('should change the content of the modal', async () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-4" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-4"
                        class="govuk-modal__box"
                        aria-labelledby="test-4-title"
                        aria-describedby="test-4-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-4-title">Test 4 heading</span>
                            <div class="govuk-modal__content" id="test-4-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-4',
                resumeElement: '.govuk-modal__continue',
                content: {
                    heading: 'The new heading',
                    content: 'This is the new content'
                }
            });
            expect(document.querySelector('#test-4-title').innerHTML).toEqual('The new heading');
            expect(document.querySelector('#test-4-content').innerHTML).toEqual(
                'This is the new content'
            );
        });

        it('should show the modal when a trigger element is clicked', () => {
            document.body.innerHTML = `<a href="/blah" id="modal-trigger">open modal</a><div class="govuk-modal" id="govuk-modal-test-5" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-5"
                        class="govuk-modal__box"
                        aria-labelledby="test-5-title"
                        aria-describedby="test-5-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-5-title">Test 5 heading</span>
                            <div class="govuk-modal__content" id="test-5-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-5',
                resumeElement: '.govuk-modal__continue',
                triggerElement: '#modal-trigger',
                closed: true
            });
            const modalElement = document.querySelector('#govuk-modal-test-5');
            expect(modalElement.classList.contains('govuk-modal--open')).toEqual(false);
            document.querySelector('#modal-trigger').click();
            expect(modalElement.classList.contains('govuk-modal--open')).toEqual(true);
        });

        it('should close when the close button is clicked', () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-6" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-6"
                        class="govuk-modal__box"
                        aria-labelledby="test-6-title"
                        aria-describedby="test-6-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                            <button type="button" class="govuk-button govuk-modal__close" data-module="govuk-button" aria-label="Close modal">
                            ×
                            </button>
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-6-title">Test 6 heading</span>
                            <div class="govuk-modal__content" id="test-6-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-6',
                resumeElement: '.govuk-modal__continue',
                closeElement: '.govuk-modal__close'
            });
            const modalElement = document.querySelector('#govuk-modal-test-6');
            expect(modalElement.classList.contains('govuk-modal--open')).toEqual(true);
            document.querySelector('.govuk-modal__close').click();
            expect(modalElement.classList.contains('govuk-modal--open')).toEqual(false);
        });

        it('should execute a callback when the modal is opened', async () => {
            let modalOpened = 'no';
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-5" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-5"
                        class="govuk-modal__box"
                        aria-labelledby="test-5-title"
                        aria-describedby="test-5-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-5-title">Test 5 heading</span>
                            <div class="govuk-modal__content" id="test-5-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-5',
                resumeElement: '.govuk-modal__continue',
                closed: true,
                showIn: [500],
                onOpen: () => {
                    modalOpened = '123456';
                }
            });
            expect(modalOpened).toEqual('no');
            // emulate a delay.
            await new Promise(r => setTimeout(r, 1000));
            expect(modalOpened).toEqual('123456');
        });

        it('should execute a callback when the modal is closed', () => {
            let modalClosed = 'no';
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-5" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-5"
                        class="govuk-modal__box"
                        aria-labelledby="test-5-title"
                        aria-describedby="test-5-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                            <button type="button" class="govuk-button govuk-modal__close" data-module="govuk-button" aria-label="Close modal">
                            ×
                            </button>
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-5-title">Test 5 heading</span>
                            <div class="govuk-modal__content" id="test-5-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-5',
                resumeElement: '.govuk-modal__continue',
                closeElement: '.govuk-modal__close',
                onClose: () => {
                    modalClosed = '123456';
                }
            });
            expect(modalClosed).toEqual('no');
            document.querySelector('.govuk-modal__close').click();
            expect(modalClosed).toEqual('123456');
        });

        it('should tab through the modal elements', () => {
            document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test-5" data-module="govuk-modal">
                <div class="govuk-modal__wrapper">
                    <dialog
                        id="test-5"
                        class="govuk-modal__box"
                        aria-labelledby="test-5-title"
                        aria-describedby="test-5-content"
                        aria-modal="true"
                        role="alertdialog"
                        tabindex="0"
                    >
                        <div class="govuk-modal__header">
                            header
                        </div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-5-title">Test 5 heading</span>
                            <div class="govuk-modal__content" id="test-5-content">
                                <p class="govuk-body">Test 3 modal body text</p>
                                <span aria-live="assertive">Your application will time out in <span class="govuk-modal__time-remaining" aria-atomic="true" aria-live="assertive"></span></span>
                            </div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;

            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-test-5',
                resumeElement: '.govuk-modal__continue'
            });
            const continueButtonElement = document.querySelector('.govuk-modal__continue');
            const dialogElement = document.querySelector('#test-5');

            expect(document.activeElement).toEqual(continueButtonElement);

            const event1 = new KeyboardEvent('keydown', {keyCode: 9});
            document.dispatchEvent(event1);
            expect(document.activeElement).toEqual(dialogElement);
        });
    });
});
