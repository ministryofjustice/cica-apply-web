/* global document, Element */

import Modal from './modal';

Element.prototype.scrollIntoView = jest.fn();

describe('Modal component', () => {
    it('should create an instance of a Modal', () => {
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1'));
        expect(typeof modal).toEqual('object');
    });

    it('should initilise the Modal instance', () => {
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init();
        expect(modal.isOpen).toEqual(false);
    });

    it('should open the modal', () => {
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init();
        expect(modal.isOpen).toEqual(false);
        modal.open();
        expect(modal.isOpen).toEqual(true);
    });

    it('should close the modal', () => {
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init();
        modal.open();
        expect(modal.isOpen).toEqual(true);
        modal.close();
        expect(modal.isOpen).toEqual(false);
    });

    it('should update the content of the modal', () => {
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
                        <div class="govuk-modal__header">header</div>
                        <div class="govuk-modal__main">
                            <span class="govuk-modal__heading govuk-heading-l" id="test-1-title">Test 1 heading</span>
                            <div class="govuk-modal__content" id="test-1-content"><p class="govuk-body">Test 1 modal body text</p></div>
                            <button type="button" class="govuk-button govuk-modal__continue" data-module="govuk-button">
                                Continue application
                            </button>
                        </div>
                    </dialog>
                </div>
                <div class="govuk-modal__overlay"></div>
            </div>`;
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init();

        modal.content((title, body) => {
            /* eslint-disable no-param-reassign */
            title.innerHTML = 'My new modal heading';
            body.innerHTML = 'My new modal content';
            /* eslint-enable no-param-reassign */
        });

        const modalHeading = document.querySelector('.govuk-modal__heading');
        const modalContent = document.querySelector('.govuk-modal__content');
        expect(modalHeading.innerHTML).toEqual('My new modal heading');
        expect(modalContent.innerHTML).toEqual('My new modal content');
    });

    it('should initilise the Modal instance with custom content option', () => {
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
        new Modal(document.querySelector('#govuk-modal-test-1')).init({
            content: {
                title: 'foo heading',
                body: 'bar content'
            }
        });

        const modalHeading = document.querySelector('.govuk-modal__heading');
        const modalContent = document.querySelector('.govuk-modal__content');
        expect(modalHeading.innerHTML).toEqual('foo heading');
        expect(modalContent.innerHTML).toEqual('bar content');
    });

    it('should initilise the Modal instance with custom trigger element option', () => {
        document.body.innerHTML = `<span id="trigger-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            triggerElement: document.querySelector('#trigger-element')
        });
        expect(modal.isOpen).toEqual(false);
        document.querySelector('#trigger-element').click();
        expect(modal.isOpen).toEqual(true);
    });

    it('should initilise the Modal instance with custom close element option', () => {
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            closeElement: document.querySelector('#close-element')
        });
        modal.open();
        expect(modal.isOpen).toEqual(true);
        document.querySelector('#close-element').click();
        expect(modal.isOpen).toEqual(false);
    });

    it('should initilise the Modal instance with custom close callback option', () => {
        let hasBeenClosed = 'foo';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onClose: () => {
                hasBeenClosed = 'bar';
            }
        });
        modal.open();
        modal.close();
        expect(hasBeenClosed).toEqual('bar');
    });

    it('should initilise the Modal instance with custom open callback option', () => {
        let hasBeenOpened = 'foo';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onOpen: () => {
                hasBeenOpened = 'bar';
            }
        });
        modal.close();
        modal.open();
        expect(hasBeenOpened).toEqual('bar');
    });

    it('should execute beforeOpen function', () => {
        let hasBeenOpened = 'foo';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onBeforeOpen: () => {
                hasBeenOpened = 'bar';
            }
        });
        modal.close();
        modal.open();
        expect(hasBeenOpened).toEqual('bar');
    });

    it('should open the modal if beforeOpen returns true', () => {
        let hasBeenOpened = 'foo';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onBeforeOpen: () => {
                return true;
            },
            onOpen: () => {
                hasBeenOpened = 'bar';
            }
        });
        modal.close();
        modal.open();
        expect(hasBeenOpened).toEqual('bar');
    });

    it('should not open the modal if beforeOpen returns false', () => {
        let hasBeenOpened = 'foo';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onBeforeOpen: () => {
                return false;
            },
            onOpen: () => {
                hasBeenOpened = 'bar';
            }
        });
        modal.close();
        modal.open();
        expect(hasBeenOpened).toEqual('foo');
    });

    it('should return early and not execute the beforeOpen function if modal is already open', () => {
        let hasBeenOpened = '';
        document.body.innerHTML = `<span id="close-element">click me</span><div class="govuk-modal" id="govuk-modal-test-1" data-module="govuk-modal">
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
        const modal = new Modal(document.querySelector('#govuk-modal-test-1')).init({
            onBeforeOpen: () => {
                hasBeenOpened += 'foo';
                return true;
            },
            onOpen: () => {
                hasBeenOpened += 'bar';
            }
        });
        modal.close();
        modal.open();
        modal.open();
        expect(hasBeenOpened).toEqual('foobar');
    });
});
