/* eslint-disable */
'use strict';

function Modal(module) {
    this.module = module;
    this.dialogBox = module.querySelector('dialog');
    this.container = document.documentElement;
    this.hasNativeDialog = 'showModal' in this.dialogBox;

    // list of elements that are allowed to be focused on.
    this.focusable = [
        'button',
        '[href]',
        'input',
        'select',
        'textarea',
        '[tabindex]:not([tabindex="-1"])'
    ];
}

Modal.prototype.init = function(options) {
    this.options = options || {};

    this.open = this.handleOpen.bind(this);
    this.close = this.handleClose.bind(this);
    this.focus = this.handleFocus.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.content = this.handleContent.bind(this);

    this.focusable = this.dialogBox.querySelectorAll(this.focusable.toString());
    this.focusableLast = this.focusable[this.focusable.length - 1];
    this.focusElement = this.options.focusElement || this.dialogBox;
    this.dialogContent = this.options.content;
    this.buttonClose = this.dialogBox.querySelector('.govuk-modal__close');

    this.isOpen = this.dialogBox.hasAttribute('open');

    if (this.options.triggerElement) {
        this.options.triggerElement.addEventListener('click', this.open);
    }

    if (this.options.content) {
        this.content(this.options.content);
    }

    if (this.buttonClose) {
        this.buttonClose.addEventListener('click', this.close);
    }

    return this;
};

Modal.prototype.handleOpen = function(e) {
    if (e) {
        e.preventDefault();
    }

    if (this.isOpen) {
        return;
    }

    this.lastActiveElement = document.activeElement;
    this.container.classList.add('govuk-!-scroll-disabled');
    this.module.classList.add('govuk-modal--open');
    this.hasNativeDialog ? this.dialogBox.show() : this.dialogBox.setAttribute('open', '');
    this.isOpen = true;
    this.focus();

    document.addEventListener('keydown', this.boundKeyDown, true);

    if (typeof this.options.onOpen === 'function') {
        this.options.onOpen.call(this);
    }

    const event = new CustomEvent('MODAL_OPEN');
    this.module.dispatchEvent(event);
};

Modal.prototype.handleClose = function(e) {
    if (e) {
        e.preventDefault();
    }

    if (!this.isOpen) {
        return;
    }

    this.hasNativeDialog ? this.dialogBox.close() : this.dialogBox.removeAttribute('open');
    this.module.classList.remove('govuk-modal--open');
    this.container.classList.remove('govuk-!-scroll-disabled');
    this.isOpen = false;
    this.lastActiveElement.focus();

    document.removeEventListener('keydown', this.boundKeyDown, true);

    if (typeof this.options.onClose === 'function') {
        this.options.onClose.call(this);
    }

    const event = new CustomEvent('MODAL_CLOSE');
    this.module.dispatchEvent(event);
};

Modal.prototype.handleFocus = function() {
    this.dialogBox.scrollIntoView();
    this.focusElement.focus({preventScroll: true});
};

Modal.prototype.handleKeyDown = function(e) {
    const keyCode = e.keyCode;

    // tab key.
    if (keyCode === 9) {
        let focusElement;

        // is the modal element (or any of the "focusable" elements) currently
        // being focused on?
        const isFocusedOnModal = [...this.focusable, this.dialogBox].some((element) => {
            return document.activeElement === element;
        });

        // if the modal is not currently focused on them force it.
        if (!isFocusedOnModal) {
            focusElement = this.dialogBox;
        } else {
            // if the currently focused element is the last "focusable" element
            // in the defined `focusable` array, then wrap it to the dialog
            // box element. or if there are no "focusable" element defined, then
            // just force focus to the dialog box.
            if (
                (document.activeElement === this.focusableLast && !e.shiftKey) ||
                !this.focusable.length
            ) {
                focusElement = this.dialogBox;
                // when shift is held down...
                // if the dialog box element is currently focused then force
                // focus to the last element in the "focusable" array 
            } else if (document.activeElement === this.dialogBox && e.shiftKey) {
                focusElement = this.focusableLast;
            }
        }

        // set the focus.
        if (focusElement) {
            e.preventDefault();
            focusElement.focus({preventScroll: true});
        }
    }
};

Modal.prototype.handleContent = function(options) {
    const dialogTitle = this.dialogBox.querySelector('.govuk-modal__heading');
    const dialogContent = this.dialogBox.querySelector('.govuk-modal__content');
    dialogTitle.innerHTML = options.heading;
    dialogContent.innerHTML = options.content;
}

export default Modal;