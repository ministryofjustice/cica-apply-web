/* globals document */
import createTimeoutModal from './index';
import Modal from '../../../components/cica/modal/modal';
import AccurateInterval from './utils/AccurateInterval/index';
// currently not implemented in jsdom.
// https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
// https://github.com/jsdom/jsdom/issues/1695
window.HTMLElement.prototype.scrollIntoView = jest.fn();

let TimeoutModal;

function trimWhitespace(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

describe('Timeout Modal', () => {
    beforeEach(() => {
        TimeoutModal = createTimeoutModal(window);
    });

    it('Should create a modal instance', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test'
        });

        expect(modal instanceof Modal).toBe(true);
    });

    it('Should open a modal', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test'
        });

        modal.open();

        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(true);
        expect(modal.isOpen).toBe(true);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(true);
    });

    it('Should close a modal', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test'
        });

        modal.open();

        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(true);
        expect(modal.isOpen).toBe(true);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(true);

        modal.close();

        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(false);
        expect(modal.isOpen).toBe(false);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(false);
    });

    it('Should open a modal after a delay', async () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            openIn: 1000
        });

        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(false);
        expect(modal.isOpen).toBe(false);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(false);
        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 1200);
        });
        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(true);
        expect(modal.isOpen).toBe(true);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(true);
    });

    it('Should close a modal after a delay', async () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            closeIn: 1000
        });
        modal.open();

        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(true);
        expect(modal.isOpen).toBe(true);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(true);
        // emulate a delay.
        await new Promise(resolve => {
            setTimeout(resolve, 1200);
        });
        expect(modal.config.element.querySelector('dialog').hasAttribute('open')).toEqual(false);
        expect(modal.isOpen).toBe(false);
        expect(
            document.querySelector('#govuk-modal-test').classList.contains('govuk-modal--open')
        ).toEqual(false);
    });

    it('Should execute a function when the modal is opened', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        let changeMe = '123';
        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            onOpen: () => {
                changeMe = 'abc';
            }
        });

        expect(changeMe).toBe('123');
        modal.open();
        expect(changeMe).toBe('abc');
    });

    it('Should execute a function when the modal is closed', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        let changeMe = '123';
        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            onClose: () => {
                changeMe = 'abc';
            }
        });

        modal.open();
        expect(changeMe).toBe('123');
        modal.close();
        expect(changeMe).toBe('abc');
    });

    it('Should update the contents of the modal', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test'
        });
        expect(
            trimWhitespace(
                document.querySelector('#govuk-modal-test .govuk-modal__heading').innerHTML
            )
        ).toBe('Test heading');
        expect(
            trimWhitespace(
                document.querySelector('#govuk-modal-test .govuk-modal__content').innerHTML
            )
        ).toBe('<p class="govuk-body">Test modal body text</p>');
        modal.content((title, body) => {
            const titleElement = title;
            const bodyElement = body;
            titleElement.innerHTML = 'This is the new title!';
            bodyElement.innerHTML = 'This is the new HTML body!';
        });
        expect(document.querySelector('#govuk-modal-test .govuk-modal__heading').innerHTML).toBe(
            'This is the new title!'
        );
        expect(document.querySelector('#govuk-modal-test .govuk-modal__content').innerHTML).toBe(
            'This is the new HTML body!'
        );
    });

    it('Should open the modal when the trigger element is clicked', () => {
        document.body.innerHTML = `<a href="/blah" id="modal-trigger">open modal</a>
        <div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            triggerElement: '#modal-trigger'
        });

        expect(modal.isOpen).toEqual(false);
        document.querySelector('#modal-trigger').click();
        expect(modal.isOpen).toEqual(true);
    });

    it('Should close the modal when the close element is clicked', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
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
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            closeElement: '.govuk-modal__close'
        });

        modal.open();
        expect(modal.isOpen).toEqual(true);
        document.querySelector('.govuk-modal__close').click();
        expect(modal.isOpen).toEqual(false);
    });

    it('Should create a timer instance', () => {
        document.body.innerHTML = `<div class="govuk-modal" id="govuk-modal-test" data-module="govuk-modal">
            <div class="govuk-modal__wrapper">
                <dialog
                    id="test"
                    class="govuk-modal__box"
                    aria-labelledby="test-title"
                    aria-describedby="test-content"
                    aria-modal="true"
                    role="alertdialog"
                    tabindex="0"
                >
                    <div class="govuk-modal__header">
                        header
                    </div>
                    <div class="govuk-modal__main">
                        <span class="govuk-modal__heading govuk-heading-l" id="test-title">Test heading</span>
                        <div class="govuk-modal__content" id="test-content">
                            <p class="govuk-body">Test modal body text</p>
                        </div>
                        <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                            Continue application
                        </button>
                    </div>
                </dialog>
            </div>
            <div class="govuk-modal__overlay"></div>
        </div>`;

        const modal = new TimeoutModal({
            element: '#govuk-modal-test',
            timer: {
                duration: 20000,
                interval: 400,
                onTick: () => {
                    console.log('tick!');
                },
                onEnd: () => {
                    console.log('done!');
                }
            }
        });

        expect(modal.timer instanceof AccurateInterval).toBe(true);
    });
});
