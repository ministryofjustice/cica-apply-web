/* eslint-disable func-names */
// reason for the above eslint rule change is explained
// above the `Modal.prototype.init` method definition.
// eslint-disable-next-line import/no-extraneous-dependencies
import CustomEvent from 'custom-event';

function Modal(module) {
    this.module = module;
    this.dialogBox = module.querySelector('dialog');
    this.container = window.document.documentElement;
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

// Arrow functions can never be used as constructor functions. Hence,
// they can never be invoked with the new keyword. As such, a prototype
// property does not exist for an arrow function.
// https://blog.logrocket.com/anomalies-in-javascript-arrow-functions/
// https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6
Modal.prototype.init = function(options) {
    this.options = options || {};

    this.open = this.handleOpen.bind(this);
    this.beforeOpen = this.handleBeforeOpen.bind(this);
    this.close = this.handleClose.bind(this);
    this.focus = this.handleFocus.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.content = this.handleContent.bind(this);

    this.focusable = this.dialogBox.querySelectorAll(this.focusable.toString());
    this.focusableLast = this.focusable[this.focusable.length - 1];
    this.focusElement = this.options.focusElement || this.dialogBox;
    this.isOpen = this.dialogBox.hasAttribute('open');

    if (this.options.triggerElement) {
        this.options.triggerElement.addEventListener('click', this.open);
    }

    if (this.options.content) {
        this.content((title, body) => {
            const titleElement = title;
            const bodyElement = body;

            if (this.options.content.title && typeof this.options.content.title === 'string') {
                titleElement.innerHTML = this.options.content.title;
            }

            if (this.options.content.body && typeof this.options.content.body === 'string') {
                bodyElement.innerHTML = this.options.content.body;
            }
        });
    }

    if (this.options.closeElement) {
        this.options.closeElement.addEventListener('click', this.close);
    }

    return this;
};

Modal.prototype.handleBeforeOpen = function(e) {
    let shouldOpen = true;

    if (e) {
        e.preventDefault();
    }

    if (typeof this.options.onBeforeOpen === 'function') {
        const response = this.options.onBeforeOpen();
        if (response === false) {
            shouldOpen = false;
        }
    }

    return shouldOpen;
};

Modal.prototype.handleOpen = function(e) {
    if (e) {
        e.preventDefault();
    }

    if (this.isOpen) {
        return;
    }
    const beforeOpen = this.beforeOpen();
    if (!beforeOpen) {
        return;
    }

    this.lastActiveElement = window.document.activeElement;
    this.container.classList.add('govuk-!-scroll-disabled');
    this.module.classList.add('govuk-modal--open');
    if (this.hasNativeDialog) {
        this.dialogBox.show();
    } else {
        this.dialogBox.setAttribute('open', '');
    }
    this.isOpen = true;
    this.focus();

    window.document.addEventListener('keydown', this.boundKeyDown, true);

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

    if (this.hasNativeDialog) {
        this.dialogBox.close();
    } else {
        this.dialogBox.removeAttribute('open');
    }

    this.module.classList.remove('govuk-modal--open');
    this.container.classList.remove('govuk-!-scroll-disabled');
    this.isOpen = false;
    this.lastActiveElement.focus();

    window.document.removeEventListener('keydown', this.boundKeyDown, true);
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
    const {keyCode} = e;

    // tab key.
    if (keyCode === 9) {
        let focusElement;

        // is the modal element (or any of the "focusable" elements) currently
        // being focused on?
        const isFocusedOnModal = [...this.focusable, this.dialogBox].some(element => {
            return window.document.activeElement === element;
        });

        // if the modal is not currently focused on them then force it.
        if (!isFocusedOnModal) {
            focusElement = this.dialogBox;
            // if the currently focused element is the last "focusable" element
            // in the defined `focusable` array, then wrap it to the dialog
            // box element. or if there are no "focusable" element defined, then
            // just force focus to the dialog box.
        } else if (
            (window.document.activeElement === this.focusableLast && !e.shiftKey) ||
            !this.focusable.length
        ) {
            focusElement = this.dialogBox;
            // when shift is held down...
            // if the dialog box element is currently focused then force
            // focus to the last element in the "focusable" array
        } else if (window.document.activeElement === this.dialogBox && e.shiftKey) {
            focusElement = this.focusableLast;
        }

        // set the focus.
        if (focusElement) {
            e.preventDefault();
            focusElement.focus({preventScroll: true});
        }
    }
};
Modal.prototype.handleContent = function(updateContent) {
    const titleElement = this.dialogBox.querySelector('.govuk-modal__heading');
    const bodyElement = this.dialogBox.querySelector('.govuk-modal__content');
    updateContent(titleElement, bodyElement);
};

export default Modal;
