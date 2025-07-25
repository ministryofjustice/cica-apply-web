/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./components/cica/modal/modal.js":
/*!****************************************!*\
  !*** ./components/cica/modal/modal.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var custom_event__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! custom-event */ "./node_modules/custom-event/index.js");
/* harmony import */ var custom_event__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(custom_event__WEBPACK_IMPORTED_MODULE_0__);
/* eslint-disable func-names */
// reason for the above eslint rule change is explained
// above the `Modal.prototype.init` method definition.
// eslint-disable-next-line import/no-extraneous-dependencies

function Modal(module) {
  this.module = module;
  this.dialogBox = module.querySelector('dialog');
  this.container = window.document.documentElement;
  this.hasNativeDialog = 'showModal' in this.dialogBox;

  // list of elements that are allowed to be focused on.
  this.focusable = ['button', '[href]', 'input', 'select', 'textarea', '[tabindex]:not([tabindex="-1"])'];
}

// Arrow functions can never be used as constructor functions. Hence,
// they can never be invoked with the new keyword. As such, a prototype
// property does not exist for an arrow function.
// https://blog.logrocket.com/anomalies-in-javascript-arrow-functions/
// https://stackoverflow.com/questions/22939130/when-should-i-use-arrow-functions-in-ecmascript-6
Modal.prototype.init = function (options) {
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
Modal.prototype.handleBeforeOpen = function (e) {
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
Modal.prototype.handleOpen = function (e) {
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
  const event = new (custom_event__WEBPACK_IMPORTED_MODULE_0___default())('MODAL_OPEN');
  this.module.dispatchEvent(event);
};
Modal.prototype.handleClose = function (e) {
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
  const event = new (custom_event__WEBPACK_IMPORTED_MODULE_0___default())('MODAL_CLOSE');
  this.module.dispatchEvent(event);
};
Modal.prototype.handleFocus = function () {
  this.dialogBox.scrollIntoView();
  this.focusElement.focus({
    preventScroll: true
  });
};
Modal.prototype.handleKeyDown = function (e) {
  const {
    keyCode
  } = e;

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
    } else if (window.document.activeElement === this.focusableLast && !e.shiftKey || !this.focusable.length) {
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
      focusElement.focus({
        preventScroll: true
      });
    }
  }
};
Modal.prototype.handleContent = function (updateContent) {
  const titleElement = this.dialogBox.querySelector('.govuk-modal__heading');
  const bodyElement = this.dialogBox.querySelector('.govuk-modal__content');
  updateContent(titleElement, bodyElement);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ }),

/***/ "./components/govuk/one-login-service-header/service-header.js":
/*!*********************************************************************!*\
  !*** ./components/govuk/one-login-service-header/service-header.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * A modified adaptation of the Design System header script
 * To initialise the One Login header, run:
 * new window.CrossServiceHeader(document.querySelector("[data-module='one-login-header']")).init();
 */
function CrossServiceHeader($module) {
  this.$header = $module;
  this.$navigation = $module && $module.querySelectorAll('[data-one-login-header-nav]');
  this.$numberOfNavs = this.$navigation && this.$navigation.length;
}
/**
 * Initialise header
 *
 * Check for the presence of the header, menu and menu button – if any are
 * missing then there's nothing to do so return early.
 * 
 * Example implementation:
 *  var oneLoginHeader = document.querySelector('[data-module="one-login-header"]');
    if (oneLoginHeader) {
        new window.CrossServiceHeader(oneLoginHeader).init();
    }
 */
CrossServiceHeader.prototype.init = function crossServiceHeaderInit() {
  if (!this.$header && !this.$numberOfNavs) {
    return;
  }
  /**
   * The header can render with one or two navigation elements which collapse
   * into dropdowns on the mobile variation. This initialises the dropdown
   * functionality for all navs that have a menu button which has:
   * 1. a class of .js-x-header-toggle
   * 2. an aria-controls attribute which can be mapped to the ID of the element
   * that should be hidden on mobile
   */
  for (let i = 0; i < this.$numberOfNavs; i += 1) {
    const $nav = this.$navigation[i];
    $nav.$menuButton = $nav.querySelector('.js-x-header-toggle');
    $nav.$menu = $nav.$menuButton && $nav.querySelector(`#${$nav.$menuButton.getAttribute('aria-controls')}`);
    $nav.menuItems = $nav.$menu && $nav.$menu.querySelectorAll('li');
    if (!$nav.$menuButton || !$nav.$menu || $nav.menuItems.length < 2) {
      return;
    }
    $nav.classList.add('toggle-enabled');
    $nav.$menuOpenClass = $nav.$menu && $nav.$menu.dataset.openClass;
    $nav.$menuButtonOpenClass = $nav.$menuButton && $nav.$menuButton.dataset.openClass;
    $nav.$menuButtonOpenLabel = $nav.$menuButton && $nav.$menuButton.dataset.labelForShow;
    $nav.$menuButtonCloseLabel = $nav.$menuButton && $nav.$menuButton.dataset.labelForHide;
    $nav.$menuButtonOpenText = $nav.$menuButton && $nav.$menuButton.dataset.textForShow;
    $nav.$menuButtonCloseText = $nav.$menuButton && $nav.$menuButton.dataset.textForHide;
    $nav.isOpen = false;
    $nav.$menuButton.addEventListener('click', this.handleMenuButtonClick.bind($nav));
  }
};

/**
 * Handle menu button click
 *
 * When the menu button is clicked, change the visibility of the menu and then
 * sync the accessibility state and menu button state
 */
CrossServiceHeader.prototype.handleMenuButtonClick = function CrossServiceHeaderHandleMenuButtonClick() {
  this.isOpen = !this.isOpen;
  if (this.$menuOpenClass) {
    this.$menu.classList.toggle(this.$menuOpenClass, this.isOpen);
  }
  if (this.$menuButtonOpenClass) {
    this.$menuButton.classList.toggle(this.$menuButtonOpenClass, this.isOpen);
  }
  this.$menuButton.setAttribute('aria-expanded', this.isOpen);
  if (this.$menuButtonCloseLabel && this.$menuButtonOpenLabel) {
    this.$menuButton.setAttribute('aria-label', this.isOpen ? this.$menuButtonCloseLabel : this.$menuButtonOpenLabel);
  }
  if (this.$menuButtonCloseText && this.$menuButtonOpenText) {
    this.$menuButton.innerHTML = this.isOpen ? this.$menuButtonCloseText : this.$menuButtonOpenText;
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CrossServiceHeader);

/***/ }),

/***/ "./node_modules/@ministryofjustice/frontend/moj/all.bundle.js":
/*!********************************************************************!*\
  !*** ./node_modules/@ministryofjustice/frontend/moj/all.bundle.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports, __webpack_require__(/*! govuk-frontend */ "./node_modules/govuk-frontend/dist/govuk/all.bundle.js")) : 0;
})(this, function (exports, govukFrontend) {
  'use strict';

  /*
   * This variable is automatically overwritten during builds and releases.
   * It doesn't need to be updated manually.
   */

  /**
   * MoJ Frontend release version
   *
   * {@link https://github.com/ministryofjustice/moj-frontend/releases}
   */
  const version = '5.1.5';
  class AddAnother extends govukFrontend.Component {
    /**
     * @param {Element | null} $root - HTML element to use for add another
     */
    constructor($root) {
      super($root);
      this.$root.addEventListener('click', this.onRemoveButtonClick.bind(this));
      this.$root.addEventListener('click', this.onAddButtonClick.bind(this));
      const $buttons = this.$root.querySelectorAll('.moj-add-another__add-button, moj-add-another__remove-button');
      $buttons.forEach($button => {
        if (!($button instanceof HTMLButtonElement)) {
          return;
        }
        $button.type = 'button';
      });
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onAddButtonClick(event) {
      const $button = event.target;
      if (!$button || !($button instanceof HTMLButtonElement) || !$button.classList.contains('moj-add-another__add-button')) {
        return;
      }
      const $items = this.getItems();
      const $item = this.getNewItem();
      if (!$item || !($item instanceof HTMLElement)) {
        return;
      }
      this.updateAttributes($item, $items.length);
      this.resetItem($item);
      const $firstItem = $items[0];
      if (!this.hasRemoveButton($firstItem)) {
        this.createRemoveButton($firstItem);
      }
      $items[$items.length - 1].after($item);
      const $input = $item.querySelector('input, textarea, select');
      if ($input && $input instanceof HTMLInputElement) {
        $input.focus();
      }
    }

    /**
     * @param {HTMLElement} $item - Add another item
     */
    hasRemoveButton($item) {
      return $item.querySelectorAll('.moj-add-another__remove-button').length;
    }
    getItems() {
      if (!this.$root) {
        return [];
      }
      const $items = Array.from(this.$root.querySelectorAll('.moj-add-another__item'));
      return $items.filter(item => item instanceof HTMLElement);
    }
    getNewItem() {
      const $items = this.getItems();
      const $item = $items[0].cloneNode(true);
      if (!$item || !($item instanceof HTMLElement)) {
        return;
      }
      if (!this.hasRemoveButton($item)) {
        this.createRemoveButton($item);
      }
      return $item;
    }

    /**
     * @param {HTMLElement} $item - Add another item
     * @param {number} index - Add another item index
     */
    updateAttributes($item, index) {
      $item.querySelectorAll('[data-name]').forEach($input => {
        if (!this.isValidInputElement($input)) {
          return;
        }
        const name = $input.getAttribute('data-name') || '';
        const id = $input.getAttribute('data-id') || '';
        const originalId = $input.id;
        $input.name = name.replace(/%index%/, `${index}`);
        $input.id = id.replace(/%index%/, `${index}`);
        const $label = $input.parentElement.querySelector('label') || $input.closest('label') || $item.querySelector(`[for="${originalId}"]`);
        if ($label && $label instanceof HTMLLabelElement) {
          $label.htmlFor = $input.id;
        }
      });
    }

    /**
     * @param {HTMLElement} $item - Add another item
     */
    createRemoveButton($item) {
      const $button = document.createElement('button');
      $button.type = 'button';
      $button.classList.add('govuk-button', 'govuk-button--secondary', 'moj-add-another__remove-button');
      $button.textContent = 'Remove';
      $item.append($button);
    }

    /**
     * @param {HTMLElement} $item - Add another item
     */
    resetItem($item) {
      $item.querySelectorAll('[data-name], [data-id]').forEach($input => {
        if (!this.isValidInputElement($input)) {
          return;
        }
        if ($input instanceof HTMLSelectElement) {
          $input.selectedIndex = -1;
          $input.value = '';
        } else if ($input instanceof HTMLTextAreaElement) {
          $input.value = '';
        } else {
          switch ($input.type) {
            case 'checkbox':
            case 'radio':
              $input.checked = false;
              break;
            default:
              $input.value = '';
          }
        }
      });
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onRemoveButtonClick(event) {
      const $button = event.target;
      if (!$button || !($button instanceof HTMLButtonElement) || !$button.classList.contains('moj-add-another__remove-button')) {
        return;
      }
      $button.closest('.moj-add-another__item').remove();
      const $items = this.getItems();
      if ($items.length === 1) {
        $items[0].querySelector('.moj-add-another__remove-button').remove();
      }
      $items.forEach(($item, index) => {
        this.updateAttributes($item, index);
      });
      this.focusHeading();
    }
    focusHeading() {
      const $heading = this.$root.querySelector('.moj-add-another__heading');
      if ($heading && $heading instanceof HTMLElement) {
        $heading.focus();
      }
    }

    /**
     * @param {Element} $input - the input to validate
     */
    isValidInputElement($input) {
      return $input instanceof HTMLInputElement || $input instanceof HTMLSelectElement || $input instanceof HTMLTextAreaElement;
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }
  AddAnother.moduleName = 'moj-add-another';

  /**
   * GOV.UK Frontend helpers
   *
   * @todo Import from GOV.UK Frontend
   */

  /**
   * Move focus to element
   *
   * Sets tabindex to -1 to make the element programmatically focusable,
   * but removes it on blur as the element doesn't need to be focused again.
   *
   * @template {HTMLElement} FocusElement
   * @param {FocusElement} $element - HTML element
   * @param {object} [options] - Handler options
   * @param {function(this: FocusElement): void} [options.onBeforeFocus] - Callback before focus
   * @param {function(this: FocusElement): void} [options.onBlur] - Callback on blur
   */
  function setFocus($element, options = {}) {
    var _options$onBeforeFocu;
    const isFocusable = $element.getAttribute('tabindex');
    if (!isFocusable) {
      $element.setAttribute('tabindex', '-1');
    }

    /**
     * Handle element focus
     */
    function onFocus() {
      $element.addEventListener('blur', onBlur, {
        once: true
      });
    }

    /**
     * Handle element blur
     */
    function onBlur() {
      var _options$onBlur;
      (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
      if (!isFocusable) {
        $element.removeAttribute('tabindex');
      }
    }

    // Add listener to reset element on blur, after focus
    $element.addEventListener('focus', onFocus, {
      once: true
    });

    // Focus element
    (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
    $element.focus();
  }

  /**
   * @param {Element} $element - Element to remove attribute value from
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value
   */
  function removeAttributeValue($element, attr, value) {
    let re, m;
    if ($element.getAttribute(attr)) {
      if ($element.getAttribute(attr) === value) {
        $element.removeAttribute(attr);
      } else {
        re = new RegExp(`(^|\\s)${value}(\\s|$)`);
        m = $element.getAttribute(attr).match(re);
        if (m && m.length === 3) {
          $element.setAttribute(attr, $element.getAttribute(attr).replace(re, m[1] && m[2] ? ' ' : ''));
        }
      }
    }
  }

  /**
   * @param {Element} $element - Element to add attribute value to
   * @param {string} attr - Attribute name
   * @param {string} value - Attribute value
   */
  function addAttributeValue($element, attr, value) {
    let re;
    if (!$element.getAttribute(attr)) {
      $element.setAttribute(attr, value);
    } else {
      re = new RegExp(`(^|\\s)${value}(\\s|$)`);
      if (!re.test($element.getAttribute(attr))) {
        $element.setAttribute(attr, `${$element.getAttribute(attr)} ${value}`);
      }
    }
  }

  /**
   * Find an elements preceding sibling
   *
   * Utility function to find an elements previous sibling matching the provided
   * selector.
   *
   * @param {Element | null} $element - Element to find siblings for
   * @param {string} [selector] - selector for required sibling
   */
  function getPreviousSibling($element, selector) {
    if (!$element || !($element instanceof HTMLElement)) {
      return;
    }

    // Get the previous sibling element
    let $sibling = $element.previousElementSibling;

    // If the sibling matches our selector, use it
    // If not, jump to the next sibling and continue the loop
    while ($sibling) {
      if ($sibling.matches(selector)) return $sibling;
      $sibling = $sibling.previousElementSibling;
    }
  }

  /**
   * @param {Element | null} $element
   * @param {string} [selector]
   */
  function findNearestMatchingElement($element, selector) {
    // If no element or selector is provided, return
    if (!$element || !($element instanceof HTMLElement) || false) {
      return;
    }

    // Start with the current element
    let $currentElement = $element;
    while ($currentElement) {
      // First check the current element
      if ($currentElement.matches(selector)) {
        return $currentElement;
      }

      // Check all previous siblings
      let $sibling = $currentElement.previousElementSibling;
      while ($sibling) {
        // Check if the sibling itself is a heading
        if ($sibling.matches(selector)) {
          return $sibling;
        }
        $sibling = $sibling.previousElementSibling;
      }

      // If no match found in siblings, move up to parent
      $currentElement = $currentElement.parentElement;
    }
  }

  /**
   * @augments {ConfigurableComponent<AlertConfig>}
   */
  class Alert extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for alert
     * @param {AlertConfig} [config] - Alert config
     */
    constructor($root, config = {}) {
      super($root, config);

      /**
       * Focus the alert
       *
       * If `role="alert"` is set, focus the element to help some assistive
       * technologies prioritise announcing it.
       *
       * You can turn off the auto-focus functionality by setting
       * `data-disable-auto-focus="true"` in the component HTML. You might wish to
       * do this based on user research findings, or to avoid a clash with another
       * element which should be focused when the page loads.
       */
      if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
        setFocus(this.$root);
      }
      this.$dismissButton = this.$root.querySelector('.moj-alert__dismiss');
      if (this.config.dismissible && this.$dismissButton) {
        this.$dismissButton.innerHTML = this.config.dismissText;
        this.$dismissButton.removeAttribute('hidden');
        this.$root.addEventListener('click', event => {
          if (event.target instanceof Node && this.$dismissButton.contains(event.target)) {
            this.dimiss();
          }
        });
      }
    }

    /**
     * Handle dismissing the alert
     */
    dimiss() {
      let $elementToRecieveFocus;

      // If a selector has been provided, attempt to find that element
      if (this.config.focusOnDismissSelector) {
        $elementToRecieveFocus = document.querySelector(this.config.focusOnDismissSelector);
      }

      // Is the next sibling another alert
      if (!$elementToRecieveFocus) {
        const $nextSibling = this.$root.nextElementSibling;
        if ($nextSibling && $nextSibling.matches('.moj-alert')) {
          $elementToRecieveFocus = $nextSibling;
        }
      }

      // Else try to find any preceding sibling alert or heading
      if (!$elementToRecieveFocus) {
        $elementToRecieveFocus = getPreviousSibling(this.$root, '.moj-alert, h1, h2, h3, h4, h5, h6');
      }

      // Else find the closest ancestor heading, or fallback to main, or last resort
      // use the body element
      if (!$elementToRecieveFocus) {
        $elementToRecieveFocus = findNearestMatchingElement(this.$root, 'h1, h2, h3, h4, h5, h6, main, body');
      }

      // If we have an element, place focus on it
      if ($elementToRecieveFocus instanceof HTMLElement) {
        setFocus($elementToRecieveFocus);
      }

      // Remove the alert
      this.$root.remove();
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * @typedef {object} AlertConfig
   * @property {boolean} [dismissible=false] - Can the alert be dismissed by the user
   * @property {string} [dismissText=Dismiss] - the label text for the dismiss button
   * @property {boolean} [disableAutoFocus=false] - whether the alert will be autofocused
   * @property {string} [focusOnDismissSelector] - CSS Selector for element to be focused on dismiss
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  Alert.moduleName = 'moj-alert';
  /**
   * Alert default config
   *
   * @type {AlertConfig}
   */
  Alert.defaults = Object.freeze({
    dismissible: false,
    dismissText: 'Dismiss',
    disableAutoFocus: false
  });
  /**
   * Alert config schema
   *
   * @satisfies {Schema<AlertConfig>}
   */
  Alert.schema = Object.freeze( /** @type {const} */{
    properties: {
      dismissible: {
        type: 'boolean'
      },
      dismissText: {
        type: 'string'
      },
      disableAutoFocus: {
        type: 'boolean'
      },
      focusOnDismissSelector: {
        type: 'string'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<ButtonMenuConfig>}
   */
  class ButtonMenu extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for button menu
     * @param {ButtonMenuConfig} [config] - Button menu config
     */
    constructor($root, config = {}) {
      super($root, config);

      // If only one button is provided, don't initiate a menu and toggle button
      // if classes have been provided for the toggleButton, apply them to the single item
      if (this.$root.children.length === 1) {
        const $button = this.$root.children[0];
        $button.classList.forEach(className => {
          if (className.startsWith('govuk-button-')) {
            $button.classList.remove(className);
          }
          $button.classList.remove('moj-button-menu__item');
          $button.classList.add('moj-button-menu__single-button');
        });
        if (this.config.buttonClasses) {
          $button.classList.add(...this.config.buttonClasses.split(' '));
        }
      }
      // Otherwise initialise a button menu
      if (this.$root.children.length > 1) {
        this.initMenu();
      }
    }
    initMenu() {
      this.$menu = this.createMenu();
      this.$root.insertAdjacentHTML('afterbegin', this.toggleTemplate());
      this.setupMenuItems();
      this.$menuToggle = this.$root.querySelector(':scope > button');
      this.$items = this.$menu.querySelectorAll('a, button');
      this.$menuToggle.addEventListener('click', event => {
        this.toggleMenu(event);
      });
      this.$root.addEventListener('keydown', event => {
        this.handleKeyDown(event);
      });
      document.addEventListener('click', event => {
        if (event.target instanceof Node && !this.$root.contains(event.target)) {
          this.closeMenu(false);
        }
      });
    }
    createMenu() {
      const $menu = document.createElement('ul');
      $menu.setAttribute('role', 'list');
      $menu.hidden = true;
      $menu.classList.add('moj-button-menu__wrapper');
      if (this.config.alignMenu === 'right') {
        $menu.classList.add('moj-button-menu__wrapper--right');
      }
      this.$root.appendChild($menu);
      while (this.$root.firstChild !== $menu) {
        $menu.appendChild(this.$root.firstChild);
      }
      return $menu;
    }
    setupMenuItems() {
      Array.from(this.$menu.children).forEach($menuItem => {
        // wrap item in li tag
        const $listItem = document.createElement('li');
        this.$menu.insertBefore($listItem, $menuItem);
        $listItem.appendChild($menuItem);
        $menuItem.setAttribute('tabindex', '-1');
        if ($menuItem.tagName === 'BUTTON') {
          $menuItem.setAttribute('type', 'button');
        }
        $menuItem.classList.forEach(className => {
          if (className.startsWith('govuk-button')) {
            $menuItem.classList.remove(className);
          }
        });

        // add a slight delay after click before closing the menu, makes it *feel* better
        $menuItem.addEventListener('click', () => {
          setTimeout(() => {
            this.closeMenu(false);
          }, 50);
        });
      });
    }
    toggleTemplate() {
      return `
    <button type="button" class="govuk-button moj-button-menu__toggle-button ${this.config.buttonClasses || ''}" aria-haspopup="true" aria-expanded="false">
      <span>
       ${this.config.buttonText}
       <svg width="11" height="5" viewBox="0 0 11 5"  xmlns="http://www.w3.org/2000/svg">
         <path d="M5.5 0L11 5L0 5L5.5 0Z" fill="currentColor"/>
       </svg>
      </span>
    </button>`;
    }

    /**
     * @returns {boolean}
     */
    isOpen() {
      return this.$menuToggle.getAttribute('aria-expanded') === 'true';
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    toggleMenu(event) {
      event.preventDefault();

      // If menu is triggered with mouse don't move focus to first item
      const keyboardEvent = event.detail === 0;
      const focusIndex = keyboardEvent ? 0 : -1;
      if (this.isOpen()) {
        this.closeMenu();
      } else {
        this.openMenu(focusIndex);
      }
    }

    /**
     * Opens the menu and optionally sets the focus to the item with given index
     *
     * @param {number} focusIndex - The index of the item to focus
     */
    openMenu(focusIndex = 0) {
      this.$menu.hidden = false;
      this.$menuToggle.setAttribute('aria-expanded', 'true');
      if (focusIndex !== -1) {
        this.focusItem(focusIndex);
      }
    }

    /**
     * Closes the menu and optionally returns focus back to menuToggle
     *
     * @param {boolean} moveFocus - whether to return focus to the toggle button
     */
    closeMenu(moveFocus = true) {
      this.$menu.hidden = true;
      this.$menuToggle.setAttribute('aria-expanded', 'false');
      if (moveFocus) {
        this.$menuToggle.focus();
      }
    }

    /**
     * Focuses the menu item at the specified index
     *
     * @param {number} index - the index of the item to focus
     */
    focusItem(index) {
      if (index >= this.$items.length) index = 0;
      if (index < 0) index = this.$items.length - 1;
      const $menuItem = this.$items.item(index);
      if ($menuItem) {
        $menuItem.focus();
      }
    }
    currentFocusIndex() {
      const $activeElement = document.activeElement;
      const $menuItems = Array.from(this.$items);
      return ($activeElement instanceof HTMLAnchorElement || $activeElement instanceof HTMLButtonElement) && $menuItems.indexOf($activeElement);
    }

    /**
     * @param {KeyboardEvent} event - Keydown event
     */
    handleKeyDown(event) {
      if (event.target === this.$menuToggle) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            this.openMenu();
            break;
          case 'ArrowUp':
            event.preventDefault();
            this.openMenu(this.$items.length - 1);
            break;
        }
      }
      if (event.target instanceof Node && this.$menu.contains(event.target) && this.isOpen()) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            if (this.currentFocusIndex() !== -1) {
              this.focusItem(this.currentFocusIndex() + 1);
            }
            break;
          case 'ArrowUp':
            event.preventDefault();
            if (this.currentFocusIndex() !== -1) {
              this.focusItem(this.currentFocusIndex() - 1);
            }
            break;
          case 'Home':
            event.preventDefault();
            this.focusItem(0);
            break;
          case 'End':
            event.preventDefault();
            this.focusItem(this.$items.length - 1);
            break;
        }
      }
      if (event.key === 'Escape' && this.isOpen()) {
        this.closeMenu();
      }
      if (event.key === 'Tab' && this.isOpen()) {
        this.closeMenu(false);
      }
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * @typedef {object} ButtonMenuConfig
   * @property {string} [buttonText='Actions'] - Label for the toggle button
   * @property {"left" | "right"} [alignMenu='left'] - the alignment of the menu
   * @property {string} [buttonClasses='govuk-button--secondary'] - css classes applied to the toggle button
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  ButtonMenu.moduleName = 'moj-button-menu';
  /**
   * Button menu config
   *
   * @type {ButtonMenuConfig}
   */
  ButtonMenu.defaults = Object.freeze({
    buttonText: 'Actions',
    alignMenu: 'left',
    buttonClasses: ''
  });
  /**
   * Button menu config schema
   *
   * @type {Schema<ButtonMenuConfig>}
   */
  ButtonMenu.schema = Object.freeze( /** @type {const} */{
    properties: {
      buttonText: {
        type: 'string'
      },
      buttonClasses: {
        type: 'string'
      },
      alignMenu: {
        type: 'string'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<DatePickerConfig>}
   */
  class DatePicker extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for date picker
     * @param {DatePickerConfig} [config] - Date picker config
     */
    constructor($root, config = {}) {
      var _this$config$input$el;
      super($root, config);
      const $input = (_this$config$input$el = this.config.input.element) != null ? _this$config$input$el : this.$root.querySelector(this.config.input.selector);
      if (!$input || !($input instanceof HTMLInputElement)) {
        return this;
      }
      this.$input = $input;
      this.dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.currentDate = new Date();
      this.currentDate.setHours(0, 0, 0, 0);
      this.calendarDays = /** @type {DSCalendarDay[]} */[];
      this.excludedDates = /** @type {Date[]} */[];
      this.excludedDays = /** @type {number[]} */[];
      this.buttonClass = 'moj-datepicker__button';
      this.selectedDayButtonClass = 'moj-datepicker__button--selected';
      this.currentDayButtonClass = 'moj-datepicker__button--current';
      this.todayButtonClass = 'moj-datepicker__button--today';
      this.setOptions();
      this.initControls();
    }
    initControls() {
      this.id = `datepicker-${this.$input.id}`;
      this.$dialog = this.createDialog();
      this.createCalendarHeaders();
      const $componentWrapper = document.createElement('div');
      const $inputWrapper = document.createElement('div');
      $componentWrapper.classList.add('moj-datepicker__wrapper');
      $inputWrapper.classList.add('govuk-input__wrapper');
      this.$input.parentElement.insertBefore($componentWrapper, this.$input);
      $componentWrapper.appendChild($inputWrapper);
      $inputWrapper.appendChild(this.$input);
      $inputWrapper.insertAdjacentHTML('beforeend', this.toggleTemplate());
      $componentWrapper.insertAdjacentElement('beforeend', this.$dialog);
      this.$calendarButton = /** @type {HTMLButtonElement} */
      this.$root.querySelector('.moj-js-datepicker-toggle');
      this.$dialogTitle = /** @type {HTMLHeadingElement} */
      this.$dialog.querySelector('.moj-js-datepicker-month-year');
      this.createCalendar();
      this.$prevMonthButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-prev-month');
      this.$prevYearButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-prev-year');
      this.$nextMonthButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-next-month');
      this.$nextYearButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-next-year');
      this.$cancelButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-cancel');
      this.$okButton = /** @type {HTMLButtonElement} */
      this.$dialog.querySelector('.moj-js-datepicker-ok');

      // add event listeners
      this.$prevMonthButton.addEventListener('click', event => this.focusPreviousMonth(event, false));
      this.$prevYearButton.addEventListener('click', event => this.focusPreviousYear(event, false));
      this.$nextMonthButton.addEventListener('click', event => this.focusNextMonth(event, false));
      this.$nextYearButton.addEventListener('click', event => this.focusNextYear(event, false));
      this.$cancelButton.addEventListener('click', event => {
        event.preventDefault();
        this.closeDialog();
      });
      this.$okButton.addEventListener('click', () => {
        this.selectDate(this.currentDate);
      });
      const $dialogButtons = this.$dialog.querySelectorAll('button:not([disabled="true"])');
      this.$firstButtonInDialog = $dialogButtons[0];
      this.$lastButtonInDialog = $dialogButtons[$dialogButtons.length - 1];
      this.$firstButtonInDialog.addEventListener('keydown', event => this.firstButtonKeydown(event));
      this.$lastButtonInDialog.addEventListener('keydown', event => this.lastButtonKeydown(event));
      this.$calendarButton.addEventListener('click', event => this.toggleDialog(event));
      this.$dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          this.closeDialog();
          event.preventDefault();
          event.stopPropagation();
        }
      });
      document.body.addEventListener('mouseup', event => {
        this.backgroundClick(event);
      });

      // populates calendar with initial dates, avoids Wave errors about null buttons
      this.updateCalendar();
    }
    createDialog() {
      const titleId = `datepicker-title-${this.$input.id}`;
      const $dialog = document.createElement('div');
      $dialog.id = this.id;
      $dialog.setAttribute('class', 'moj-datepicker__dialog');
      $dialog.setAttribute('role', 'dialog');
      $dialog.setAttribute('aria-modal', 'true');
      $dialog.setAttribute('aria-labelledby', titleId);
      $dialog.innerHTML = this.dialogTemplate(titleId);
      $dialog.hidden = true;
      return $dialog;
    }
    createCalendar() {
      const $tbody = this.$dialog.querySelector('tbody');
      let dayCount = 0;
      for (let i = 0; i < 6; i++) {
        // create row
        const $row = $tbody.insertRow(i);
        for (let j = 0; j < 7; j++) {
          // create cell (day)
          const $cell = document.createElement('td');
          $row.appendChild($cell);
          const $dateButton = document.createElement('button');
          $dateButton.setAttribute('type', 'button');
          $cell.appendChild($dateButton);
          const calendarDay = new DSCalendarDay($dateButton, dayCount, i, j, this);
          this.calendarDays.push(calendarDay);
          dayCount++;
        }
      }
    }
    toggleTemplate() {
      return `<button class="moj-datepicker__toggle moj-js-datepicker-toggle" type="button" aria-haspopup="dialog" aria-controls="${this.id}" aria-expanded="false">
            <span class="govuk-visually-hidden">Choose date</span>
            <svg width="32" height="24" focusable="false" class="moj-datepicker-icon" aria-hidden="true" role="img" viewBox="0 0 22 22">
              <path
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.1333 2.93333H5.86668V4.4C5.86668 5.21002 5.21003 5.86667 4.40002 5.86667C3.59 5.86667 2.93335 5.21002 2.93335 4.4V2.93333H2C0.895431 2.93333 0 3.82877 0 4.93334V19.2667C0 20.3712 0.89543 21.2667 2 21.2667H20C21.1046 21.2667 22 20.3712 22 19.2667V4.93333C22 3.82876 21.1046 2.93333 20 2.93333H19.0667V4.4C19.0667 5.21002 18.41 5.86667 17.6 5.86667C16.79 5.86667 16.1333 5.21002 16.1333 4.4V2.93333ZM20.5333 8.06667H1.46665V18.8C1.46665 19.3523 1.91436 19.8 2.46665 19.8H19.5333C20.0856 19.8 20.5333 19.3523 20.5333 18.8V8.06667Z"
              ></path>
              <rect x="3.66669" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
              <rect x="16.8667" width="1.46667" height="5.13333" rx="0.733333" fill="currentColor"></rect>
            </svg>
          </button>`;
    }

    /**
     * HTML template for calendar dialog
     *
     * @param {string} [titleId] - Id attribute for dialog title
     * @returns {string}
     */
    dialogTemplate(titleId) {
      return `<div class="moj-datepicker__dialog-header">
            <div class="moj-datepicker__dialog-navbuttons">
              <button type="button" class="moj-datepicker__button moj-js-datepicker-prev-year">
                <span class="govuk-visually-hidden">Previous year</span>
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" fill="none" focusable="false" aria-hidden="true" role="img">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.1643 20L28.9572 14.2071L27.5429 12.7929L20.3358 20L27.5429 27.2071L28.9572 25.7929L23.1643 20Z" fill="currentColor"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.1643 20L22.9572 14.2071L21.5429 12.7929L14.3358 20L21.5429 27.2071L22.9572 25.7929L17.1643 20Z" fill="currentColor"/>
                </svg>
              </button>

              <button type="button" class="moj-datepicker__button moj-js-datepicker-prev-month">
                <span class="govuk-visually-hidden">Previous month</span>
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" focusable="false" aria-hidden="true" role="img">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5729 20L25.7865 14.2071L24.5137 12.7929L18.0273 20L24.5137 27.2071L25.7865 25.7929L20.5729 20Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <h2 id="${titleId}" class="moj-datepicker__dialog-title moj-js-datepicker-month-year" aria-live="polite">June 2020</h2>

            <div class="moj-datepicker__dialog-navbuttons">
              <button type="button" class="moj-datepicker__button moj-js-datepicker-next-month">
                <span class="govuk-visually-hidden">Next month</span>
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none"  focusable="false" aria-hidden="true" role="img">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.4271 20L18.2135 14.2071L19.4863 12.7929L25.9727 20L19.4863 27.2071L18.2135 25.7929L23.4271 20Z" fill="currentColor"/>
                </svg>
              </button>

              <button type="button" class="moj-datepicker__button moj-js-datepicker-next-year">
                <span class="govuk-visually-hidden">Next year</span>
                <svg width="44" height="40" viewBox="0 0 44 40" fill="none" fill="none" focusable="false" aria-hidden="true" role="img">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8357 20L15.0428 14.2071L16.4571 12.7929L23.6642 20L16.4571 27.2071L15.0428 25.7929L20.8357 20Z" fill="currentColor"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M26.8357 20L21.0428 14.2071L22.4571 12.7929L29.6642 20L22.4571 27.2071L21.0428 25.7929L26.8357 20Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <table class="moj-datepicker__calendar moj-js-datepicker-grid" role="grid" aria-labelledby="${titleId}">
            <thead>
              <tr></tr>
            </thead>

            <tbody></tbody>
          </table>

          <div class="govuk-button-group">
            <button type="button" class="govuk-button moj-js-datepicker-ok">Select</button>
            <button type="button" class="govuk-button govuk-button--secondary moj-js-datepicker-cancel">Close</button>
          </div>`;
    }
    createCalendarHeaders() {
      this.dayLabels.forEach(day => {
        const html = `<th scope="col"><span aria-hidden="true">${day.substring(0, 3)}</span><span class="govuk-visually-hidden">${day}</span></th>`;
        const $headerRow = this.$dialog.querySelector('thead > tr');
        $headerRow.insertAdjacentHTML('beforeend', html);
      });
    }

    /**
     * Pads given number with leading zeros
     *
     * @param {number} value - The value to be padded
     * @param {number} length - The length in characters of the output
     * @returns {string}
     */
    leadingZeros(value, length = 2) {
      let ret = value.toString();
      while (ret.length < length) {
        ret = `0${ret}`;
      }
      return ret;
    }
    setOptions() {
      this.setMinAndMaxDatesOnCalendar();
      this.setExcludedDates();
      this.setExcludedDays();
      this.setWeekStartDay();
    }
    setMinAndMaxDatesOnCalendar() {
      if (this.config.minDate) {
        this.minDate = this.formattedDateFromString(this.config.minDate, null);
        if (this.minDate && this.currentDate < this.minDate) {
          this.currentDate = this.minDate;
        }
      }
      if (this.config.maxDate) {
        this.maxDate = this.formattedDateFromString(this.config.maxDate, null);
        if (this.maxDate && this.currentDate > this.maxDate) {
          this.currentDate = this.maxDate;
        }
      }
    }
    setExcludedDates() {
      if (this.config.excludedDates) {
        this.excludedDates = this.config.excludedDates.replace(/\s+/, ' ').split(' ').map(item => {
          return item.includes('-') ? this.parseDateRangeString(item) : [this.formattedDateFromString(item)];
        }).reduce((dates, items) => dates.concat(items)).filter(date => date);
      }
    }

    /**
     * Parses a daterange string into an array of dates
     *
     * @param {string} datestring - A daterange string in the format "dd/mm/yyyy-dd/mm/yyyy"
     */
    parseDateRangeString(datestring) {
      const dates = [];
      const [startDate, endDate] = datestring.split('-').map(d => this.formattedDateFromString(d, null));
      if (startDate && endDate) {
        const date = new Date(startDate.getTime());
        /* eslint-disable no-unmodified-loop-condition */
        while (date <= endDate) {
          dates.push(new Date(date));
          date.setDate(date.getDate() + 1);
        }
        /* eslint-enable no-unmodified-loop-condition */
      }
      return dates;
    }
    setExcludedDays() {
      if (this.config.excludedDays) {
        // lowercase and arrange dayLabels to put indexOf sunday == 0 for comparison
        // with getDay() function
        const weekDays = this.dayLabels.map(item => item.toLowerCase());
        if (this.config.weekStartDay === 'monday') {
          weekDays.unshift(weekDays.pop());
        }
        this.excludedDays = this.config.excludedDays.replace(/\s+/, ' ').toLowerCase().split(' ').map(item => weekDays.indexOf(item)).filter(item => item !== -1);
      }
    }
    setWeekStartDay() {
      const weekStartDayParam = this.config.weekStartDay;
      if (weekStartDayParam && weekStartDayParam.toLowerCase() === 'sunday') {
        this.config.weekStartDay = 'sunday';
        // Rotate dayLabels array to put Sunday as the first item
        this.dayLabels.unshift(this.dayLabels.pop());
      } else {
        this.config.weekStartDay = 'monday';
      }
    }

    /**
     * Determine if a date is selectable
     *
     * @param {Date} date - the date to check
     * @returns {boolean}
     */
    isExcludedDate(date) {
      // This comparison does not work correctly - it will exclude the mindate itself
      // see: https://github.com/ministryofjustice/moj-frontend/issues/923
      if (this.minDate && this.minDate > date) {
        return true;
      }

      // This comparison works as expected - the maxdate will not be excluded
      if (this.maxDate && this.maxDate < date) {
        return true;
      }
      for (const excludedDate of this.excludedDates) {
        if (date.toDateString() === excludedDate.toDateString()) {
          return true;
        }
      }
      if (this.excludedDays.includes(date.getDay())) {
        return true;
      }
      return false;
    }

    /**
     * Get a Date object from a string
     *
     * @param {string} dateString - string in the format d/m/yyyy dd/mm/yyyy
     * @param {Date} fallback - date object to return if formatting fails
     * @returns {Date}
     */
    formattedDateFromString(dateString, fallback = new Date()) {
      let formattedDate = null;
      // Accepts d/m/yyyy and dd/mm/yyyy
      const dateFormatPattern = /(\d{1,2})([-/,. ])(\d{1,2})\2(\d{4})/;
      if (!dateFormatPattern.test(dateString)) return fallback;
      const match = dateFormatPattern.exec(dateString);
      const day = match[1];
      const month = match[3];
      const year = match[4];
      formattedDate = new Date(`${year}-${month}-${day}`);
      if (formattedDate instanceof Date && Number.isFinite(formattedDate.getTime())) {
        return formattedDate;
      }
      return fallback;
    }

    /**
     * Get a formatted date string from a Date object
     *
     * @param {Date} date - date to format to a string
     * @returns {string}
     */
    formattedDateFromDate(date) {
      if (this.config.leadingZeros) {
        return `${this.leadingZeros(date.getDate())}/${this.leadingZeros(date.getMonth() + 1)}/${date.getFullYear()}`;
      }
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    /**
     * Get a human readable date in the format Monday 2 March 2024
     *
     * @param {Date} date - Date to format
     * @returns {string}
     */
    formattedDateHuman(date) {
      return `${this.dayLabels[(date.getDay() + 6) % 7]} ${date.getDate()} ${this.monthLabels[date.getMonth()]} ${date.getFullYear()}`;
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    backgroundClick(event) {
      if (this.isOpen() && event.target instanceof Node && !this.$dialog.contains(event.target) && !this.$input.contains(event.target) && !this.$calendarButton.contains(event.target)) {
        event.preventDefault();
        this.closeDialog();
      }
    }

    /**
     * @param {KeyboardEvent} event - Keydown event
     */
    firstButtonKeydown(event) {
      if (event.key === 'Tab' && event.shiftKey) {
        this.$lastButtonInDialog.focus();
        event.preventDefault();
      }
    }

    /**
     * @param {KeyboardEvent} event - Keydown event
     */
    lastButtonKeydown(event) {
      if (event.key === 'Tab' && !event.shiftKey) {
        this.$firstButtonInDialog.focus();
        event.preventDefault();
      }
    }

    // render calendar
    updateCalendar() {
      this.$dialogTitle.innerHTML = `${this.monthLabels[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
      const day = this.currentDate;
      const firstOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
      let dayOfWeek;
      if (this.config.weekStartDay === 'monday') {
        dayOfWeek = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1; // Change logic to make Monday first day of week, i.e. 0
      } else {
        dayOfWeek = firstOfMonth.getDay();
      }
      firstOfMonth.setDate(firstOfMonth.getDate() - dayOfWeek);
      const thisDay = new Date(firstOfMonth);

      // loop through our days
      for (const calendarDay of this.calendarDays) {
        const hidden = thisDay.getMonth() !== day.getMonth();
        const disabled = this.isExcludedDate(thisDay);
        calendarDay.update(thisDay, hidden, disabled);
        thisDay.setDate(thisDay.getDate() + 1);
      }
    }

    /**
     * @param {boolean} [focus] - Focus the day button
     */
    setCurrentDate(focus = true) {
      const {
        currentDate
      } = this;
      this.calendarDays.forEach(calendarDay => {
        calendarDay.$button.classList.add('moj-datepicker__button');
        calendarDay.$button.classList.add('moj-datepicker__calendar-day');
        calendarDay.$button.setAttribute('tabindex', '-1');
        calendarDay.$button.classList.remove(this.selectedDayButtonClass);
        const calendarDayDate = calendarDay.date;
        calendarDayDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (calendarDayDate.getTime() === currentDate.getTime() /* && !calendarDay.button.disabled */) {
          if (focus) {
            calendarDay.$button.setAttribute('tabindex', '0');
            calendarDay.$button.focus();
            calendarDay.$button.classList.add(this.selectedDayButtonClass);
          }
        }
        if (this.inputDate && calendarDayDate.getTime() === this.inputDate.getTime()) {
          calendarDay.$button.classList.add(this.currentDayButtonClass);
          calendarDay.$button.setAttribute('aria-current', 'date');
        } else {
          calendarDay.$button.classList.remove(this.currentDayButtonClass);
          calendarDay.$button.removeAttribute('aria-current');
        }
        if (calendarDayDate.getTime() === today.getTime()) {
          calendarDay.$button.classList.add(this.todayButtonClass);
        } else {
          calendarDay.$button.classList.remove(this.todayButtonClass);
        }
      });

      // if no date is tab-able, make the first non-disabled date tab-able
      if (!focus) {
        const enabledDays = this.calendarDays.filter(calendarDay => {
          return window.getComputedStyle(calendarDay.$button).display === 'block' && !calendarDay.$button.disabled;
        });
        enabledDays[0].$button.setAttribute('tabindex', '0');
        this.currentDate = enabledDays[0].date;
      }
    }

    /**
     * @param {Date} date - Date to select
     */
    selectDate(date) {
      if (this.isExcludedDate(date)) {
        return;
      }
      this.$calendarButton.querySelector('span').innerText = `Choose date. Selected date is ${this.formattedDateHuman(date)}`;
      this.$input.value = this.formattedDateFromDate(date);
      const changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true
      });
      this.$input.dispatchEvent(changeEvent);
      this.closeDialog();
    }
    isOpen() {
      return this.$dialog.classList.contains('moj-datepicker__dialog--open');
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    toggleDialog(event) {
      event.preventDefault();
      if (this.isOpen()) {
        this.closeDialog();
      } else {
        this.setMinAndMaxDatesOnCalendar();
        this.openDialog();
      }
    }
    openDialog() {
      this.$dialog.hidden = false;
      this.$dialog.classList.add('moj-datepicker__dialog--open');
      this.$calendarButton.setAttribute('aria-expanded', 'true');

      // position the dialog
      // if input is wider than dialog pin it to the right
      if (this.$input.offsetWidth > this.$dialog.offsetWidth) {
        this.$dialog.style.right = `0px`;
      }
      this.$dialog.style.top = `${this.$input.offsetHeight + 3}px`;

      // get the date from the input element
      this.inputDate = this.formattedDateFromString(this.$input.value);
      this.currentDate = this.inputDate;
      this.currentDate.setHours(0, 0, 0, 0);
      this.updateCalendar();
      this.setCurrentDate();
    }
    closeDialog() {
      this.$dialog.hidden = true;
      this.$dialog.classList.remove('moj-datepicker__dialog--open');
      this.$calendarButton.setAttribute('aria-expanded', 'false');
      this.$calendarButton.focus();
    }

    /**
     * @param {Date} date - Date to go to
     * @param {boolean} [focus] - Focus the day button
     */
    goToDate(date, focus) {
      const current = this.currentDate;
      this.currentDate = date;
      if (current.getMonth() !== this.currentDate.getMonth() || current.getFullYear() !== this.currentDate.getFullYear()) {
        this.updateCalendar();
      }
      this.setCurrentDate(focus);
    }

    // day navigation
    focusNextDay() {
      const date = new Date(this.currentDate);
      date.setDate(date.getDate() + 1);
      this.goToDate(date);
    }
    focusPreviousDay() {
      const date = new Date(this.currentDate);
      date.setDate(date.getDate() - 1);
      this.goToDate(date);
    }

    // week navigation
    focusNextWeek() {
      const date = new Date(this.currentDate);
      date.setDate(date.getDate() + 7);
      this.goToDate(date);
    }
    focusPreviousWeek() {
      const date = new Date(this.currentDate);
      date.setDate(date.getDate() - 7);
      this.goToDate(date);
    }
    focusFirstDayOfWeek() {
      const date = new Date(this.currentDate);
      const firstDayOfWeekIndex = this.config.weekStartDay === 'sunday' ? 0 : 1;
      const dayOfWeek = date.getDay();
      const diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek;
      date.setDate(date.getDate() - diff);
      date.setHours(0, 0, 0, 0);
      this.goToDate(date);
    }
    focusLastDayOfWeek() {
      const date = new Date(this.currentDate);
      const lastDayOfWeekIndex = this.config.weekStartDay === 'sunday' ? 6 : 0;
      const dayOfWeek = date.getDay();
      const diff = dayOfWeek <= lastDayOfWeekIndex ? lastDayOfWeekIndex - dayOfWeek : 7 - dayOfWeek;
      date.setDate(date.getDate() + diff);
      date.setHours(0, 0, 0, 0);
      this.goToDate(date);
    }

    /**
     * Month navigation
     *
     * @param {KeyboardEvent | MouseEvent} event - Key press or click event
     * @param {boolean} [focus] - Focus the day button
     */
    focusNextMonth(event, focus = true) {
      event.preventDefault();
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() + 1, 1);
      this.goToDate(date, focus);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} event - Key press or click event
     * @param {boolean} [focus] - Focus the day button
     */
    focusPreviousMonth(event, focus = true) {
      event.preventDefault();
      const date = new Date(this.currentDate);
      date.setMonth(date.getMonth() - 1, 1);
      this.goToDate(date, focus);
    }

    /**
     * Year navigation
     *
     * @param {KeyboardEvent | MouseEvent} event - Key press or click event
     * @param {boolean} [focus] - Focus the day button
     */
    focusNextYear(event, focus = true) {
      event.preventDefault();
      const date = new Date(this.currentDate);
      date.setFullYear(date.getFullYear() + 1, date.getMonth(), 1);
      this.goToDate(date, focus);
    }

    /**
     * @param {KeyboardEvent | MouseEvent} event - Key press or click event
     * @param {boolean} [focus] - Focus the day button
     */
    focusPreviousYear(event, focus = true) {
      event.preventDefault();
      const date = new Date(this.currentDate);
      date.setFullYear(date.getFullYear() - 1, date.getMonth(), 1);
      this.goToDate(date, focus);
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }
  DatePicker.moduleName = 'moj-date-picker';
  /**
   * Date picker default config
   *
   * @type {DatePickerConfig}
   */
  DatePicker.defaults = Object.freeze({
    leadingZeros: false,
    weekStartDay: 'monday',
    input: {
      selector: '.moj-js-datepicker-input'
    }
  });
  /**
   * Date picker config schema
   *
   * @satisfies {Schema<DatePickerConfig>}
   */
  DatePicker.schema = Object.freeze( /** @type {const} */{
    properties: {
      excludedDates: {
        type: 'string'
      },
      excludedDays: {
        type: 'string'
      },
      leadingZeros: {
        type: 'boolean'
      },
      maxDate: {
        type: 'string'
      },
      minDate: {
        type: 'string'
      },
      weekStartDay: {
        type: 'string'
      },
      input: {
        type: 'object'
      }
    }
  });
  class DSCalendarDay {
    /**
     *
     * @param {HTMLButtonElement} $button
     * @param {number} index
     * @param {number} row
     * @param {number} column
     * @param {DatePicker} picker
     */
    constructor($button, index, row, column, picker) {
      this.index = index;
      this.row = row;
      this.column = column;
      this.$button = $button;
      this.picker = picker;
      this.date = new Date();
      this.$button.addEventListener('keydown', this.keyPress.bind(this));
      this.$button.addEventListener('click', this.click.bind(this));
    }

    /**
     * @param {Date} day - the Date for the calendar day
     * @param {boolean} hidden - visibility of the day
     * @param {boolean} disabled - is the day selectable or excluded
     */
    update(day, hidden, disabled) {
      const label = day.getDate();
      let accessibleLabel = this.picker.formattedDateHuman(day);
      if (disabled) {
        this.$button.setAttribute('aria-disabled', 'true');
        accessibleLabel = `Excluded date, ${accessibleLabel}`;
      } else {
        this.$button.removeAttribute('aria-disabled');
      }
      if (hidden) {
        this.$button.style.display = 'none';
      } else {
        this.$button.style.display = 'block';
      }
      this.$button.setAttribute('data-testid', this.picker.formattedDateFromDate(day));
      this.$button.innerHTML = `<span class="govuk-visually-hidden">${accessibleLabel}</span><span aria-hidden="true">${label}</span>`;
      this.date = new Date(day);
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    click(event) {
      this.picker.goToDate(this.date);
      this.picker.selectDate(this.date);
      event.stopPropagation();
      event.preventDefault();
    }

    /**
     * @param {KeyboardEvent} event - Keydown event
     */
    keyPress(event) {
      let calendarNavKey = true;
      switch (event.key) {
        case 'ArrowLeft':
          this.picker.focusPreviousDay();
          break;
        case 'ArrowRight':
          this.picker.focusNextDay();
          break;
        case 'ArrowUp':
          this.picker.focusPreviousWeek();
          break;
        case 'ArrowDown':
          this.picker.focusNextWeek();
          break;
        case 'Home':
          this.picker.focusFirstDayOfWeek();
          break;
        case 'End':
          this.picker.focusLastDayOfWeek();
          break;
        case 'PageUp':
          {
            if (event.shiftKey) {
              this.picker.focusPreviousYear(event);
            } else {
              this.picker.focusPreviousMonth(event);
            }
            break;
          }
        case 'PageDown':
          {
            if (event.shiftKey) {
              this.picker.focusNextYear(event);
            } else {
              this.picker.focusNextMonth(event);
            }
            break;
          }
        default:
          calendarNavKey = false;
          break;
      }
      if (calendarNavKey) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  /**
   * Date picker config
   *
   * @typedef {object} DatePickerConfig
   * @property {string} [excludedDates] - Dates that cannot be selected
   * @property {string} [excludedDays] - Days that cannot be selected
   * @property {boolean} [leadingZeros] - Whether to add leading zeroes when populating the field
   * @property {string} [minDate] - The earliest available date
   * @property {string} [maxDate] - The latest available date
   * @property {string} [weekStartDay] - First day of the week in calendar view
   * @property {object} [input] - Input config
   * @property {string} [input.selector] - Selector for the input element
   * @property {Element | null} [input.element] - HTML element for the input
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */

  /**
   * @augments {ConfigurableComponent<FilterToggleButtonConfig>}
   */
  class FilterToggleButton extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for filter toggle button
     * @param {FilterToggleButtonConfig} [config] - Filter toggle button config
     */
    constructor($root, config = {}) {
      var _this$config$toggleBu, _this$config$closeBut;
      super($root, config);
      const $toggleButtonContainer = (_this$config$toggleBu = this.config.toggleButtonContainer.element) != null ? _this$config$toggleBu : document.querySelector(this.config.toggleButtonContainer.selector);
      const $closeButtonContainer = (_this$config$closeBut = this.config.closeButtonContainer.element) != null ? _this$config$closeBut : this.$root.querySelector(this.config.closeButtonContainer.selector);
      if (!($toggleButtonContainer instanceof HTMLElement && $closeButtonContainer instanceof HTMLElement)) {
        return this;
      }
      this.$toggleButtonContainer = $toggleButtonContainer;
      this.$closeButtonContainer = $closeButtonContainer;
      this.createToggleButton();
      this.setupResponsiveChecks();
      this.$root.setAttribute('tabindex', '-1');
      if (this.config.startHidden) {
        this.hideMenu();
      }
    }
    setupResponsiveChecks() {
      this.mq = window.matchMedia(this.config.bigModeMediaQuery);
      this.mq.addListener(this.checkMode.bind(this));
      this.checkMode();
    }
    createToggleButton() {
      this.$menuButton = document.createElement('button');
      this.$menuButton.setAttribute('type', 'button');
      this.$menuButton.setAttribute('aria-haspopup', 'true');
      this.$menuButton.setAttribute('aria-expanded', 'false');
      this.$menuButton.className = `govuk-button ${this.config.toggleButton.classes}`;
      this.$menuButton.textContent = this.config.toggleButton.showText;
      this.$menuButton.addEventListener('click', this.onMenuButtonClick.bind(this));
      this.$toggleButtonContainer.append(this.$menuButton);
    }
    checkMode() {
      if (this.mq.matches) {
        this.enableBigMode();
      } else {
        this.enableSmallMode();
      }
    }
    enableBigMode() {
      this.showMenu();
      this.removeCloseButton();
    }
    enableSmallMode() {
      this.hideMenu();
      this.addCloseButton();
    }
    addCloseButton() {
      this.$closeButton = document.createElement('button');
      this.$closeButton.setAttribute('type', 'button');
      this.$closeButton.className = this.config.closeButton.classes;
      this.$closeButton.textContent = this.config.closeButton.text;
      this.$closeButton.addEventListener('click', this.onCloseClick.bind(this));
      this.$closeButtonContainer.append(this.$closeButton);
    }
    onCloseClick() {
      this.hideMenu();
      this.$menuButton.focus();
    }
    removeCloseButton() {
      if (this.$closeButton) {
        this.$closeButton.remove();
        this.$closeButton = null;
      }
    }
    hideMenu() {
      this.$menuButton.setAttribute('aria-expanded', 'false');
      this.$root.classList.add('moj-js-hidden');
      this.$menuButton.textContent = this.config.toggleButton.showText;
    }
    showMenu() {
      this.$menuButton.setAttribute('aria-expanded', 'true');
      this.$root.classList.remove('moj-js-hidden');
      this.$menuButton.textContent = this.config.toggleButton.hideText;
    }
    onMenuButtonClick() {
      this.toggle();
    }
    toggle() {
      if (this.$menuButton.getAttribute('aria-expanded') === 'false') {
        this.showMenu();
        this.$root.focus();
      } else {
        this.hideMenu();
      }
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * @typedef {object} FilterToggleButtonConfig
   * @property {string} [bigModeMediaQuery] - Media query for big mode
   * @property {boolean} [startHidden] - Whether to start hidden
   * @property {object} [toggleButton] - Toggle button config
   * @property {string} [toggleButton.showText] - Text for show button
   * @property {string} [toggleButton.hideText] - Text for hide button
   * @property {string} [toggleButton.classes] - Classes for toggle button
   * @property {object} [toggleButtonContainer] - Toggle button container config
   * @property {string} [toggleButtonContainer.selector] - Selector for toggle button container
   * @property {Element | null} [toggleButtonContainer.element] - HTML element for toggle button container
   * @property {object} [closeButton] - Close button config
   * @property {string} [closeButton.text] - Text for close button
   * @property {string} [closeButton.classes] - Classes for close button
   * @property {object} [closeButtonContainer] - Close button container config
   * @property {string} [closeButtonContainer.selector] - Selector for close button container
   * @property {Element | null} [closeButtonContainer.element] - HTML element for close button container
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  FilterToggleButton.moduleName = 'moj-filter';
  /**
   * Filter toggle button config
   *
   * @type {FilterToggleButtonConfig}
   */
  FilterToggleButton.defaults = Object.freeze({
    bigModeMediaQuery: '(min-width: 48.0625em)',
    startHidden: true,
    toggleButton: {
      showText: 'Show filter',
      hideText: 'Hide filter',
      classes: 'govuk-button--secondary'
    },
    toggleButtonContainer: {
      selector: '.moj-action-bar__filter'
    },
    closeButton: {
      text: 'Close',
      classes: 'moj-filter__close'
    },
    closeButtonContainer: {
      selector: '.moj-filter__header-action'
    }
  });
  /**
   * Filter toggle button config schema
   *
   * @satisfies {Schema<FilterToggleButtonConfig>}
   */
  FilterToggleButton.schema = Object.freeze( /** @type {const} */{
    properties: {
      bigModeMediaQuery: {
        type: 'string'
      },
      startHidden: {
        type: 'boolean'
      },
      toggleButton: {
        type: 'object'
      },
      toggleButtonContainer: {
        type: 'object'
      },
      closeButton: {
        type: 'object'
      },
      closeButtonContainer: {
        type: 'object'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<FormValidatorConfig, HTMLFormElement>}
   */
  class FormValidator extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for form validator
     * @param {FormValidatorConfig} [config] - Form validator config
     */
    constructor($root, config = {}) {
      super($root, config);
      const $summary = this.config.summary.element || document.querySelector(this.config.summary.selector);
      if (!$summary || !($summary instanceof HTMLElement)) {
        return this;
      }
      this.$summary = $summary;
      this.errors = /** @type {ValidationError[]} */[];
      this.validators = /** @type {Validator[]} */[];
      this.originalTitle = document.title;
      this.$root.addEventListener('submit', this.onSubmit.bind(this));
    }
    escapeHtml(string = '') {
      return String(string).replace(/[&<>"'`=/]/g, name => FormValidator.entityMap[name]);
    }
    resetTitle() {
      document.title = this.originalTitle;
    }
    updateTitle() {
      document.title = `${this.errors.length} errors - ${document.title}`;
    }
    showSummary() {
      this.$summary.innerHTML = this.getSummaryHtml();
      this.$summary.classList.remove('moj-hidden');
      this.$summary.setAttribute('aria-labelledby', 'errorSummary-heading');
      this.$summary.focus();
    }
    getSummaryHtml() {
      let html = '<h2 id="error-summary-title" class="govuk-error-summary__title">There is a problem</h2>';
      html += '<div class="govuk-error-summary__body">';
      html += '<ul class="govuk-list govuk-error-summary__list">';
      for (const error of this.errors) {
        html += '<li>';
        html += `<a href="#${this.escapeHtml(error.fieldName)}">`;
        html += this.escapeHtml(error.message);
        html += '</a>';
        html += '</li>';
      }
      html += '</ul>';
      html += '</div>';
      return html;
    }
    hideSummary() {
      this.$summary.classList.add('moj-hidden');
      this.$summary.removeAttribute('aria-labelledby');
    }

    /**
     * @param {SubmitEvent} event - Form submit event
     */
    onSubmit(event) {
      this.removeInlineErrors();
      this.hideSummary();
      this.resetTitle();
      if (!this.validate()) {
        event.preventDefault();
        this.updateTitle();
        this.showSummary();
        this.showInlineErrors();
      }
    }
    showInlineErrors() {
      for (const error of this.errors) {
        this.showInlineError(error);
      }
    }

    /**
     * @param {ValidationError} error
     */
    showInlineError(error) {
      const $errorSpan = document.createElement('span');
      $errorSpan.id = `${error.fieldName}-error`;
      $errorSpan.classList.add('govuk-error-message');
      $errorSpan.innerHTML = this.escapeHtml(error.message);
      const $control = document.querySelector(`#${error.fieldName}`);
      const $fieldset = $control.closest('.govuk-fieldset');
      const $fieldContainer = ($fieldset || $control).closest('.govuk-form-group');
      const $label = $fieldContainer.querySelector('label');
      const $legend = $fieldContainer.querySelector('legend');
      $fieldContainer.classList.add('govuk-form-group--error');
      if ($fieldset && $legend) {
        $legend.after($errorSpan);
        $fieldContainer.setAttribute('aria-invalid', 'true');
        addAttributeValue($fieldset, 'aria-describedby', $errorSpan.id);
      } else if ($label && $control) {
        $label.after($errorSpan);
        $control.setAttribute('aria-invalid', 'true');
        addAttributeValue($control, 'aria-describedby', $errorSpan.id);
      }
    }
    removeInlineErrors() {
      for (const error of this.errors) {
        this.removeInlineError(error);
      }
    }

    /**
     * @param {ValidationError} error
     */
    removeInlineError(error) {
      const $errorSpan = document.querySelector(`#${error.fieldName}-error`);
      const $control = document.querySelector(`#${error.fieldName}`);
      const $fieldset = $control.closest('.govuk-fieldset');
      const $fieldContainer = ($fieldset || $control).closest('.govuk-form-group');
      const $label = $fieldContainer.querySelector('label');
      const $legend = $fieldContainer.querySelector('legend');
      $errorSpan.remove();
      $fieldContainer.classList.remove('govuk-form-group--error');
      if ($fieldset && $legend) {
        $fieldContainer.removeAttribute('aria-invalid');
        removeAttributeValue($fieldset, 'aria-describedby', $errorSpan.id);
      } else if ($label && $control) {
        $control.removeAttribute('aria-invalid');
        removeAttributeValue($control, 'aria-describedby', $errorSpan.id);
      }
    }

    /**
     * @param {string} fieldName - Field name
     * @param {ValidationRule[]} rules - Validation rules
     */
    addValidator(fieldName, rules) {
      this.validators.push({
        fieldName,
        rules,
        field: this.$root.elements.namedItem(fieldName)
      });
    }
    validate() {
      this.errors = [];

      /** @type {Validator | null} */
      let validator = null;

      /** @type {boolean | string} */
      let validatorReturnValue = true;
      let i;
      let j;
      for (i = 0; i < this.validators.length; i++) {
        validator = this.validators[i];
        for (j = 0; j < validator.rules.length; j++) {
          validatorReturnValue = validator.rules[j].method(validator.field, validator.rules[j].params);
          if (typeof validatorReturnValue === 'boolean' && !validatorReturnValue) {
            this.errors.push({
              fieldName: validator.fieldName,
              message: validator.rules[j].message
            });
            break;
          } else if (typeof validatorReturnValue === 'string') {
            this.errors.push({
              fieldName: validatorReturnValue,
              message: validator.rules[j].message
            });
            break;
          }
        }
      }
      return this.errors.length === 0;
    }

    /**
     * @type {Record<string, string>}
     */
  }

  /**
   * @typedef {object} FormValidatorConfig
   * @property {object} [summary] - Error summary config
   * @property {string} [summary.selector] - Selector for error summary
   * @property {Element | null} [summary.element] - HTML element for error summary
   */

  /**
   * @typedef {object} ValidationRule
   * @property {(field: Validator['field'], params: Record<string, Validator['field']>) => boolean | string} method - Validation method
   * @property {string} message - Error message
   * @property {Record<string, Validator['field']>} [params] - Parameters for validation
   */

  /**
   * @typedef {object} ValidationError
   * @property {string} fieldName - Name of the field
   * @property {string} message - Validation error message
   */

  /**
   * @typedef {object} Validator
   * @property {string} fieldName - Name of the field
   * @property {ValidationRule[]} rules - Validation rules
   * @property {Element | RadioNodeList} field - Form field
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  FormValidator.entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  /**
   * Name for the component used when initialising using data-module attributes.
   */
  FormValidator.moduleName = 'moj-form-validator';
  /**
   * Multi file upload default config
   *
   * @type {FormValidatorConfig}
   */
  FormValidator.defaults = Object.freeze({
    summary: {
      selector: '.govuk-error-summary'
    }
  });
  /**
   * Multi file upload config schema
   *
   * @satisfies {Schema<FormValidatorConfig>}
   */
  FormValidator.schema = Object.freeze( /** @type {const} */{
    properties: {
      summary: {
        type: 'object'
      }
    }
  });

  /* eslint-disable @typescript-eslint/no-empty-function */

  /**
   * @augments {ConfigurableComponent<MultiFileUploadConfig>}
   */
  class MultiFileUpload extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for multi file upload
     * @param {MultiFileUploadConfig} [config] - Multi file upload config
     */
    constructor($root, config = {}) {
      var _this$config$feedback;
      super($root, config);
      if (!MultiFileUpload.isSupported()) {
        return this;
      }
      const $feedbackContainer = (_this$config$feedback = this.config.feedbackContainer.element) != null ? _this$config$feedback : this.$root.querySelector(this.config.feedbackContainer.selector);
      if (!$feedbackContainer || !($feedbackContainer instanceof HTMLElement)) {
        return this;
      }
      this.$feedbackContainer = $feedbackContainer;
      this.setupFileInput();
      this.setupDropzone();
      this.setupLabel();
      this.setupStatusBox();
      this.$root.addEventListener('click', this.onFileDeleteClick.bind(this));
      this.$root.classList.add('moj-multi-file-upload--enhanced');
    }
    setupDropzone() {
      this.$dropzone = document.createElement('div');
      this.$dropzone.classList.add('moj-multi-file-upload__dropzone');
      this.$dropzone.addEventListener('dragover', this.onDragOver.bind(this));
      this.$dropzone.addEventListener('dragleave', this.onDragLeave.bind(this));
      this.$dropzone.addEventListener('drop', this.onDrop.bind(this));
      this.$fileInput.replaceWith(this.$dropzone);
      this.$dropzone.appendChild(this.$fileInput);
    }
    setupLabel() {
      const $label = document.createElement('label');
      $label.setAttribute('for', this.$fileInput.id);
      $label.classList.add('govuk-button', 'govuk-button--secondary');
      $label.textContent = this.config.dropzoneButtonText;
      const $hint = document.createElement('p');
      $hint.classList.add('govuk-body');
      $hint.textContent = this.config.dropzoneHintText;
      this.$label = $label;
      this.$dropzone.append($hint);
      this.$dropzone.append($label);
    }
    setupFileInput() {
      this.$fileInput = /** @type {HTMLInputElement} */
      this.$root.querySelector('.moj-multi-file-upload__input');
      this.$fileInput.addEventListener('change', this.onFileChange.bind(this));
      this.$fileInput.addEventListener('focus', this.onFileFocus.bind(this));
      this.$fileInput.addEventListener('blur', this.onFileBlur.bind(this));
    }
    setupStatusBox() {
      this.$status = document.createElement('div');
      this.$status.classList.add('govuk-visually-hidden');
      this.$status.setAttribute('aria-live', 'polite');
      this.$status.setAttribute('role', 'status');
      this.$dropzone.append(this.$status);
    }

    /**
     * @param {DragEvent} event - Drag event
     */
    onDragOver(event) {
      event.preventDefault();
      this.$dropzone.classList.add('moj-multi-file-upload--dragover');
    }
    onDragLeave() {
      this.$dropzone.classList.remove('moj-multi-file-upload--dragover');
    }

    /**
     * @param {DragEvent} event - Drag event
     */
    onDrop(event) {
      event.preventDefault();
      this.$dropzone.classList.remove('moj-multi-file-upload--dragover');
      this.$feedbackContainer.classList.remove('moj-hidden');
      this.$status.textContent = this.config.uploadStatusText;
      this.uploadFiles(event.dataTransfer.files);
    }

    /**
     * @param {FileList} files - File list
     */
    uploadFiles(files) {
      for (const file of Array.from(files)) {
        this.uploadFile(file);
      }
    }
    onFileChange() {
      this.$feedbackContainer.classList.remove('moj-hidden');
      this.$status.textContent = this.config.uploadStatusText;
      this.uploadFiles(this.$fileInput.files);
      const $fileInput = this.$fileInput.cloneNode(true);
      if (!$fileInput || !($fileInput instanceof HTMLInputElement)) {
        return;
      }
      $fileInput.value = '';
      this.$fileInput.replaceWith($fileInput);
      this.setupFileInput();
      this.$fileInput.focus();
    }
    onFileFocus() {
      this.$label.classList.add('moj-multi-file-upload--focused');
    }
    onFileBlur() {
      this.$label.classList.remove('moj-multi-file-upload--focused');
    }

    /**
     * @param {UploadResponseSuccess['success']} success
     */
    getSuccessHtml(success) {
      return `<span class="moj-multi-file-upload__success"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/></svg>${success.messageHtml}</span>`;
    }

    /**
     * @param {UploadResponseError['error']} error
     */
    getErrorHtml(error) {
      return `<span class="moj-multi-file-upload__error"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/></svg>${error.message}</span>`;
    }

    /**
     * @param {File} file
     */
    getFileRow(file) {
      const $row = document.createElement('div');
      $row.classList.add('govuk-summary-list__row', 'moj-multi-file-upload__row');
      $row.innerHTML = `
    <div class="govuk-summary-list__value moj-multi-file-upload__message">
      <span class="moj-multi-file-upload__filename">${file.name}</span>
      <span class="moj-multi-file-upload__progress">0%</span>
    </div>
    <div class="govuk-summary-list__actions moj-multi-file-upload__actions"></div>
  `;
      return $row;
    }

    /**
     * @param {UploadResponseFile} file
     */
    getDeleteButton(file) {
      const $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('name', 'delete');
      $button.setAttribute('value', file.filename);
      $button.classList.add('moj-multi-file-upload__delete', 'govuk-button', 'govuk-button--secondary', 'govuk-!-margin-bottom-0');
      $button.innerHTML = `Delete <span class="govuk-visually-hidden">${file.originalname}</span>`;
      return $button;
    }

    /**
     * @param {File} file
     */
    uploadFile(file) {
      this.config.hooks.entryHook(this, file);
      const $item = this.getFileRow(file);
      const $message = $item.querySelector('.moj-multi-file-upload__message');
      const $actions = $item.querySelector('.moj-multi-file-upload__actions');
      const $progress = $item.querySelector('.moj-multi-file-upload__progress');
      const formData = new FormData();
      formData.append('documents', file);
      this.$feedbackContainer.querySelector('.moj-multi-file-upload__list').append($item);
      const xhr = new XMLHttpRequest();
      const onLoad = () => {
        if (xhr.status < 200 || xhr.status >= 300 || !('success' in xhr.response)) {
          return onError();
        }
        $message.innerHTML = this.getSuccessHtml(xhr.response.success);
        this.$status.textContent = xhr.response.success.messageText;
        $actions.append(this.getDeleteButton(xhr.response.file));
        this.config.hooks.exitHook(this, file, xhr, xhr.responseText);
      };
      const onError = () => {
        const error = new Error(xhr.response && 'error' in xhr.response ? xhr.response.error.message : xhr.statusText || 'Upload failed');
        $message.innerHTML = this.getErrorHtml(error);
        this.$status.textContent = error.message;
        this.config.hooks.errorHook(this, file, xhr, xhr.responseText, error);
      };
      xhr.addEventListener('load', onLoad);
      xhr.addEventListener('error', onError);
      xhr.upload.addEventListener('progress', event => {
        if (!event.lengthComputable) {
          return;
        }
        const percentComplete = Math.round(event.loaded / event.total * 100);
        $progress.textContent = ` ${percentComplete}%`;
      });
      xhr.open('POST', this.config.uploadUrl);
      xhr.responseType = 'json';
      xhr.send(formData);
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onFileDeleteClick(event) {
      const $button = event.target;
      if (!$button || !($button instanceof HTMLButtonElement) || !$button.classList.contains('moj-multi-file-upload__delete')) {
        return;
      }
      event.preventDefault(); // if user refreshes page and then deletes

      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        if (xhr.status < 200 || xhr.status >= 300) {
          return;
        }
        const $rows = Array.from(this.$feedbackContainer.querySelectorAll('.moj-multi-file-upload__row'));
        if ($rows.length === 1) {
          this.$feedbackContainer.classList.add('moj-hidden');
        }
        const $rowDelete = $rows.find($row => $row.contains($button));
        if ($rowDelete) $rowDelete.remove();
        this.config.hooks.deleteHook(this, undefined, xhr, xhr.responseText);
      });
      xhr.open('POST', this.config.deleteUrl);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.responseType = 'json';
      xhr.send(JSON.stringify({
        [$button.name]: $button.value
      }));
    }
    static isSupported() {
      return this.isDragAndDropSupported() && this.isFormDataSupported() && this.isFileApiSupported();
    }
    static isDragAndDropSupported() {
      const div = document.createElement('div');
      return typeof div.ondrop !== 'undefined';
    }
    static isFormDataSupported() {
      return typeof FormData === 'function';
    }
    static isFileApiSupported() {
      const input = document.createElement('input');
      input.type = 'file';
      return typeof input.files !== 'undefined';
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * Multi file upload config
   *
   * @typedef {object} MultiFileUploadConfig
   * @property {string} [uploadUrl] - File upload URL
   * @property {string} [deleteUrl] - File delete URL
   * @property {string} [uploadStatusText] - Upload status text
   * @property {string} [dropzoneHintText] - Dropzone hint text
   * @property {string} [dropzoneButtonText] - Dropzone button text
   * @property {object} [feedbackContainer] - Feedback container config
   * @property {string} [feedbackContainer.selector] - Selector for feedback container
   * @property {Element | null} [feedbackContainer.element] - HTML element for feedback container
   * @property {MultiFileUploadHooks} [hooks] - Upload hooks
   */

  /**
   * Multi file upload hooks
   *
   * @typedef {object} MultiFileUploadHooks
   * @property {OnUploadFileEntryHook} [entryHook] - File upload entry hook
   * @property {OnUploadFileExitHook} [exitHook] - File upload exit hook
   * @property {OnUploadFileErrorHook} [errorHook] - File upload error hook
   * @property {OnUploadFileDeleteHook} [deleteHook] - File delete hook
   */

  /**
   * Upload hook: File entry
   *
   * @callback OnUploadFileEntryHook
   * @param {InstanceType<typeof MultiFileUpload>} upload - Multi file upload
   * @param {File} file - File upload
   */

  /**
   * Upload hook: File exit
   *
   * @callback OnUploadFileExitHook
   * @param {InstanceType<typeof MultiFileUpload>} upload - Multi file upload
   * @param {File} file - File upload
   * @param {XMLHttpRequest} xhr - XMLHttpRequest
   * @param {string} textStatus - Text status
   */

  /**
   * Upload hook: File error
   *
   * @callback OnUploadFileErrorHook
   * @param {InstanceType<typeof MultiFileUpload>} upload - Multi file upload
   * @param {File} file - File upload
   * @param {XMLHttpRequest} xhr - XMLHttpRequest
   * @param {string} textStatus - Text status
   * @param {Error} errorThrown - Error thrown
   */

  /**
   * Upload hook: File delete
   *
   * @callback OnUploadFileDeleteHook
   * @param {InstanceType<typeof MultiFileUpload>} upload - Multi file upload
   * @param {File} [file] - File upload
   * @param {XMLHttpRequest} xhr - XMLHttpRequest
   * @param {string} textStatus - Text status
   */

  /**
   * @typedef {object} UploadResponseSuccess
   * @property {{ messageText: string, messageHtml: string }} success - Response success
   * @property {UploadResponseFile} file - Response file
   */

  /**
   * @typedef {object} UploadResponseError
   * @property {{ message: string }} error - Response error
   * @property {UploadResponseFile} file - Response file
   */

  /**
   * @typedef {object} UploadResponseFile
   * @property {string} filename - File name
   * @property {string} originalname - Original file name
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  MultiFileUpload.moduleName = 'moj-multi-file-upload';
  /**
   * Multi file upload default config
   *
   * @type {MultiFileUploadConfig}
   */
  MultiFileUpload.defaults = Object.freeze({
    uploadStatusText: 'Uploading files, please wait',
    dropzoneHintText: 'Drag and drop files here or',
    dropzoneButtonText: 'Choose files',
    feedbackContainer: {
      selector: '.moj-multi-file__uploaded-files'
    },
    hooks: {
      entryHook: () => {},
      exitHook: () => {},
      errorHook: () => {},
      deleteHook: () => {}
    }
  });
  /**
   * Multi file upload config schema
   *
   * @satisfies {Schema<MultiFileUploadConfig>}
   */
  MultiFileUpload.schema = Object.freeze( /** @type {const} */{
    properties: {
      uploadUrl: {
        type: 'string'
      },
      deleteUrl: {
        type: 'string'
      },
      uploadStatusText: {
        type: 'string'
      },
      dropzoneHintText: {
        type: 'string'
      },
      dropzoneButtonText: {
        type: 'string'
      },
      feedbackContainer: {
        type: 'object'
      },
      hooks: {
        type: 'object'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<MultiSelectConfig>}
   */
  class MultiSelect extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for multi select
     * @param {MultiSelectConfig} [config] - Multi select config
     */
    constructor($root, config = {}) {
      var _this$config$checkbox;
      super($root, config);
      const $container = this.$root.querySelector(`#${this.config.idPrefix}select-all`);
      const $checkboxes = /** @type {NodeListOf<HTMLInputElement>} */(_this$config$checkbox = this.config.checkboxes.items) != null ? _this$config$checkbox : this.$root.querySelectorAll(this.config.checkboxes.selector);
      if (!$container || !($container instanceof HTMLElement) || !$checkboxes.length) {
        return this;
      }
      this.setupToggle(this.config.idPrefix);
      this.$toggleButton = this.$toggle.querySelector('input');
      this.$toggleButton.addEventListener('click', this.onButtonClick.bind(this));
      this.$container = $container;
      this.$container.append(this.$toggle);
      this.$checkboxes = Array.from($checkboxes);
      this.$checkboxes.forEach($input => $input.addEventListener('click', this.onCheckboxClick.bind(this)));
      this.checked = config.checked || false;
    }
    setupToggle(idPrefix = '') {
      const id = `${idPrefix}checkboxes-all`;
      const $toggle = document.createElement('div');
      const $label = document.createElement('label');
      const $input = document.createElement('input');
      const $span = document.createElement('span');
      $toggle.classList.add('govuk-checkboxes__item', 'govuk-checkboxes--small', 'moj-multi-select__checkbox');
      $input.id = id;
      $input.type = 'checkbox';
      $input.classList.add('govuk-checkboxes__input');
      $label.setAttribute('for', id);
      $label.classList.add('govuk-label', 'govuk-checkboxes__label', 'moj-multi-select__toggle-label');
      $span.classList.add('govuk-visually-hidden');
      $span.textContent = 'Select all';
      $label.append($span);
      $toggle.append($input, $label);
      this.$toggle = $toggle;
    }
    onButtonClick() {
      if (this.checked) {
        this.uncheckAll();
        this.$toggleButton.checked = false;
      } else {
        this.checkAll();
        this.$toggleButton.checked = true;
      }
    }
    checkAll() {
      this.$checkboxes.forEach($input => {
        $input.checked = true;
      });
      this.checked = true;
    }
    uncheckAll() {
      this.$checkboxes.forEach($input => {
        $input.checked = false;
      });
      this.checked = false;
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onCheckboxClick(event) {
      if (!(event.target instanceof HTMLInputElement)) {
        return;
      }
      if (!event.target.checked) {
        this.$toggleButton.checked = false;
        this.checked = false;
      } else {
        if (this.$checkboxes.filter($input => $input.checked).length === this.$checkboxes.length) {
          this.$toggleButton.checked = true;
          this.checked = true;
        }
      }
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * Multi select config
   *
   * @typedef {object} MultiSelectConfig
   * @property {string} [idPrefix] - Prefix for the Select all" checkbox `id` attribute
   * @property {boolean} [checked] - Whether the "Select all" checkbox is checked
   * @property {object} [checkboxes] - Checkboxes config
   * @property {string} [checkboxes.selector] - Checkboxes query selector
   * @property {NodeListOf<HTMLInputElement>} [checkboxes.items] - Checkboxes query selector results
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  MultiSelect.moduleName = 'moj-multi-select';
  /**
   * Multi select config
   *
   * @type {MultiSelectConfig}
   */
  MultiSelect.defaults = Object.freeze({
    idPrefix: '',
    checkboxes: {
      selector: 'tbody input.govuk-checkboxes__input'
    }
  });
  /**
   * Multi select config schema
   *
   * @satisfies {Schema<MultiSelectConfig>}
   */
  MultiSelect.schema = Object.freeze( /** @type {const} */{
    properties: {
      idPrefix: {
        type: 'string'
      },
      checked: {
        type: 'boolean'
      },
      checkboxes: {
        type: 'object'
      }
    }
  });
  class PasswordReveal extends govukFrontend.Component {
    /**
     * @param {Element | null} $root - HTML element to use for password reveal
     */
    constructor($root) {
      super($root);
      const $input = this.$root.querySelector('.govuk-input');
      if (!$input || !($input instanceof HTMLInputElement)) {
        return this;
      }
      this.$input = $input;
      this.$input.setAttribute('spellcheck', 'false');
      this.createButton();
    }
    createButton() {
      this.$group = document.createElement('div');
      this.$button = document.createElement('button');
      this.$button.setAttribute('type', 'button');
      this.$root.classList.add('moj-password-reveal');
      this.$group.classList.add('moj-password-reveal__wrapper');
      this.$button.classList.add('govuk-button', 'govuk-button--secondary', 'moj-password-reveal__button');
      this.$button.innerHTML = 'Show <span class="govuk-visually-hidden">password</span>';
      this.$button.addEventListener('click', this.onButtonClick.bind(this));
      this.$group.append(this.$input, this.$button);
      this.$root.append(this.$group);
    }
    onButtonClick() {
      if (this.$input.type === 'password') {
        this.$input.type = 'text';
        this.$button.innerHTML = 'Hide <span class="govuk-visually-hidden">password</span>';
      } else {
        this.$input.type = 'password';
        this.$button.innerHTML = 'Show <span class="govuk-visually-hidden">password</span>';
      }
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }
  PasswordReveal.moduleName = 'moj-password-reveal';

  /**
   * @augments {ConfigurableComponent<RichTextEditorConfig>}
   */
  class RichTextEditor extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for rich text editor
     * @param {RichTextEditorConfig} config
     */
    constructor($root, config = {}) {
      super($root, config);
      if (!RichTextEditor.isSupported()) {
        return this;
      }
      const $textarea = this.$root.querySelector('.govuk-textarea');
      if (!$textarea || !($textarea instanceof HTMLTextAreaElement)) {
        return this;
      }
      this.$textarea = $textarea;
      this.createToolbar();
      this.hideDefault();
      this.configureToolbar();
      this.keys = {
        left: 37,
        right: 39,
        up: 38,
        down: 40
      };
      this.$content.addEventListener('input', this.onEditorInput.bind(this));
      this.$root.querySelector('label').addEventListener('click', this.onLabelClick.bind(this));
      this.$toolbar.addEventListener('keydown', this.onToolbarKeydown.bind(this));
    }

    /**
     * @param {KeyboardEvent} event - Click event
     */
    onToolbarKeydown(event) {
      let $focusableButton;
      switch (event.keyCode) {
        case this.keys.right:
        case this.keys.down:
          {
            $focusableButton = this.$buttons.find(button => button.getAttribute('tabindex') === '0');
            if ($focusableButton) {
              const $nextButton = $focusableButton.nextElementSibling;
              if ($nextButton && $nextButton instanceof HTMLButtonElement) {
                $nextButton.focus();
                $focusableButton.setAttribute('tabindex', '-1');
                $nextButton.setAttribute('tabindex', '0');
              }
            }
            break;
          }
        case this.keys.left:
        case this.keys.up:
          {
            $focusableButton = this.$buttons.find(button => button.getAttribute('tabindex') === '0');
            if ($focusableButton) {
              const $previousButton = $focusableButton.previousElementSibling;
              if ($previousButton && $previousButton instanceof HTMLButtonElement) {
                $previousButton.focus();
                $focusableButton.setAttribute('tabindex', '-1');
                $previousButton.setAttribute('tabindex', '0');
              }
            }
            break;
          }
      }
    }
    getToolbarHtml() {
      let html = '';
      html += '<div class="moj-rich-text-editor__toolbar" role="toolbar">';
      if (this.config.toolbar.bold) {
        html += '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--bold" type="button" data-command="bold"><span class="govuk-visually-hidden">Bold</span></button>';
      }
      if (this.config.toolbar.italic) {
        html += '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--italic" type="button" data-command="italic"><span class="govuk-visually-hidden">Italic</span></button>';
      }
      if (this.config.toolbar.underline) {
        html += '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--underline" type="button" data-command="underline"><span class="govuk-visually-hidden">Underline</span></button>';
      }
      if (this.config.toolbar.bullets) {
        html += '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--unordered-list" type="button" data-command="insertUnorderedList"><span class="govuk-visually-hidden">Unordered list</span></button>';
      }
      if (this.config.toolbar.numbers) {
        html += '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--ordered-list" type="button" data-command="insertOrderedList"><span class="govuk-visually-hidden">Ordered list</span></button>';
      }
      html += '</div>';
      return html;
    }
    getEnhancedHtml() {
      return `${this.getToolbarHtml()}<div class="govuk-textarea moj-rich-text-editor__content" contenteditable="true" spellcheck="false"></div>`;
    }
    hideDefault() {
      this.$textarea.classList.add('govuk-visually-hidden');
      this.$textarea.setAttribute('aria-hidden', 'true');
      this.$textarea.setAttribute('tabindex', '-1');
    }
    createToolbar() {
      this.$toolbar = document.createElement('div');
      this.$toolbar.className = 'moj-rich-text-editor';
      this.$toolbar.innerHTML = this.getEnhancedHtml();
      this.$root.append(this.$toolbar);
      this.$content = /** @type {HTMLElement} */
      this.$root.querySelector('.moj-rich-text-editor__content');
      this.$content.innerHTML = this.$textarea.value;
    }
    configureToolbar() {
      this.$buttons = Array.from( /** @type {NodeListOf<HTMLButtonElement>} */
      this.$root.querySelectorAll('.moj-rich-text-editor__toolbar-button'));
      this.$buttons.forEach(($button, index) => {
        $button.setAttribute('tabindex', !index ? '0' : '-1');
        $button.addEventListener('click', this.onButtonClick.bind(this));
      });
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onButtonClick(event) {
      if (!(event.currentTarget instanceof HTMLElement)) {
        return;
      }
      document.execCommand(event.currentTarget.getAttribute('data-command'), false, undefined);
    }
    getContent() {
      return this.$content.innerHTML;
    }
    onEditorInput() {
      this.updateTextarea();
    }
    updateTextarea() {
      document.execCommand('defaultParagraphSeparator', false, 'p');
      this.$textarea.value = this.getContent();
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onLabelClick(event) {
      event.preventDefault();
      this.$content.focus();
    }
    static isSupported() {
      return 'contentEditable' in document.documentElement;
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * Rich text editor config
   *
   * @typedef {object} RichTextEditorConfig
   * @property {RichTextEditorToolbar} [toolbar] - Toolbar options
   */

  /**
   * Rich text editor toolbar options
   *
   * @typedef {object} RichTextEditorToolbar
   * @property {boolean} [bold] - Show the bold button
   * @property {boolean} [italic] - Show the italic button
   * @property {boolean} [underline] - Show the underline button
   * @property {boolean} [bullets] - Show the bullets button
   * @property {boolean} [numbers] - Show the numbers button
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  RichTextEditor.moduleName = 'moj-rich-text-editor';
  /**
   * Rich text editor config
   *
   * @type {RichTextEditorConfig}
   */
  RichTextEditor.defaults = Object.freeze({
    toolbar: {
      bold: false,
      italic: false,
      underline: false,
      bullets: true,
      numbers: true
    }
  });
  /**
   * Rich text editor config schema
   *
   * @satisfies {Schema<RichTextEditorConfig>}
   */
  RichTextEditor.schema = Object.freeze( /** @type {const} */{
    properties: {
      toolbar: {
        type: 'object'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<SearchToggleConfig>}
   */
  class SearchToggle extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for search toggle
     * @param {SearchToggleConfig} [config] - Search toggle config
     */
    constructor($root, config = {}) {
      var _this$config$searchCo, _this$config$toggleBu;
      super($root, config);
      const $searchContainer = (_this$config$searchCo = this.config.searchContainer.element) != null ? _this$config$searchCo : this.$root.querySelector(this.config.searchContainer.selector);
      const $toggleButtonContainer = (_this$config$toggleBu = this.config.toggleButtonContainer.element) != null ? _this$config$toggleBu : this.$root.querySelector(this.config.toggleButtonContainer.selector);
      if (!$searchContainer || !$toggleButtonContainer || !($searchContainer instanceof HTMLElement) || !($toggleButtonContainer instanceof HTMLElement)) {
        return this;
      }
      this.$searchContainer = $searchContainer;
      this.$toggleButtonContainer = $toggleButtonContainer;
      const svg = '<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="moj-search-toggle__button__icon"><path d="M7.433,12.5790048 C6.06762625,12.5808611 4.75763941,12.0392925 3.79217348,11.0738265 C2.82670755,10.1083606 2.28513891,8.79837375 2.28699522,7.433 C2.28513891,6.06762625 2.82670755,4.75763941 3.79217348,3.79217348 C4.75763941,2.82670755 6.06762625,2.28513891 7.433,2.28699522 C8.79837375,2.28513891 10.1083606,2.82670755 11.0738265,3.79217348 C12.0392925,4.75763941 12.5808611,6.06762625 12.5790048,7.433 C12.5808611,8.79837375 12.0392925,10.1083606 11.0738265,11.0738265 C10.1083606,12.0392925 8.79837375,12.5808611 7.433,12.5790048 L7.433,12.5790048 Z M14.293,12.579 L13.391,12.579 L13.071,12.269 C14.2300759,10.9245158 14.8671539,9.20813198 14.866,7.433 C14.866,3.32786745 11.5381325,-1.65045755e-15 7.433,-1.65045755e-15 C3.32786745,-1.65045755e-15 -1.65045755e-15,3.32786745 -1.65045755e-15,7.433 C-1.65045755e-15,11.5381325 3.32786745,14.866 7.433,14.866 C9.208604,14.8671159 10.9253982,14.2296624 12.27,13.07 L12.579,13.39 L12.579,14.294 L18.296,20 L20,18.296 L14.294,12.579 L14.293,12.579 Z"></path></svg>';
      this.$toggleButton = document.createElement('button');
      this.$toggleButton.setAttribute('class', 'moj-search-toggle__button');
      this.$toggleButton.setAttribute('type', 'button');
      this.$toggleButton.setAttribute('aria-haspopup', 'true');
      this.$toggleButton.setAttribute('aria-expanded', 'false');
      this.$toggleButton.innerHTML = `${this.config.toggleButton.text} ${svg}`;
      this.$toggleButton.addEventListener('click', this.onToggleButtonClick.bind(this));
      this.$toggleButtonContainer.append(this.$toggleButton);
      document.addEventListener('click', this.onDocumentClick.bind(this));
      document.addEventListener('focusin', this.onDocumentClick.bind(this));
    }
    showMenu() {
      this.$toggleButton.setAttribute('aria-expanded', 'true');
      this.$searchContainer.classList.remove('moj-js-hidden');
      this.$searchContainer.querySelector('input').focus();
    }
    hideMenu() {
      this.$searchContainer.classList.add('moj-js-hidden');
      this.$toggleButton.setAttribute('aria-expanded', 'false');
    }
    onToggleButtonClick() {
      if (this.$toggleButton.getAttribute('aria-expanded') === 'false') {
        this.showMenu();
      } else {
        this.hideMenu();
      }
    }

    /**
     * @param {MouseEvent | FocusEvent} event
     */
    onDocumentClick(event) {
      if (event.target instanceof Node && !this.$toggleButtonContainer.contains(event.target) && !this.$searchContainer.contains(event.target)) {
        this.hideMenu();
      }
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * @typedef {object} SearchToggleConfig
   * @property {object} [searchContainer] - Search config
   * @property {string} [searchContainer.selector] - Selector for search container
   * @property {Element | null} [searchContainer.element] - HTML element for search container
   * @property {object} [toggleButton] - Toggle button config
   * @property {string} [toggleButton.text] - Text for toggle button
   * @property {object} [toggleButtonContainer] - Toggle button container config
   * @property {string} [toggleButtonContainer.selector] - Selector for toggle button container
   * @property {Element | null} [toggleButtonContainer.element] - HTML element for toggle button container
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  SearchToggle.moduleName = 'moj-search-toggle';
  /**
   * Search toggle config
   *
   * @type {SearchToggleConfig}
   */
  SearchToggle.defaults = Object.freeze({
    searchContainer: {
      selector: '.moj-search'
    },
    toggleButton: {
      text: 'Search'
    },
    toggleButtonContainer: {
      selector: '.moj-search-toggle__toggle'
    }
  });
  /**
   * Search toggle config schema
   *
   * @satisfies {Schema<SearchToggleConfig>}
   */
  SearchToggle.schema = Object.freeze( /** @type {const} */{
    properties: {
      searchContainer: {
        type: 'object'
      },
      toggleButton: {
        type: 'object'
      },
      toggleButtonContainer: {
        type: 'object'
      }
    }
  });

  /**
   * @augments {ConfigurableComponent<SortableTableConfig>}
   */
  class SortableTable extends govukFrontend.ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for sortable table
     * @param {SortableTableConfig} [config] - Sortable table config
     */
    constructor($root, config = {}) {
      super($root, config);
      const $head = $root == null ? void 0 : $root.querySelector('thead');
      const $body = $root == null ? void 0 : $root.querySelector('tbody');
      if (!$head || !$body) {
        return this;
      }
      this.$head = $head;
      this.$body = $body;
      this.$caption = this.$root.querySelector('caption');
      this.$upArrow = `<svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.5625 15.5L11 6.63125L15.4375 15.5H6.5625Z" fill="currentColor"/>
</svg>`;
      this.$downArrow = `<svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.4375 7L11 15.8687L6.5625 7L15.4375 7Z" fill="currentColor"/>
</svg>`;
      this.$upDownArrow = `<svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.1875 9.5L10.9609 3.95703L13.7344 9.5H8.1875Z" fill="currentColor"/>
<path d="M13.7344 12.0781L10.9609 17.6211L8.1875 12.0781H13.7344Z" fill="currentColor"/>
</svg>`;
      this.$headings = this.$head ? Array.from(this.$head.querySelectorAll('th')) : [];
      this.createHeadingButtons();
      this.updateCaption();
      this.updateDirectionIndicators();
      this.createStatusBox();
      this.initialiseSortedColumn();
      this.$head.addEventListener('click', this.onSortButtonClick.bind(this));
    }
    createHeadingButtons() {
      for (const $heading of this.$headings) {
        if ($heading.hasAttribute('aria-sort')) {
          this.createHeadingButton($heading);
        }
      }
    }

    /**
     * @param {HTMLTableCellElement} $heading
     */
    createHeadingButton($heading) {
      const index = this.$headings.indexOf($heading);
      const $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('data-index', `${index}`);
      $button.textContent = $heading.textContent;
      $heading.textContent = '';
      $heading.appendChild($button);
    }
    createStatusBox() {
      this.$status = document.createElement('div');
      this.$status.setAttribute('aria-atomic', 'true');
      this.$status.setAttribute('aria-live', 'polite');
      this.$status.setAttribute('class', 'govuk-visually-hidden');
      this.$status.setAttribute('role', 'status');
      this.$root.insertAdjacentElement('afterend', this.$status);
    }
    initialiseSortedColumn() {
      var _$sortButton$getAttri;
      const $rows = this.getTableRowsArray();
      const $heading = this.$root.querySelector('th[aria-sort="ascending"], th[aria-sort="descending"]');
      const $sortButton = $heading == null ? void 0 : $heading.querySelector('button');
      const sortDirection = $heading == null ? void 0 : $heading.getAttribute('aria-sort');
      const columnNumber = Number.parseInt((_$sortButton$getAttri = $sortButton == null ? void 0 : $sortButton.getAttribute('data-index')) != null ? _$sortButton$getAttri : '0', 10);
      if (!$heading || !$sortButton || !(sortDirection === 'ascending' || sortDirection === 'descending')) {
        return;
      }
      const $sortedRows = this.sort($rows, columnNumber, sortDirection);
      this.addRows($sortedRows);
    }

    /**
     * @param {MouseEvent} event - Click event
     */
    onSortButtonClick(event) {
      var _$button$getAttribute;
      const $target = /** @type {HTMLElement} */event.target;
      const $button = $target.closest('button');
      if (!$button || !($button instanceof HTMLButtonElement) || !$button.parentElement) {
        return;
      }
      const $heading = $button.parentElement;
      const sortDirection = $heading.getAttribute('aria-sort');
      const columnNumber = Number.parseInt((_$button$getAttribute = $button == null ? void 0 : $button.getAttribute('data-index')) != null ? _$button$getAttribute : '0', 10);
      const newSortDirection = sortDirection === 'none' || sortDirection === 'descending' ? 'ascending' : 'descending';
      const $rows = this.getTableRowsArray();
      const $sortedRows = this.sort($rows, columnNumber, newSortDirection);
      this.addRows($sortedRows);
      this.removeButtonStates();
      this.updateButtonState($button, newSortDirection);
      this.updateDirectionIndicators();
    }
    updateCaption() {
      if (!this.$caption) {
        return;
      }
      let assistiveText = this.$caption.querySelector('.govuk-visually-hidden');
      if (assistiveText) {
        return;
      }
      assistiveText = document.createElement('span');
      assistiveText.classList.add('govuk-visually-hidden');
      assistiveText.textContent = ' (column headers with buttons are sortable).';
      this.$caption.appendChild(assistiveText);
    }

    /**
     * @param {HTMLButtonElement} $button
     * @param {string} direction
     */
    updateButtonState($button, direction) {
      if (!(direction === 'ascending' || direction === 'descending')) {
        return;
      }
      $button.parentElement.setAttribute('aria-sort', direction);
      let message = this.config.statusMessage;
      message = message.replace(/%heading%/, $button.textContent);
      message = message.replace(/%direction%/, this.config[`${direction}Text`]);
      this.$status.textContent = message;
    }
    updateDirectionIndicators() {
      for (const $heading of this.$headings) {
        const $button = /** @type {HTMLButtonElement} */
        $heading.querySelector('button');
        if ($heading.hasAttribute('aria-sort') && $button) {
          var _$button$querySelecto;
          const direction = $heading.getAttribute('aria-sort');
          (_$button$querySelecto = $button.querySelector('svg')) == null || _$button$querySelecto.remove();
          switch (direction) {
            case 'ascending':
              $button.insertAdjacentHTML('beforeend', this.$upArrow);
              break;
            case 'descending':
              $button.insertAdjacentHTML('beforeend', this.$downArrow);
              break;
            default:
              $button.insertAdjacentHTML('beforeend', this.$upDownArrow);
          }
        }
      }
    }
    removeButtonStates() {
      for (const $heading of this.$headings) {
        $heading.setAttribute('aria-sort', 'none');
      }
    }

    /**
     * @param {HTMLTableRowElement[]} $rows
     */
    addRows($rows) {
      for (const $row of $rows) {
        this.$body.append($row);
      }
    }
    getTableRowsArray() {
      return Array.from(this.$body.querySelectorAll('tr'));
    }

    /**
     * @param {HTMLTableRowElement[]} $rows
     * @param {number} columnNumber
     * @param {string} sortDirection
     */
    sort($rows, columnNumber, sortDirection) {
      return $rows.sort(($rowA, $rowB) => {
        const $tdA = $rowA.querySelectorAll('td, th')[columnNumber];
        const $tdB = $rowB.querySelectorAll('td, th')[columnNumber];
        if (!$tdA || !$tdB || !($tdA instanceof HTMLElement) || !($tdB instanceof HTMLElement)) {
          return 0;
        }
        const valueA = sortDirection === 'ascending' ? this.getCellValue($tdA) : this.getCellValue($tdB);
        const valueB = sortDirection === 'ascending' ? this.getCellValue($tdB) : this.getCellValue($tdA);
        return !(typeof valueA === 'number' && typeof valueB === 'number') ? valueA.toString().localeCompare(valueB.toString()) : valueA - valueB;
      });
    }

    /**
     * @param {HTMLElement} $cell
     */
    getCellValue($cell) {
      const val = $cell.getAttribute('data-sort-value') || $cell.innerHTML;
      const valAsNumber = Number(val);
      return Number.isFinite(valAsNumber) ? valAsNumber // Exclude invalid numbers, infinity etc
      : val;
    }

    /**
     * Name for the component used when initialising using data-module attributes.
     */
  }

  /**
   * Sortable table config
   *
   * @typedef {object} SortableTableConfig
   * @property {string} [statusMessage] - Status message
   * @property {string} [ascendingText] - Ascending text
   * @property {string} [descendingText] - Descending text
   */

  /**
   * @import { Schema } from 'govuk-frontend/dist/govuk/common/configuration.mjs'
   */
  SortableTable.moduleName = 'moj-sortable-table';
  /**
   * Sortable table config
   *
   * @type {SortableTableConfig}
   */
  SortableTable.defaults = Object.freeze({
    statusMessage: 'Sort by %heading% (%direction%)',
    ascendingText: 'ascending',
    descendingText: 'descending'
  });
  /**
   * Sortable table config schema
   *
   * @satisfies {Schema<SortableTableConfig>}
   */
  SortableTable.schema = Object.freeze( /** @type {const} */{
    properties: {
      statusMessage: {
        type: 'string'
      },
      ascendingText: {
        type: 'string'
      },
      descendingText: {
        type: 'string'
      }
    }
  });

  /**
   * @param {Config} [config]
   */
  function initAll(config) {
    for (const Component of [AddAnother, Alert, ButtonMenu, DatePicker, MultiSelect, PasswordReveal, RichTextEditor, SearchToggle, SortableTable]) {
      govukFrontend.createAll(Component, undefined, config);
    }
  }

  /**
   * @typedef {Parameters<typeof GOVUKFrontend.initAll>[0]} Config
   */

  /**
   * @import * as GOVUKFrontend from 'govuk-frontend'
   */

  exports.AddAnother = AddAnother;
  exports.Alert = Alert;
  exports.ButtonMenu = ButtonMenu;
  exports.DatePicker = DatePicker;
  exports.FilterToggleButton = FilterToggleButton;
  exports.FormValidator = FormValidator;
  exports.MultiFileUpload = MultiFileUpload;
  exports.MultiSelect = MultiSelect;
  exports.PasswordReveal = PasswordReveal;
  exports.RichTextEditor = RichTextEditor;
  exports.SearchToggle = SearchToggle;
  exports.SortableTable = SortableTable;
  exports.initAll = initAll;
  exports.version = version;
});

/***/ }),

/***/ "./node_modules/custom-event/index.js":
/*!********************************************!*\
  !*** ./node_modules/custom-event/index.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var NativeCustomEvent = __webpack_require__.g.CustomEvent;
function useNative() {
  try {
    var p = new NativeCustomEvent('cat', {
      detail: {
        foo: 'bar'
      }
    });
    return 'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {}
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :
// IE >= 9
'undefined' !== typeof document && 'function' === typeof document.createEvent ? function CustomEvent(type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :
// IE <= 8
function CustomEvent(type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
};

/***/ }),

/***/ "./node_modules/govuk-frontend/dist/govuk/all.bundle.js":
/*!**************************************************************!*\
  !*** ./node_modules/govuk-frontend/dist/govuk/all.bundle.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports) {

(function (global, factory) {
   true ? factory(exports) : 0;
})(this, function (exports) {
  'use strict';

  const version = '5.11.1';
  function getFragmentFromUrl(url) {
    if (!url.includes('#')) {
      return undefined;
    }
    return url.split('#').pop();
  }
  function getBreakpoint(name) {
    const property = `--govuk-breakpoint-${name}`;
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(property);
    return {
      property,
      value: value || undefined
    };
  }
  function setFocus($element, options = {}) {
    var _options$onBeforeFocu;
    const isFocusable = $element.getAttribute('tabindex');
    if (!isFocusable) {
      $element.setAttribute('tabindex', '-1');
    }
    function onFocus() {
      $element.addEventListener('blur', onBlur, {
        once: true
      });
    }
    function onBlur() {
      var _options$onBlur;
      (_options$onBlur = options.onBlur) == null || _options$onBlur.call($element);
      if (!isFocusable) {
        $element.removeAttribute('tabindex');
      }
    }
    $element.addEventListener('focus', onFocus, {
      once: true
    });
    (_options$onBeforeFocu = options.onBeforeFocus) == null || _options$onBeforeFocu.call($element);
    $element.focus();
  }
  function isInitialised($root, moduleName) {
    return $root instanceof HTMLElement && $root.hasAttribute(`data-${moduleName}-init`);
  }

  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * Some browsers will load and run our JavaScript but GOV.UK Frontend
   * won't be supported.
   *
   * @param {HTMLElement | null} [$scope] - (internal) `<body>` HTML element checked for browser support
   * @returns {boolean} Whether GOV.UK Frontend is supported on this page
   */
  function isSupported($scope = document.body) {
    if (!$scope) {
      return false;
    }
    return $scope.classList.contains('govuk-frontend-supported');
  }
  function isArray(option) {
    return Array.isArray(option);
  }
  function isObject(option) {
    return !!option && typeof option === 'object' && !isArray(option);
  }
  function formatErrorMessage(Component, message) {
    return `${Component.moduleName}: ${message}`;
  }
  /**
   * @typedef ComponentWithModuleName
   * @property {string} moduleName - Name of the component
   */
  /**
   * @import { ObjectNested } from './configuration.mjs'
   */

  class GOVUKFrontendError extends Error {
    constructor(...args) {
      super(...args);
      this.name = 'GOVUKFrontendError';
    }
  }
  class SupportError extends GOVUKFrontendError {
    /**
     * Checks if GOV.UK Frontend is supported on this page
     *
     * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
     */
    constructor($scope = document.body) {
      const supportMessage = 'noModule' in HTMLScriptElement.prototype ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet' : 'GOV.UK Frontend is not supported in this browser';
      super($scope ? supportMessage : 'GOV.UK Frontend initialised without `<script type="module">`');
      this.name = 'SupportError';
    }
  }
  class ConfigError extends GOVUKFrontendError {
    constructor(...args) {
      super(...args);
      this.name = 'ConfigError';
    }
  }
  class ElementError extends GOVUKFrontendError {
    constructor(messageOrOptions) {
      let message = typeof messageOrOptions === 'string' ? messageOrOptions : '';
      if (typeof messageOrOptions === 'object') {
        const {
          component,
          identifier,
          element,
          expectedType
        } = messageOrOptions;
        message = identifier;
        message += element ? ` is not of type ${expectedType != null ? expectedType : 'HTMLElement'}` : ' not found';
        message = formatErrorMessage(component, message);
      }
      super(message);
      this.name = 'ElementError';
    }
  }
  class InitError extends GOVUKFrontendError {
    constructor(componentOrMessage) {
      const message = typeof componentOrMessage === 'string' ? componentOrMessage : formatErrorMessage(componentOrMessage, `Root element (\`$root\`) already initialised`);
      super(message);
      this.name = 'InitError';
    }
  }
  /**
   * @import { ComponentWithModuleName } from '../common/index.mjs'
   */

  class Component {
    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {RootElementType} - the root element of component
     */
    get $root() {
      return this._$root;
    }
    constructor($root) {
      this._$root = void 0;
      const childConstructor = this.constructor;
      if (typeof childConstructor.moduleName !== 'string') {
        throw new InitError(`\`moduleName\` not defined in component`);
      }
      if (!($root instanceof childConstructor.elementType)) {
        throw new ElementError({
          element: $root,
          component: childConstructor,
          identifier: 'Root element (`$root`)',
          expectedType: childConstructor.elementType.name
        });
      } else {
        this._$root = $root;
      }
      childConstructor.checkSupport();
      this.checkInitialised();
      const moduleName = childConstructor.moduleName;
      this.$root.setAttribute(`data-${moduleName}-init`, '');
    }
    checkInitialised() {
      const constructor = this.constructor;
      const moduleName = constructor.moduleName;
      if (moduleName && isInitialised(this.$root, moduleName)) {
        throw new InitError(constructor);
      }
    }
    static checkSupport() {
      if (!isSupported()) {
        throw new SupportError();
      }
    }
  }

  /**
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   */

  /**
   * @typedef {typeof Component & ChildClass} ChildClassConstructor
   */
  Component.elementType = HTMLElement;
  const configOverride = Symbol.for('configOverride');
  class ConfigurableComponent extends Component {
    [configOverride](param) {
      return {};
    }

    /**
     * Returns the root element of the component
     *
     * @protected
     * @returns {ConfigurationType} - the root element of component
     */
    get config() {
      return this._config;
    }
    constructor($root, config) {
      super($root);
      this._config = void 0;
      const childConstructor = this.constructor;
      if (!isObject(childConstructor.defaults)) {
        throw new ConfigError(formatErrorMessage(childConstructor, 'Config passed as parameter into constructor but no defaults defined'));
      }
      const datasetConfig = normaliseDataset(childConstructor, this._$root.dataset);
      this._config = mergeConfigs(childConstructor.defaults, config != null ? config : {}, this[configOverride](datasetConfig), datasetConfig);
    }
  }
  function normaliseString(value, property) {
    const trimmedValue = value ? value.trim() : '';
    let output;
    let outputType = property == null ? void 0 : property.type;
    if (!outputType) {
      if (['true', 'false'].includes(trimmedValue)) {
        outputType = 'boolean';
      }
      if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
        outputType = 'number';
      }
    }
    switch (outputType) {
      case 'boolean':
        output = trimmedValue === 'true';
        break;
      case 'number':
        output = Number(trimmedValue);
        break;
      default:
        output = value;
    }
    return output;
  }
  function normaliseDataset(Component, dataset) {
    if (!isObject(Component.schema)) {
      throw new ConfigError(formatErrorMessage(Component, 'Config passed as parameter into constructor but no schema defined'));
    }
    const out = {};
    const entries = Object.entries(Component.schema.properties);
    for (const entry of entries) {
      const [namespace, property] = entry;
      const field = namespace.toString();
      if (field in dataset) {
        out[field] = normaliseString(dataset[field], property);
      }
      if ((property == null ? void 0 : property.type) === 'object') {
        out[field] = extractConfigByNamespace(Component.schema, dataset, namespace);
      }
    }
    return out;
  }
  function mergeConfigs(...configObjects) {
    const formattedConfigObject = {};
    for (const configObject of configObjects) {
      for (const key of Object.keys(configObject)) {
        const option = formattedConfigObject[key];
        const override = configObject[key];
        if (isObject(option) && isObject(override)) {
          formattedConfigObject[key] = mergeConfigs(option, override);
        } else {
          formattedConfigObject[key] = override;
        }
      }
    }
    return formattedConfigObject;
  }
  function validateConfig(schema, config) {
    const validationErrors = [];
    for (const [name, conditions] of Object.entries(schema)) {
      const errors = [];
      if (Array.isArray(conditions)) {
        for (const {
          required,
          errorMessage
        } of conditions) {
          if (!required.every(key => !!config[key])) {
            errors.push(errorMessage);
          }
        }
        if (name === 'anyOf' && !(conditions.length - errors.length >= 1)) {
          validationErrors.push(...errors);
        }
      }
    }
    return validationErrors;
  }
  function extractConfigByNamespace(schema, dataset, namespace) {
    const property = schema.properties[namespace];
    if ((property == null ? void 0 : property.type) !== 'object') {
      return;
    }
    const newObject = {
      [namespace]: {}
    };
    for (const [key, value] of Object.entries(dataset)) {
      let current = newObject;
      const keyParts = key.split('.');
      for (const [index, name] of keyParts.entries()) {
        if (isObject(current)) {
          if (index < keyParts.length - 1) {
            if (!isObject(current[name])) {
              current[name] = {};
            }
            current = current[name];
          } else if (key !== namespace) {
            current[name] = normaliseString(value);
          }
        }
      }
    }
    return newObject[namespace];
  }
  /**
   * Schema for component config
   *
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} Schema
   * @property {Record<keyof ConfigurationType, SchemaProperty | undefined>} properties - Schema properties
   * @property {SchemaCondition<ConfigurationType>[]} [anyOf] - List of schema conditions
   */
  /**
   * Schema property for component config
   *
   * @typedef {object} SchemaProperty
   * @property {'string' | 'boolean' | 'number' | 'object'} type - Property type
   */
  /**
   * Schema condition for component config
   *
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} ConfigurationType
   * @typedef {object} SchemaCondition
   * @property {(keyof ConfigurationType)[]} required - List of required config fields
   * @property {string} errorMessage - Error message when required config fields not provided
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef ChildClass
   * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
   * @property {Schema<ConfigurationType>} [schema] - The schema of the component configuration
   * @property {ConfigurationType} [defaults] - The default values of the configuration of the component
   */
  /**
   * @template {Partial<Record<keyof ConfigurationType, unknown>>} [ConfigurationType=ObjectNested]
   * @typedef {typeof Component & ChildClass<ConfigurationType>} ChildClassConstructor<ConfigurationType>
   */

  class I18n {
    constructor(translations = {}, config = {}) {
      var _config$locale;
      this.translations = void 0;
      this.locale = void 0;
      this.translations = translations;
      this.locale = (_config$locale = config.locale) != null ? _config$locale : document.documentElement.lang || 'en';
    }
    t(lookupKey, options) {
      if (!lookupKey) {
        throw new Error('i18n: lookup key missing');
      }
      let translation = this.translations[lookupKey];
      if (typeof (options == null ? void 0 : options.count) === 'number' && typeof translation === 'object') {
        const translationPluralForm = translation[this.getPluralSuffix(lookupKey, options.count)];
        if (translationPluralForm) {
          translation = translationPluralForm;
        }
      }
      if (typeof translation === 'string') {
        if (translation.match(/%{(.\S+)}/)) {
          if (!options) {
            throw new Error('i18n: cannot replace placeholders in string if no option data provided');
          }
          return this.replacePlaceholders(translation, options);
        }
        return translation;
      }
      return lookupKey;
    }
    replacePlaceholders(translationString, options) {
      const formatter = Intl.NumberFormat.supportedLocalesOf(this.locale).length ? new Intl.NumberFormat(this.locale) : undefined;
      return translationString.replace(/%{(.\S+)}/g, function (placeholderWithBraces, placeholderKey) {
        if (Object.prototype.hasOwnProperty.call(options, placeholderKey)) {
          const placeholderValue = options[placeholderKey];
          if (placeholderValue === false || typeof placeholderValue !== 'number' && typeof placeholderValue !== 'string') {
            return '';
          }
          if (typeof placeholderValue === 'number') {
            return formatter ? formatter.format(placeholderValue) : `${placeholderValue}`;
          }
          return placeholderValue;
        }
        throw new Error(`i18n: no data found to replace ${placeholderWithBraces} placeholder in string`);
      });
    }
    hasIntlPluralRulesSupport() {
      return Boolean('PluralRules' in window.Intl && Intl.PluralRules.supportedLocalesOf(this.locale).length);
    }
    getPluralSuffix(lookupKey, count) {
      count = Number(count);
      if (!isFinite(count)) {
        return 'other';
      }
      const translation = this.translations[lookupKey];
      const preferredForm = this.hasIntlPluralRulesSupport() ? new Intl.PluralRules(this.locale).select(count) : this.selectPluralFormUsingFallbackRules(count);
      if (typeof translation === 'object') {
        if (preferredForm in translation) {
          return preferredForm;
        } else if ('other' in translation) {
          console.warn(`i18n: Missing plural form ".${preferredForm}" for "${this.locale}" locale. Falling back to ".other".`);
          return 'other';
        }
      }
      throw new Error(`i18n: Plural form ".other" is required for "${this.locale}" locale`);
    }
    selectPluralFormUsingFallbackRules(count) {
      count = Math.abs(Math.floor(count));
      const ruleset = this.getPluralRulesForLocale();
      if (ruleset) {
        return I18n.pluralRules[ruleset](count);
      }
      return 'other';
    }
    getPluralRulesForLocale() {
      const localeShort = this.locale.split('-')[0];
      for (const pluralRule in I18n.pluralRulesMap) {
        const languages = I18n.pluralRulesMap[pluralRule];
        if (languages.includes(this.locale) || languages.includes(localeShort)) {
          return pluralRule;
        }
      }
    }
  }
  I18n.pluralRulesMap = {
    arabic: ['ar'],
    chinese: ['my', 'zh', 'id', 'ja', 'jv', 'ko', 'ms', 'th', 'vi'],
    french: ['hy', 'bn', 'fr', 'gu', 'hi', 'fa', 'pa', 'zu'],
    german: ['af', 'sq', 'az', 'eu', 'bg', 'ca', 'da', 'nl', 'en', 'et', 'fi', 'ka', 'de', 'el', 'hu', 'lb', 'no', 'so', 'sw', 'sv', 'ta', 'te', 'tr', 'ur'],
    irish: ['ga'],
    russian: ['ru', 'uk'],
    scottish: ['gd'],
    spanish: ['pt-PT', 'it', 'es'],
    welsh: ['cy']
  };
  I18n.pluralRules = {
    arabic(n) {
      if (n === 0) {
        return 'zero';
      }
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n % 100 >= 3 && n % 100 <= 10) {
        return 'few';
      }
      if (n % 100 >= 11 && n % 100 <= 99) {
        return 'many';
      }
      return 'other';
    },
    chinese() {
      return 'other';
    },
    french(n) {
      return n === 0 || n === 1 ? 'one' : 'other';
    },
    german(n) {
      return n === 1 ? 'one' : 'other';
    },
    irish(n) {
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n >= 3 && n <= 6) {
        return 'few';
      }
      if (n >= 7 && n <= 10) {
        return 'many';
      }
      return 'other';
    },
    russian(n) {
      const lastTwo = n % 100;
      const last = lastTwo % 10;
      if (last === 1 && lastTwo !== 11) {
        return 'one';
      }
      if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
        return 'few';
      }
      if (last === 0 || last >= 5 && last <= 9 || lastTwo >= 11 && lastTwo <= 14) {
        return 'many';
      }
      return 'other';
    },
    scottish(n) {
      if (n === 1 || n === 11) {
        return 'one';
      }
      if (n === 2 || n === 12) {
        return 'two';
      }
      if (n >= 3 && n <= 10 || n >= 13 && n <= 19) {
        return 'few';
      }
      return 'other';
    },
    spanish(n) {
      if (n === 1) {
        return 'one';
      }
      if (n % 1000000 === 0 && n !== 0) {
        return 'many';
      }
      return 'other';
    },
    welsh(n) {
      if (n === 0) {
        return 'zero';
      }
      if (n === 1) {
        return 'one';
      }
      if (n === 2) {
        return 'two';
      }
      if (n === 3) {
        return 'few';
      }
      if (n === 6) {
        return 'many';
      }
      return 'other';
    }
  };

  /**
   * Accordion component
   *
   * This allows a collection of sections to be collapsed by default, showing only
   * their headers. Sections can be expanded or collapsed individually by clicking
   * their headers. A "Show all sections" button is also added to the top of the
   * accordion, which switches to "Hide all sections" when all the sections are
   * expanded.
   *
   * The state of each section is saved to the DOM via the `aria-expanded`
   * attribute, which also provides accessibility.
   *
   * @preserve
   * @augments ConfigurableComponent<AccordionConfig>
   */
  class Accordion extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for accordion
     * @param {AccordionConfig} [config] - Accordion config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.controlsClass = 'govuk-accordion__controls';
      this.showAllClass = 'govuk-accordion__show-all';
      this.showAllTextClass = 'govuk-accordion__show-all-text';
      this.sectionClass = 'govuk-accordion__section';
      this.sectionExpandedClass = 'govuk-accordion__section--expanded';
      this.sectionButtonClass = 'govuk-accordion__section-button';
      this.sectionHeaderClass = 'govuk-accordion__section-header';
      this.sectionHeadingClass = 'govuk-accordion__section-heading';
      this.sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider';
      this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
      this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';
      this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
      this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
      this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
      this.upChevronIconClass = 'govuk-accordion-nav__chevron';
      this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';
      this.sectionSummaryClass = 'govuk-accordion__section-summary';
      this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
      this.sectionContentClass = 'govuk-accordion__section-content';
      this.$sections = void 0;
      this.$showAllButton = null;
      this.$showAllIcon = null;
      this.$showAllText = null;
      this.i18n = new I18n(this.config.i18n);
      const $sections = this.$root.querySelectorAll(`.${this.sectionClass}`);
      if (!$sections.length) {
        throw new ElementError({
          component: Accordion,
          identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
        });
      }
      this.$sections = $sections;
      this.initControls();
      this.initSectionHeaders();
      this.updateShowAllButton(this.areAllSectionsOpen());
    }
    initControls() {
      this.$showAllButton = document.createElement('button');
      this.$showAllButton.setAttribute('type', 'button');
      this.$showAllButton.setAttribute('class', this.showAllClass);
      this.$showAllButton.setAttribute('aria-expanded', 'false');
      this.$showAllIcon = document.createElement('span');
      this.$showAllIcon.classList.add(this.upChevronIconClass);
      this.$showAllButton.appendChild(this.$showAllIcon);
      const $accordionControls = document.createElement('div');
      $accordionControls.setAttribute('class', this.controlsClass);
      $accordionControls.appendChild(this.$showAllButton);
      this.$root.insertBefore($accordionControls, this.$root.firstChild);
      this.$showAllText = document.createElement('span');
      this.$showAllText.classList.add(this.showAllTextClass);
      this.$showAllButton.appendChild(this.$showAllText);
      this.$showAllButton.addEventListener('click', () => this.onShowOrHideAllToggle());
      if ('onbeforematch' in document) {
        document.addEventListener('beforematch', event => this.onBeforeMatch(event));
      }
    }
    initSectionHeaders() {
      this.$sections.forEach(($section, i) => {
        const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
        if (!$header) {
          throw new ElementError({
            component: Accordion,
            identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
          });
        }
        this.constructHeaderMarkup($header, i);
        this.setExpanded(this.isExpanded($section), $section);
        $header.addEventListener('click', () => this.onSectionToggle($section));
        this.setInitialState($section);
      });
    }
    constructHeaderMarkup($header, index) {
      const $span = $header.querySelector(`.${this.sectionButtonClass}`);
      const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
      const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
      if (!$heading) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
        });
      }
      if (!$span) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
        });
      }
      const $button = document.createElement('button');
      $button.setAttribute('type', 'button');
      $button.setAttribute('aria-controls', `${this.$root.id}-content-${index + 1}`);
      for (const attr of Array.from($span.attributes)) {
        if (attr.name !== 'id') {
          $button.setAttribute(attr.name, attr.value);
        }
      }
      const $headingText = document.createElement('span');
      $headingText.classList.add(this.sectionHeadingTextClass);
      $headingText.id = $span.id;
      const $headingTextFocus = document.createElement('span');
      $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
      $headingText.appendChild($headingTextFocus);
      Array.from($span.childNodes).forEach($child => $headingTextFocus.appendChild($child));
      const $showHideToggle = document.createElement('span');
      $showHideToggle.classList.add(this.sectionShowHideToggleClass);
      $showHideToggle.setAttribute('data-nosnippet', '');
      const $showHideToggleFocus = document.createElement('span');
      $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
      $showHideToggle.appendChild($showHideToggleFocus);
      const $showHideText = document.createElement('span');
      const $showHideIcon = document.createElement('span');
      $showHideIcon.classList.add(this.upChevronIconClass);
      $showHideToggleFocus.appendChild($showHideIcon);
      $showHideText.classList.add(this.sectionShowHideTextClass);
      $showHideToggleFocus.appendChild($showHideText);
      $button.appendChild($headingText);
      $button.appendChild(this.getButtonPunctuationEl());
      if ($summary) {
        const $summarySpan = document.createElement('span');
        const $summarySpanFocus = document.createElement('span');
        $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
        $summarySpan.appendChild($summarySpanFocus);
        for (const attr of Array.from($summary.attributes)) {
          $summarySpan.setAttribute(attr.name, attr.value);
        }
        Array.from($summary.childNodes).forEach($child => $summarySpanFocus.appendChild($child));
        $summary.remove();
        $button.appendChild($summarySpan);
        $button.appendChild(this.getButtonPunctuationEl());
      }
      $button.appendChild($showHideToggle);
      $heading.removeChild($span);
      $heading.appendChild($button);
    }
    onBeforeMatch(event) {
      const $fragment = event.target;
      if (!($fragment instanceof Element)) {
        return;
      }
      const $section = $fragment.closest(`.${this.sectionClass}`);
      if ($section) {
        this.setExpanded(true, $section);
      }
    }
    onSectionToggle($section) {
      const nowExpanded = !this.isExpanded($section);
      this.setExpanded(nowExpanded, $section);
      this.storeState($section, nowExpanded);
    }
    onShowOrHideAllToggle() {
      const nowExpanded = !this.areAllSectionsOpen();
      this.$sections.forEach($section => {
        this.setExpanded(nowExpanded, $section);
        this.storeState($section, nowExpanded);
      });
      this.updateShowAllButton(nowExpanded);
    }
    setExpanded(expanded, $section) {
      const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
      const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      const $content = $section.querySelector(`.${this.sectionContentClass}`);
      if (!$content) {
        throw new ElementError({
          component: Accordion,
          identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
        });
      }
      if (!$showHideIcon || !$showHideText || !$button) {
        return;
      }
      const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
      $showHideText.textContent = newButtonText;
      $button.setAttribute('aria-expanded', `${expanded}`);
      const ariaLabelParts = [];
      const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
      if ($headingText) {
        ariaLabelParts.push(`${$headingText.textContent}`.trim());
      }
      const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
      if ($summary) {
        ariaLabelParts.push(`${$summary.textContent}`.trim());
      }
      const ariaLabelMessage = expanded ? this.i18n.t('hideSectionAriaLabel') : this.i18n.t('showSectionAriaLabel');
      ariaLabelParts.push(ariaLabelMessage);
      $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
      if (expanded) {
        $content.removeAttribute('hidden');
        $section.classList.add(this.sectionExpandedClass);
        $showHideIcon.classList.remove(this.downChevronIconClass);
      } else {
        $content.setAttribute('hidden', 'until-found');
        $section.classList.remove(this.sectionExpandedClass);
        $showHideIcon.classList.add(this.downChevronIconClass);
      }
      this.updateShowAllButton(this.areAllSectionsOpen());
    }
    isExpanded($section) {
      return $section.classList.contains(this.sectionExpandedClass);
    }
    areAllSectionsOpen() {
      return Array.from(this.$sections).every($section => this.isExpanded($section));
    }
    updateShowAllButton(expanded) {
      if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
        return;
      }
      this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
      this.$showAllText.textContent = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
      this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
    }

    /**
     * Get the identifier for a section
     *
     * We need a unique way of identifying each content in the Accordion.
     * Since an `#id` should be unique and an `id` is required for `aria-`
     * attributes `id` can be safely used.
     *
     * @param {Element} $section - Section element
     * @returns {string | undefined | null} Identifier for section
     */
    getIdentifier($section) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      return $button == null ? void 0 : $button.getAttribute('aria-controls');
    }
    storeState($section, isExpanded) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          window.sessionStorage.setItem(id, isExpanded.toString());
        } catch (exception) {}
      }
    }
    setInitialState($section) {
      if (!this.config.rememberExpanded) {
        return;
      }
      const id = this.getIdentifier($section);
      if (id) {
        try {
          const state = window.sessionStorage.getItem(id);
          if (state !== null) {
            this.setExpanded(state === 'true', $section);
          }
        } catch (exception) {}
      }
    }
    getButtonPunctuationEl() {
      const $punctuationEl = document.createElement('span');
      $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
      $punctuationEl.textContent = ', ';
      return $punctuationEl;
    }
  }

  /**
   * Accordion config
   *
   * @see {@link Accordion.defaults}
   * @typedef {object} AccordionConfig
   * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
   * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
   *   state of each section is remembered and restored when navigating.
   */

  /**
   * Accordion translations
   *
   * @see {@link Accordion.defaults.i18n}
   * @typedef {object} AccordionTranslations
   *
   * Messages used by the component for the labels of its buttons. This includes
   * the visible text shown on screen, and text to help assistive technology users
   * for the buttons toggling each section.
   * @property {string} [hideAllSections] - The text content for the 'Hide all
   *   sections' button, used when at least one section is expanded.
   * @property {string} [hideSection] - The text content for the 'Hide'
   *   button, used when a section is expanded.
   * @property {string} [hideSectionAriaLabel] - The text content appended to the
   *   'Hide' button's accessible name when a section is expanded.
   * @property {string} [showAllSections] - The text content for the 'Show all
   *   sections' button, used when all sections are collapsed.
   * @property {string} [showSection] - The text content for the 'Show'
   *   button, used when a section is collapsed.
   * @property {string} [showSectionAriaLabel] - The text content appended to the
   *   'Show' button's accessible name when a section is expanded.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  Accordion.moduleName = 'govuk-accordion';
  Accordion.defaults = Object.freeze({
    i18n: {
      hideAllSections: 'Hide all sections',
      hideSection: 'Hide',
      hideSectionAriaLabel: 'Hide this section',
      showAllSections: 'Show all sections',
      showSection: 'Show',
      showSectionAriaLabel: 'Show this section'
    },
    rememberExpanded: true
  });
  Accordion.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      },
      rememberExpanded: {
        type: 'boolean'
      }
    }
  });
  const DEBOUNCE_TIMEOUT_IN_SECONDS = 1;

  /**
   * JavaScript enhancements for the Button component
   *
   * @preserve
   * @augments ConfigurableComponent<ButtonConfig>
   */
  class Button extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for button
     * @param {ButtonConfig} [config] - Button config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.debounceFormSubmitTimer = null;
      this.$root.addEventListener('keydown', event => this.handleKeyDown(event));
      this.$root.addEventListener('click', event => this.debounce(event));
    }
    handleKeyDown(event) {
      const $target = event.target;
      if (event.key !== ' ') {
        return;
      }
      if ($target instanceof HTMLElement && $target.getAttribute('role') === 'button') {
        event.preventDefault();
        $target.click();
      }
    }
    debounce(event) {
      if (!this.config.preventDoubleClick) {
        return;
      }
      if (this.debounceFormSubmitTimer) {
        event.preventDefault();
        return false;
      }
      this.debounceFormSubmitTimer = window.setTimeout(() => {
        this.debounceFormSubmitTimer = null;
      }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
    }
  }

  /**
   * Button config
   *
   * @typedef {object} ButtonConfig
   * @property {boolean} [preventDoubleClick=false] - Prevent accidental double
   *   clicks on submit buttons from submitting forms multiple times.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  Button.moduleName = 'govuk-button';
  Button.defaults = Object.freeze({
    preventDoubleClick: false
  });
  Button.schema = Object.freeze({
    properties: {
      preventDoubleClick: {
        type: 'boolean'
      }
    }
  });
  function closestAttributeValue($element, attributeName) {
    const $closestElementWithAttribute = $element.closest(`[${attributeName}]`);
    return $closestElementWithAttribute ? $closestElementWithAttribute.getAttribute(attributeName) : null;
  }

  /**
   * Character count component
   *
   * Tracks the number of characters or words in the `.govuk-js-character-count`
   * `<textarea>` inside the element. Displays a message with the remaining number
   * of characters/words available, or the number of characters/words in excess.
   *
   * You can configure the message to only appear after a certain percentage
   * of the available characters/words has been entered.
   *
   * @preserve
   * @augments ConfigurableComponent<CharacterCountConfig>
   */
  class CharacterCount extends ConfigurableComponent {
    [configOverride](datasetConfig) {
      let configOverrides = {};
      if ('maxwords' in datasetConfig || 'maxlength' in datasetConfig) {
        configOverrides = {
          maxlength: undefined,
          maxwords: undefined
        };
      }
      return configOverrides;
    }

    /**
     * @param {Element | null} $root - HTML element to use for character count
     * @param {CharacterCountConfig} [config] - Character count config
     */
    constructor($root, config = {}) {
      var _ref, _this$config$maxwords;
      super($root, config);
      this.$textarea = void 0;
      this.$visibleCountMessage = void 0;
      this.$screenReaderCountMessage = void 0;
      this.lastInputTimestamp = null;
      this.lastInputValue = '';
      this.valueChecker = null;
      this.i18n = void 0;
      this.maxLength = void 0;
      const $textarea = this.$root.querySelector('.govuk-js-character-count');
      if (!($textarea instanceof HTMLTextAreaElement || $textarea instanceof HTMLInputElement)) {
        throw new ElementError({
          component: CharacterCount,
          element: $textarea,
          expectedType: 'HTMLTextareaElement or HTMLInputElement',
          identifier: 'Form field (`.govuk-js-character-count`)'
        });
      }
      const errors = validateConfig(CharacterCount.schema, this.config);
      if (errors[0]) {
        throw new ConfigError(formatErrorMessage(CharacterCount, errors[0]));
      }
      this.i18n = new I18n(this.config.i18n, {
        locale: closestAttributeValue(this.$root, 'lang')
      });
      this.maxLength = (_ref = (_this$config$maxwords = this.config.maxwords) != null ? _this$config$maxwords : this.config.maxlength) != null ? _ref : Infinity;
      this.$textarea = $textarea;
      const textareaDescriptionId = `${this.$textarea.id}-info`;
      const $textareaDescription = document.getElementById(textareaDescriptionId);
      if (!$textareaDescription) {
        throw new ElementError({
          component: CharacterCount,
          element: $textareaDescription,
          identifier: `Count message (\`id="${textareaDescriptionId}"\`)`
        });
      }
      this.$errorMessage = this.$root.querySelector('.govuk-error-message');
      if (`${$textareaDescription.textContent}`.match(/^\s*$/)) {
        $textareaDescription.textContent = this.i18n.t('textareaDescription', {
          count: this.maxLength
        });
      }
      this.$textarea.insertAdjacentElement('afterend', $textareaDescription);
      const $screenReaderCountMessage = document.createElement('div');
      $screenReaderCountMessage.className = 'govuk-character-count__sr-status govuk-visually-hidden';
      $screenReaderCountMessage.setAttribute('aria-live', 'polite');
      this.$screenReaderCountMessage = $screenReaderCountMessage;
      $textareaDescription.insertAdjacentElement('afterend', $screenReaderCountMessage);
      const $visibleCountMessage = document.createElement('div');
      $visibleCountMessage.className = $textareaDescription.className;
      $visibleCountMessage.classList.add('govuk-character-count__status');
      $visibleCountMessage.setAttribute('aria-hidden', 'true');
      this.$visibleCountMessage = $visibleCountMessage;
      $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);
      $textareaDescription.classList.add('govuk-visually-hidden');
      this.$textarea.removeAttribute('maxlength');
      this.bindChangeEvents();
      window.addEventListener('pageshow', () => this.updateCountMessage());
      this.updateCountMessage();
    }
    bindChangeEvents() {
      this.$textarea.addEventListener('keyup', () => this.handleKeyUp());
      this.$textarea.addEventListener('focus', () => this.handleFocus());
      this.$textarea.addEventListener('blur', () => this.handleBlur());
    }
    handleKeyUp() {
      this.updateVisibleCountMessage();
      this.lastInputTimestamp = Date.now();
    }
    handleFocus() {
      this.valueChecker = window.setInterval(() => {
        if (!this.lastInputTimestamp || Date.now() - 500 >= this.lastInputTimestamp) {
          this.updateIfValueChanged();
        }
      }, 1000);
    }
    handleBlur() {
      if (this.valueChecker) {
        window.clearInterval(this.valueChecker);
      }
    }
    updateIfValueChanged() {
      if (this.$textarea.value !== this.lastInputValue) {
        this.lastInputValue = this.$textarea.value;
        this.updateCountMessage();
      }
    }
    updateCountMessage() {
      this.updateVisibleCountMessage();
      this.updateScreenReaderCountMessage();
    }
    updateVisibleCountMessage() {
      const remainingNumber = this.maxLength - this.count(this.$textarea.value);
      const isError = remainingNumber < 0;
      this.$visibleCountMessage.classList.toggle('govuk-character-count__message--disabled', !this.isOverThreshold());
      if (!this.$errorMessage) {
        this.$textarea.classList.toggle('govuk-textarea--error', isError);
      }
      this.$visibleCountMessage.classList.toggle('govuk-error-message', isError);
      this.$visibleCountMessage.classList.toggle('govuk-hint', !isError);
      this.$visibleCountMessage.textContent = this.getCountMessage();
    }
    updateScreenReaderCountMessage() {
      if (this.isOverThreshold()) {
        this.$screenReaderCountMessage.removeAttribute('aria-hidden');
      } else {
        this.$screenReaderCountMessage.setAttribute('aria-hidden', 'true');
      }
      this.$screenReaderCountMessage.textContent = this.getCountMessage();
    }
    count(text) {
      if (this.config.maxwords) {
        var _text$match;
        const tokens = (_text$match = text.match(/\S+/g)) != null ? _text$match : [];
        return tokens.length;
      }
      return text.length;
    }
    getCountMessage() {
      const remainingNumber = this.maxLength - this.count(this.$textarea.value);
      const countType = this.config.maxwords ? 'words' : 'characters';
      return this.formatCountMessage(remainingNumber, countType);
    }
    formatCountMessage(remainingNumber, countType) {
      if (remainingNumber === 0) {
        return this.i18n.t(`${countType}AtLimit`);
      }
      const translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';
      return this.i18n.t(`${countType}${translationKeySuffix}`, {
        count: Math.abs(remainingNumber)
      });
    }
    isOverThreshold() {
      if (!this.config.threshold) {
        return true;
      }
      const currentLength = this.count(this.$textarea.value);
      const maxLength = this.maxLength;
      const thresholdValue = maxLength * this.config.threshold / 100;
      return thresholdValue <= currentLength;
    }
  }

  /**
   * Character count config
   *
   * @see {@link CharacterCount.defaults}
   * @typedef {object} CharacterCountConfig
   * @property {number} [maxlength] - The maximum number of characters.
   *   If maxwords is provided, the maxlength option will be ignored.
   * @property {number} [maxwords] - The maximum number of words. If maxwords is
   *   provided, the maxlength option will be ignored.
   * @property {number} [threshold=0] - The percentage value of the limit at
   *   which point the count message is displayed. If this attribute is set, the
   *   count message will be hidden by default.
   * @property {CharacterCountTranslations} [i18n=CharacterCount.defaults.i18n] - Character count translations
   */

  /**
   * Character count translations
   *
   * @see {@link CharacterCount.defaults.i18n}
   * @typedef {object} CharacterCountTranslations
   *
   * Messages shown to users as they type. It provides feedback on how many words
   * or characters they have remaining or if they are over the limit. This also
   * includes a message used as an accessible description for the textarea.
   * @property {TranslationPluralForms} [charactersUnderLimit] - Message displayed
   *   when the number of characters is under the configured maximum, `maxlength`.
   *   This message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining characters. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {string} [charactersAtLimit] - Message displayed when the number of
   *   characters reaches the configured maximum, `maxlength`. This message is
   *   displayed visually and through assistive technologies.
   * @property {TranslationPluralForms} [charactersOverLimit] - Message displayed
   *   when the number of characters is over the configured maximum, `maxlength`.
   *   This message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining characters. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {TranslationPluralForms} [wordsUnderLimit] - Message displayed when
   *   the number of words is under the configured maximum, `maxlength`. This
   *   message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining words. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {string} [wordsAtLimit] - Message displayed when the number of
   *   words reaches the configured maximum, `maxlength`. This message is
   *   displayed visually and through assistive technologies.
   * @property {TranslationPluralForms} [wordsOverLimit] - Message displayed when
   *   the number of words is over the configured maximum, `maxlength`. This
   *   message is displayed visually and through assistive technologies. The
   *   component will replace the `%{count}` placeholder with the number of
   *   remaining words. This is a [pluralised list of
   *   messages](https://frontend.design-system.service.gov.uk/localise-govuk-frontend).
   * @property {TranslationPluralForms} [textareaDescription] - Message made
   *   available to assistive technologies, if none is already present in the
   *   HTML, to describe that the component accepts only a limited amount of
   *   content. It is visible on the page when JavaScript is unavailable. The
   *   component will replace the `%{count}` placeholder with the value of the
   *   `maxlength` or `maxwords` parameter.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   * @import { TranslationPluralForms } from '../../i18n.mjs'
   */
  CharacterCount.moduleName = 'govuk-character-count';
  CharacterCount.defaults = Object.freeze({
    threshold: 0,
    i18n: {
      charactersUnderLimit: {
        one: 'You have %{count} character remaining',
        other: 'You have %{count} characters remaining'
      },
      charactersAtLimit: 'You have 0 characters remaining',
      charactersOverLimit: {
        one: 'You have %{count} character too many',
        other: 'You have %{count} characters too many'
      },
      wordsUnderLimit: {
        one: 'You have %{count} word remaining',
        other: 'You have %{count} words remaining'
      },
      wordsAtLimit: 'You have 0 words remaining',
      wordsOverLimit: {
        one: 'You have %{count} word too many',
        other: 'You have %{count} words too many'
      },
      textareaDescription: {
        other: ''
      }
    }
  });
  CharacterCount.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      },
      maxwords: {
        type: 'number'
      },
      maxlength: {
        type: 'number'
      },
      threshold: {
        type: 'number'
      }
    },
    anyOf: [{
      required: ['maxwords'],
      errorMessage: 'Either "maxlength" or "maxwords" must be provided'
    }, {
      required: ['maxlength'],
      errorMessage: 'Either "maxlength" or "maxwords" must be provided'
    }]
  });

  /**
   * Checkboxes component
   *
   * @preserve
   */
  class Checkboxes extends Component {
    /**
     * Checkboxes can be associated with a 'conditionally revealed' content block
     * – for example, a checkbox for 'Phone' could reveal an additional form field
     * for the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which
     * is promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page
     * (for example if the user has navigated back), and set up event handlers to
     * keep the reveal in sync with the checkbox state.
     *
     * @param {Element | null} $root - HTML element to use for checkboxes
     */
    constructor($root) {
      super($root);
      this.$inputs = void 0;
      const $inputs = this.$root.querySelectorAll('input[type="checkbox"]');
      if (!$inputs.length) {
        throw new ElementError({
          component: Checkboxes,
          identifier: 'Form inputs (`<input type="checkbox">`)'
        });
      }
      this.$inputs = $inputs;
      this.$inputs.forEach($input => {
        const targetId = $input.getAttribute('data-aria-controls');
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError({
            component: Checkboxes,
            identifier: `Conditional reveal (\`id="${targetId}"\`)`
          });
        }
        $input.setAttribute('aria-controls', targetId);
        $input.removeAttribute('data-aria-controls');
      });
      window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$root.addEventListener('click', event => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute('aria-controls');
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target != null && $target.classList.contains('govuk-checkboxes__conditional')) {
        const inputIsChecked = $input.checked;
        $input.setAttribute('aria-expanded', inputIsChecked.toString());
        $target.classList.toggle('govuk-checkboxes__conditional--hidden', !inputIsChecked);
      }
    }
    unCheckAllInputsExcept($input) {
      const allInputsWithSameName = document.querySelectorAll(`input[type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameName.forEach($inputWithSameName => {
        const hasSameFormOwner = $input.form === $inputWithSameName.form;
        if (hasSameFormOwner && $inputWithSameName !== $input) {
          $inputWithSameName.checked = false;
          this.syncConditionalRevealWithInputState($inputWithSameName);
        }
      });
    }
    unCheckExclusiveInputs($input) {
      const allInputsWithSameNameAndExclusiveBehaviour = document.querySelectorAll(`input[data-behaviour="exclusive"][type="checkbox"][name="${$input.name}"]`);
      allInputsWithSameNameAndExclusiveBehaviour.forEach($exclusiveInput => {
        const hasSameFormOwner = $input.form === $exclusiveInput.form;
        if (hasSameFormOwner) {
          $exclusiveInput.checked = false;
          this.syncConditionalRevealWithInputState($exclusiveInput);
        }
      });
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'checkbox') {
        return;
      }
      const hasAriaControls = $clickedInput.getAttribute('aria-controls');
      if (hasAriaControls) {
        this.syncConditionalRevealWithInputState($clickedInput);
      }
      if (!$clickedInput.checked) {
        return;
      }
      const hasBehaviourExclusive = $clickedInput.getAttribute('data-behaviour') === 'exclusive';
      if (hasBehaviourExclusive) {
        this.unCheckAllInputsExcept($clickedInput);
      } else {
        this.unCheckExclusiveInputs($clickedInput);
      }
    }
  }
  Checkboxes.moduleName = 'govuk-checkboxes';

  /**
   * Error summary component
   *
   * Takes focus on initialisation for accessible announcement, unless disabled in
   * configuration.
   *
   * @preserve
   * @augments ConfigurableComponent<ErrorSummaryConfig>
   */
  class ErrorSummary extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for error summary
     * @param {ErrorSummaryConfig} [config] - Error summary config
     */
    constructor($root, config = {}) {
      super($root, config);
      if (!this.config.disableAutoFocus) {
        setFocus(this.$root);
      }
      this.$root.addEventListener('click', event => this.handleClick(event));
    }
    handleClick(event) {
      const $target = event.target;
      if ($target && this.focusTarget($target)) {
        event.preventDefault();
      }
    }
    focusTarget($target) {
      if (!($target instanceof HTMLAnchorElement)) {
        return false;
      }
      const inputId = getFragmentFromUrl($target.href);
      if (!inputId) {
        return false;
      }
      const $input = document.getElementById(inputId);
      if (!$input) {
        return false;
      }
      const $legendOrLabel = this.getAssociatedLegendOrLabel($input);
      if (!$legendOrLabel) {
        return false;
      }
      $legendOrLabel.scrollIntoView();
      $input.focus({
        preventScroll: true
      });
      return true;
    }
    getAssociatedLegendOrLabel($input) {
      var _document$querySelect;
      const $fieldset = $input.closest('fieldset');
      if ($fieldset) {
        const $legends = $fieldset.getElementsByTagName('legend');
        if ($legends.length) {
          const $candidateLegend = $legends[0];
          if ($input instanceof HTMLInputElement && ($input.type === 'checkbox' || $input.type === 'radio')) {
            return $candidateLegend;
          }
          const legendTop = $candidateLegend.getBoundingClientRect().top;
          const inputRect = $input.getBoundingClientRect();
          if (inputRect.height && window.innerHeight) {
            const inputBottom = inputRect.top + inputRect.height;
            if (inputBottom - legendTop < window.innerHeight / 2) {
              return $candidateLegend;
            }
          }
        }
      }
      return (_document$querySelect = document.querySelector(`label[for='${$input.getAttribute('id')}']`)) != null ? _document$querySelect : $input.closest('label');
    }
  }

  /**
   * Error summary config
   *
   * @typedef {object} ErrorSummaryConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the error
   *   summary will not be focussed when the page loads.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  ErrorSummary.moduleName = 'govuk-error-summary';
  ErrorSummary.defaults = Object.freeze({
    disableAutoFocus: false
  });
  ErrorSummary.schema = Object.freeze({
    properties: {
      disableAutoFocus: {
        type: 'boolean'
      }
    }
  });

  /**
   * Exit this page component
   *
   * @preserve
   * @augments ConfigurableComponent<ExitThisPageConfig>
   */
  class ExitThisPage extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element that wraps the Exit This Page button
     * @param {ExitThisPageConfig} [config] - Exit This Page config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.$button = void 0;
      this.$skiplinkButton = null;
      this.$updateSpan = null;
      this.$indicatorContainer = null;
      this.$overlay = null;
      this.keypressCounter = 0;
      this.lastKeyWasModified = false;
      this.timeoutTime = 5000;
      this.keypressTimeoutId = null;
      this.timeoutMessageId = null;
      const $button = this.$root.querySelector('.govuk-exit-this-page__button');
      if (!($button instanceof HTMLAnchorElement)) {
        throw new ElementError({
          component: ExitThisPage,
          element: $button,
          expectedType: 'HTMLAnchorElement',
          identifier: 'Button (`.govuk-exit-this-page__button`)'
        });
      }
      this.i18n = new I18n(this.config.i18n);
      this.$button = $button;
      const $skiplinkButton = document.querySelector('.govuk-js-exit-this-page-skiplink');
      if ($skiplinkButton instanceof HTMLAnchorElement) {
        this.$skiplinkButton = $skiplinkButton;
      }
      this.buildIndicator();
      this.initUpdateSpan();
      this.initButtonClickHandler();
      if (!('govukFrontendExitThisPageKeypress' in document.body.dataset)) {
        document.addEventListener('keyup', this.handleKeypress.bind(this), true);
        document.body.dataset.govukFrontendExitThisPageKeypress = 'true';
      }
      window.addEventListener('pageshow', this.resetPage.bind(this));
    }
    initUpdateSpan() {
      this.$updateSpan = document.createElement('span');
      this.$updateSpan.setAttribute('role', 'status');
      this.$updateSpan.className = 'govuk-visually-hidden';
      this.$root.appendChild(this.$updateSpan);
    }
    initButtonClickHandler() {
      this.$button.addEventListener('click', this.handleClick.bind(this));
      if (this.$skiplinkButton) {
        this.$skiplinkButton.addEventListener('click', this.handleClick.bind(this));
      }
    }
    buildIndicator() {
      this.$indicatorContainer = document.createElement('div');
      this.$indicatorContainer.className = 'govuk-exit-this-page__indicator';
      this.$indicatorContainer.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 3; i++) {
        const $indicator = document.createElement('div');
        $indicator.className = 'govuk-exit-this-page__indicator-light';
        this.$indicatorContainer.appendChild($indicator);
      }
      this.$button.appendChild(this.$indicatorContainer);
    }
    updateIndicator() {
      if (!this.$indicatorContainer) {
        return;
      }
      this.$indicatorContainer.classList.toggle('govuk-exit-this-page__indicator--visible', this.keypressCounter > 0);
      const $indicators = this.$indicatorContainer.querySelectorAll('.govuk-exit-this-page__indicator-light');
      $indicators.forEach(($indicator, index) => {
        $indicator.classList.toggle('govuk-exit-this-page__indicator-light--on', index < this.keypressCounter);
      });
    }
    exitPage() {
      if (!this.$updateSpan) {
        return;
      }
      this.$updateSpan.textContent = '';
      document.body.classList.add('govuk-exit-this-page-hide-content');
      this.$overlay = document.createElement('div');
      this.$overlay.className = 'govuk-exit-this-page-overlay';
      this.$overlay.setAttribute('role', 'alert');
      document.body.appendChild(this.$overlay);
      this.$overlay.textContent = this.i18n.t('activated');
      window.location.href = this.$button.href;
    }
    handleClick(event) {
      event.preventDefault();
      this.exitPage();
    }
    handleKeypress(event) {
      if (!this.$updateSpan) {
        return;
      }
      if (event.key === 'Shift' && !this.lastKeyWasModified) {
        this.keypressCounter += 1;
        this.updateIndicator();
        if (this.timeoutMessageId) {
          window.clearTimeout(this.timeoutMessageId);
          this.timeoutMessageId = null;
        }
        if (this.keypressCounter >= 3) {
          this.keypressCounter = 0;
          if (this.keypressTimeoutId) {
            window.clearTimeout(this.keypressTimeoutId);
            this.keypressTimeoutId = null;
          }
          this.exitPage();
        } else {
          if (this.keypressCounter === 1) {
            this.$updateSpan.textContent = this.i18n.t('pressTwoMoreTimes');
          } else {
            this.$updateSpan.textContent = this.i18n.t('pressOneMoreTime');
          }
        }
        this.setKeypressTimer();
      } else if (this.keypressTimeoutId) {
        this.resetKeypressTimer();
      }
      this.lastKeyWasModified = event.shiftKey;
    }
    setKeypressTimer() {
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
      }
      this.keypressTimeoutId = window.setTimeout(this.resetKeypressTimer.bind(this), this.timeoutTime);
    }
    resetKeypressTimer() {
      if (!this.$updateSpan) {
        return;
      }
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
        this.keypressTimeoutId = null;
      }
      const $updateSpan = this.$updateSpan;
      this.keypressCounter = 0;
      $updateSpan.textContent = this.i18n.t('timedOut');
      this.timeoutMessageId = window.setTimeout(() => {
        $updateSpan.textContent = '';
      }, this.timeoutTime);
      this.updateIndicator();
    }
    resetPage() {
      document.body.classList.remove('govuk-exit-this-page-hide-content');
      if (this.$overlay) {
        this.$overlay.remove();
        this.$overlay = null;
      }
      if (this.$updateSpan) {
        this.$updateSpan.setAttribute('role', 'status');
        this.$updateSpan.textContent = '';
      }
      this.updateIndicator();
      if (this.keypressTimeoutId) {
        window.clearTimeout(this.keypressTimeoutId);
      }
      if (this.timeoutMessageId) {
        window.clearTimeout(this.timeoutMessageId);
      }
    }
  }

  /**
   * Exit this Page config
   *
   * @see {@link ExitThisPage.defaults}
   * @typedef {object} ExitThisPageConfig
   * @property {ExitThisPageTranslations} [i18n=ExitThisPage.defaults.i18n] - Exit this page translations
   */

  /**
   * Exit this Page translations
   *
   * @see {@link ExitThisPage.defaults.i18n}
   * @typedef {object} ExitThisPageTranslations
   *
   * Messages used by the component programatically inserted text, including
   * overlay text and screen reader announcements.
   * @property {string} [activated] - Screen reader announcement for when EtP
   *   keypress functionality has been successfully activated.
   * @property {string} [timedOut] - Screen reader announcement for when the EtP
   *   keypress functionality has timed out.
   * @property {string} [pressTwoMoreTimes] - Screen reader announcement informing
   *   the user they must press the activation key two more times.
   * @property {string} [pressOneMoreTime] - Screen reader announcement informing
   *   the user they must press the activation key one more time.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  ExitThisPage.moduleName = 'govuk-exit-this-page';
  ExitThisPage.defaults = Object.freeze({
    i18n: {
      activated: 'Loading.',
      timedOut: 'Exit this page expired.',
      pressTwoMoreTimes: 'Shift, press 2 more times to exit.',
      pressOneMoreTime: 'Shift, press 1 more time to exit.'
    }
  });
  ExitThisPage.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      }
    }
  });

  /**
   * File upload component
   *
   * @preserve
   * @augments ConfigurableComponent<FileUploadConfig>
   */
  class FileUpload extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - File input element
     * @param {FileUploadConfig} [config] - File Upload config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.$input = void 0;
      this.$button = void 0;
      this.$status = void 0;
      this.i18n = void 0;
      this.id = void 0;
      this.$announcements = void 0;
      this.enteredAnotherElement = void 0;
      const $input = this.$root.querySelector('input');
      if ($input === null) {
        throw new ElementError({
          component: FileUpload,
          identifier: 'File inputs (`<input type="file">`)'
        });
      }
      if ($input.type !== 'file') {
        throw new ElementError(formatErrorMessage(FileUpload, 'File input (`<input type="file">`) attribute (`type`) is not `file`'));
      }
      this.$input = $input;
      this.$input.setAttribute('hidden', 'true');
      if (!this.$input.id) {
        throw new ElementError({
          component: FileUpload,
          identifier: 'File input (`<input type="file">`) attribute (`id`)'
        });
      }
      this.id = this.$input.id;
      this.i18n = new I18n(this.config.i18n, {
        locale: closestAttributeValue(this.$root, 'lang')
      });
      const $label = this.findLabel();
      if (!$label.id) {
        $label.id = `${this.id}-label`;
      }
      this.$input.id = `${this.id}-input`;
      const $button = document.createElement('button');
      $button.classList.add('govuk-file-upload-button');
      $button.type = 'button';
      $button.id = this.id;
      $button.classList.add('govuk-file-upload-button--empty');
      const ariaDescribedBy = this.$input.getAttribute('aria-describedby');
      if (ariaDescribedBy) {
        $button.setAttribute('aria-describedby', ariaDescribedBy);
      }
      const $status = document.createElement('span');
      $status.className = 'govuk-body govuk-file-upload-button__status';
      $status.setAttribute('aria-live', 'polite');
      $status.innerText = this.i18n.t('noFileChosen');
      $button.appendChild($status);
      const commaSpan = document.createElement('span');
      commaSpan.className = 'govuk-visually-hidden';
      commaSpan.innerText = ', ';
      commaSpan.id = `${this.id}-comma`;
      $button.appendChild(commaSpan);
      const containerSpan = document.createElement('span');
      containerSpan.className = 'govuk-file-upload-button__pseudo-button-container';
      const buttonSpan = document.createElement('span');
      buttonSpan.className = 'govuk-button govuk-button--secondary govuk-file-upload-button__pseudo-button';
      buttonSpan.innerText = this.i18n.t('chooseFilesButton');
      containerSpan.appendChild(buttonSpan);
      containerSpan.insertAdjacentText('beforeend', ' ');
      const instructionSpan = document.createElement('span');
      instructionSpan.className = 'govuk-body govuk-file-upload-button__instruction';
      instructionSpan.innerText = this.i18n.t('dropInstruction');
      containerSpan.appendChild(instructionSpan);
      $button.appendChild(containerSpan);
      $button.setAttribute('aria-labelledby', `${$label.id} ${commaSpan.id} ${$button.id}`);
      $button.addEventListener('click', this.onClick.bind(this));
      $button.addEventListener('dragover', event => {
        event.preventDefault();
      });
      this.$root.insertAdjacentElement('afterbegin', $button);
      this.$input.setAttribute('tabindex', '-1');
      this.$input.setAttribute('aria-hidden', 'true');
      this.$button = $button;
      this.$status = $status;
      this.$input.addEventListener('change', this.onChange.bind(this));
      this.updateDisabledState();
      this.observeDisabledState();
      this.$announcements = document.createElement('span');
      this.$announcements.classList.add('govuk-file-upload-announcements');
      this.$announcements.classList.add('govuk-visually-hidden');
      this.$announcements.setAttribute('aria-live', 'assertive');
      this.$root.insertAdjacentElement('afterend', this.$announcements);
      this.$button.addEventListener('drop', this.onDrop.bind(this));
      document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
      document.addEventListener('dragenter', () => {
        this.enteredAnotherElement = true;
      });
      document.addEventListener('dragleave', () => {
        if (!this.enteredAnotherElement && !this.$button.disabled) {
          this.hideDraggingState();
          this.$announcements.innerText = this.i18n.t('leftDropZone');
        }
        this.enteredAnotherElement = false;
      });
    }
    updateDropzoneVisibility(event) {
      if (this.$button.disabled) return;
      if (event.target instanceof Node) {
        if (this.$root.contains(event.target)) {
          if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
            if (!this.$button.classList.contains('govuk-file-upload-button--dragging')) {
              this.showDraggingState();
              this.$announcements.innerText = this.i18n.t('enteredDropZone');
            }
          }
        } else {
          if (this.$button.classList.contains('govuk-file-upload-button--dragging')) {
            this.hideDraggingState();
            this.$announcements.innerText = this.i18n.t('leftDropZone');
          }
        }
      }
    }
    showDraggingState() {
      this.$button.classList.add('govuk-file-upload-button--dragging');
    }
    hideDraggingState() {
      this.$button.classList.remove('govuk-file-upload-button--dragging');
    }
    onDrop(event) {
      event.preventDefault();
      if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
        this.$input.files = event.dataTransfer.files;
        this.$input.dispatchEvent(new CustomEvent('change'));
        this.hideDraggingState();
      }
    }
    onChange() {
      const fileCount = this.$input.files.length;
      if (fileCount === 0) {
        this.$status.innerText = this.i18n.t('noFileChosen');
        this.$button.classList.add('govuk-file-upload-button--empty');
      } else {
        if (fileCount === 1) {
          this.$status.innerText = this.$input.files[0].name;
        } else {
          this.$status.innerText = this.i18n.t('multipleFilesChosen', {
            count: fileCount
          });
        }
        this.$button.classList.remove('govuk-file-upload-button--empty');
      }
    }
    findLabel() {
      const $label = document.querySelector(`label[for="${this.$input.id}"]`);
      if (!$label) {
        throw new ElementError({
          component: FileUpload,
          identifier: `Field label (\`<label for=${this.$input.id}>\`)`
        });
      }
      return $label;
    }
    onClick() {
      this.$input.click();
    }
    observeDisabledState() {
      const observer = new MutationObserver(mutationList => {
        for (const mutation of mutationList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
            this.updateDisabledState();
          }
        }
      });
      observer.observe(this.$input, {
        attributes: true
      });
    }
    updateDisabledState() {
      this.$button.disabled = this.$input.disabled;
      this.$root.classList.toggle('govuk-drop-zone--disabled', this.$button.disabled);
    }
  }
  FileUpload.moduleName = 'govuk-file-upload';
  FileUpload.defaults = Object.freeze({
    i18n: {
      chooseFilesButton: 'Choose file',
      dropInstruction: 'or drop file',
      noFileChosen: 'No file chosen',
      multipleFilesChosen: {
        one: '%{count} file chosen',
        other: '%{count} files chosen'
      },
      enteredDropZone: 'Entered drop zone',
      leftDropZone: 'Left drop zone'
    }
  });
  FileUpload.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      }
    }
  });
  function isContainingFiles(dataTransfer) {
    const hasNoTypesInfo = dataTransfer.types.length === 0;
    const isDraggingFiles = dataTransfer.types.some(type => type === 'Files');
    return hasNoTypesInfo || isDraggingFiles;
  }

  /**
   * @typedef {HTMLInputElement & {files: FileList}} HTMLFileInputElement
   */

  /**
   * File upload config
   *
   * @see {@link FileUpload.defaults}
   * @typedef {object} FileUploadConfig
   * @property {FileUploadTranslations} [i18n=FileUpload.defaults.i18n] - File upload translations
   */

  /**
   * File upload translations
   *
   * @see {@link FileUpload.defaults.i18n}
   * @typedef {object} FileUploadTranslations
   *
   * Messages used by the component
   * @property {string} [chooseFile] - The text of the button that opens the file picker
   * @property {string} [dropInstruction] - The text informing users they can drop files
   * @property {TranslationPluralForms} [multipleFilesChosen] - The text displayed when multiple files
   *   have been chosen by the user
   * @property {string} [noFileChosen] - The text to displayed when no file has been chosen by the user
   * @property {string} [enteredDropZone] - The text announced by assistive technology
   *   when user drags files and enters the drop zone
   * @property {string} [leftDropZone] - The text announced by assistive technology
   *   when user drags files and leaves the drop zone without dropping
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   * @import { TranslationPluralForms } from '../../i18n.mjs'
   */

  /**
   * Header component
   *
   * @preserve
   */
  class Header extends Component {
    /**
     * Apply a matchMedia for desktop which will trigger a state sync if the
     * browser viewport moves between states.
     *
     * @param {Element | null} $root - HTML element to use for header
     */
    constructor($root) {
      super($root);
      this.$menuButton = void 0;
      this.$menu = void 0;
      this.menuIsOpen = false;
      this.mql = null;
      const $menuButton = this.$root.querySelector('.govuk-js-header-toggle');
      if (!$menuButton) {
        return this;
      }
      this.$root.classList.add('govuk-header--with-js-navigation');
      const menuId = $menuButton.getAttribute('aria-controls');
      if (!menuId) {
        throw new ElementError({
          component: Header,
          identifier: 'Navigation button (`<button class="govuk-js-header-toggle">`) attribute (`aria-controls`)'
        });
      }
      const $menu = document.getElementById(menuId);
      if (!$menu) {
        throw new ElementError({
          component: Header,
          element: $menu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        });
      }
      this.$menu = $menu;
      this.$menuButton = $menuButton;
      this.setupResponsiveChecks();
      this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
    }
    setupResponsiveChecks() {
      const breakpoint = getBreakpoint('desktop');
      if (!breakpoint.value) {
        throw new ElementError({
          component: Header,
          identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
        });
      }
      this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => this.checkMode());
      } else {
        this.mql.addListener(() => this.checkMode());
      }
      this.checkMode();
    }
    checkMode() {
      if (!this.mql || !this.$menu || !this.$menuButton) {
        return;
      }
      if (this.mql.matches) {
        this.$menu.removeAttribute('hidden');
        this.$menuButton.setAttribute('hidden', '');
      } else {
        this.$menuButton.removeAttribute('hidden');
        this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
        if (this.menuIsOpen) {
          this.$menu.removeAttribute('hidden');
        } else {
          this.$menu.setAttribute('hidden', '');
        }
      }
    }
    handleMenuButtonClick() {
      this.menuIsOpen = !this.menuIsOpen;
      this.checkMode();
    }
  }
  Header.moduleName = 'govuk-header';

  /**
   * Notification Banner component
   *
   * @preserve
   * @augments ConfigurableComponent<NotificationBannerConfig>
   */
  class NotificationBanner extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for notification banner
     * @param {NotificationBannerConfig} [config] - Notification banner config
     */
    constructor($root, config = {}) {
      super($root, config);
      if (this.$root.getAttribute('role') === 'alert' && !this.config.disableAutoFocus) {
        setFocus(this.$root);
      }
    }
  }

  /**
   * Notification banner config
   *
   * @typedef {object} NotificationBannerConfig
   * @property {boolean} [disableAutoFocus=false] - If set to `true` the
   *   notification banner will not be focussed when the page loads. This only
   *   applies if the component has a `role` of `alert` – in other cases the
   *   component will not be focused on page load, regardless of this option.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  NotificationBanner.moduleName = 'govuk-notification-banner';
  NotificationBanner.defaults = Object.freeze({
    disableAutoFocus: false
  });
  NotificationBanner.schema = Object.freeze({
    properties: {
      disableAutoFocus: {
        type: 'boolean'
      }
    }
  });

  /**
   * Password input component
   *
   * @preserve
   * @augments ConfigurableComponent<PasswordInputConfig>
   */
  class PasswordInput extends ConfigurableComponent {
    /**
     * @param {Element | null} $root - HTML element to use for password input
     * @param {PasswordInputConfig} [config] - Password input config
     */
    constructor($root, config = {}) {
      super($root, config);
      this.i18n = void 0;
      this.$input = void 0;
      this.$showHideButton = void 0;
      this.$screenReaderStatusMessage = void 0;
      const $input = this.$root.querySelector('.govuk-js-password-input-input');
      if (!($input instanceof HTMLInputElement)) {
        throw new ElementError({
          component: PasswordInput,
          element: $input,
          expectedType: 'HTMLInputElement',
          identifier: 'Form field (`.govuk-js-password-input-input`)'
        });
      }
      if ($input.type !== 'password') {
        throw new ElementError('Password input: Form field (`.govuk-js-password-input-input`) must be of type `password`.');
      }
      const $showHideButton = this.$root.querySelector('.govuk-js-password-input-toggle');
      if (!($showHideButton instanceof HTMLButtonElement)) {
        throw new ElementError({
          component: PasswordInput,
          element: $showHideButton,
          expectedType: 'HTMLButtonElement',
          identifier: 'Button (`.govuk-js-password-input-toggle`)'
        });
      }
      if ($showHideButton.type !== 'button') {
        throw new ElementError('Password input: Button (`.govuk-js-password-input-toggle`) must be of type `button`.');
      }
      this.$input = $input;
      this.$showHideButton = $showHideButton;
      this.i18n = new I18n(this.config.i18n, {
        locale: closestAttributeValue(this.$root, 'lang')
      });
      this.$showHideButton.removeAttribute('hidden');
      const $screenReaderStatusMessage = document.createElement('div');
      $screenReaderStatusMessage.className = 'govuk-password-input__sr-status govuk-visually-hidden';
      $screenReaderStatusMessage.setAttribute('aria-live', 'polite');
      this.$screenReaderStatusMessage = $screenReaderStatusMessage;
      this.$input.insertAdjacentElement('afterend', $screenReaderStatusMessage);
      this.$showHideButton.addEventListener('click', this.toggle.bind(this));
      if (this.$input.form) {
        this.$input.form.addEventListener('submit', () => this.hide());
      }
      window.addEventListener('pageshow', event => {
        if (event.persisted && this.$input.type !== 'password') {
          this.hide();
        }
      });
      this.hide();
    }
    toggle(event) {
      event.preventDefault();
      if (this.$input.type === 'password') {
        this.show();
        return;
      }
      this.hide();
    }
    show() {
      this.setType('text');
    }
    hide() {
      this.setType('password');
    }
    setType(type) {
      if (type === this.$input.type) {
        return;
      }
      this.$input.setAttribute('type', type);
      const isHidden = type === 'password';
      const prefixButton = isHidden ? 'show' : 'hide';
      const prefixStatus = isHidden ? 'passwordHidden' : 'passwordShown';
      this.$showHideButton.innerText = this.i18n.t(`${prefixButton}Password`);
      this.$showHideButton.setAttribute('aria-label', this.i18n.t(`${prefixButton}PasswordAriaLabel`));
      this.$screenReaderStatusMessage.innerText = this.i18n.t(`${prefixStatus}Announcement`);
    }
  }

  /**
   * Password input config
   *
   * @typedef {object} PasswordInputConfig
   * @property {PasswordInputTranslations} [i18n=PasswordInput.defaults.i18n] - Password input translations
   */

  /**
   * Password input translations
   *
   * @see {@link PasswordInput.defaults.i18n}
   * @typedef {object} PasswordInputTranslations
   *
   * Messages displayed to the user indicating the state of the show/hide toggle.
   * @property {string} [showPassword] - Visible text of the button when the
   *   password is currently hidden. Plain text only.
   * @property {string} [hidePassword] - Visible text of the button when the
   *   password is currently visible. Plain text only.
   * @property {string} [showPasswordAriaLabel] - aria-label of the button when
   *   the password is currently hidden. Plain text only.
   * @property {string} [hidePasswordAriaLabel] - aria-label of the button when
   *   the password is currently visible. Plain text only.
   * @property {string} [passwordShownAnnouncement] - Screen reader
   *   announcement to make when the password has just become visible.
   *   Plain text only.
   * @property {string} [passwordHiddenAnnouncement] - Screen reader
   *   announcement to make when the password has just been hidden.
   *   Plain text only.
   */

  /**
   * @import { Schema } from '../../common/configuration.mjs'
   */
  PasswordInput.moduleName = 'govuk-password-input';
  PasswordInput.defaults = Object.freeze({
    i18n: {
      showPassword: 'Show',
      hidePassword: 'Hide',
      showPasswordAriaLabel: 'Show password',
      hidePasswordAriaLabel: 'Hide password',
      passwordShownAnnouncement: 'Your password is visible',
      passwordHiddenAnnouncement: 'Your password is hidden'
    }
  });
  PasswordInput.schema = Object.freeze({
    properties: {
      i18n: {
        type: 'object'
      }
    }
  });

  /**
   * Radios component
   *
   * @preserve
   */
  class Radios extends Component {
    /**
     * Radios can be associated with a 'conditionally revealed' content block –
     * for example, a radio for 'Phone' could reveal an additional form field for
     * the user to enter their phone number.
     *
     * These associations are made using a `data-aria-controls` attribute, which
     * is promoted to an aria-controls attribute during initialisation.
     *
     * We also need to restore the state of any conditional reveals on the page
     * (for example if the user has navigated back), and set up event handlers to
     * keep the reveal in sync with the radio state.
     *
     * @param {Element | null} $root - HTML element to use for radios
     */
    constructor($root) {
      super($root);
      this.$inputs = void 0;
      const $inputs = this.$root.querySelectorAll('input[type="radio"]');
      if (!$inputs.length) {
        throw new ElementError({
          component: Radios,
          identifier: 'Form inputs (`<input type="radio">`)'
        });
      }
      this.$inputs = $inputs;
      this.$inputs.forEach($input => {
        const targetId = $input.getAttribute('data-aria-controls');
        if (!targetId) {
          return;
        }
        if (!document.getElementById(targetId)) {
          throw new ElementError({
            component: Radios,
            identifier: `Conditional reveal (\`id="${targetId}"\`)`
          });
        }
        $input.setAttribute('aria-controls', targetId);
        $input.removeAttribute('data-aria-controls');
      });
      window.addEventListener('pageshow', () => this.syncAllConditionalReveals());
      this.syncAllConditionalReveals();
      this.$root.addEventListener('click', event => this.handleClick(event));
    }
    syncAllConditionalReveals() {
      this.$inputs.forEach($input => this.syncConditionalRevealWithInputState($input));
    }
    syncConditionalRevealWithInputState($input) {
      const targetId = $input.getAttribute('aria-controls');
      if (!targetId) {
        return;
      }
      const $target = document.getElementById(targetId);
      if ($target != null && $target.classList.contains('govuk-radios__conditional')) {
        const inputIsChecked = $input.checked;
        $input.setAttribute('aria-expanded', inputIsChecked.toString());
        $target.classList.toggle('govuk-radios__conditional--hidden', !inputIsChecked);
      }
    }
    handleClick(event) {
      const $clickedInput = event.target;
      if (!($clickedInput instanceof HTMLInputElement) || $clickedInput.type !== 'radio') {
        return;
      }
      const $allInputs = document.querySelectorAll('input[type="radio"][aria-controls]');
      const $clickedInputForm = $clickedInput.form;
      const $clickedInputName = $clickedInput.name;
      $allInputs.forEach($input => {
        const hasSameFormOwner = $input.form === $clickedInputForm;
        const hasSameName = $input.name === $clickedInputName;
        if (hasSameName && hasSameFormOwner) {
          this.syncConditionalRevealWithInputState($input);
        }
      });
    }
  }
  Radios.moduleName = 'govuk-radios';

  /**
   * Service Navigation component
   *
   * @preserve
   */
  class ServiceNavigation extends Component {
    /**
     * @param {Element | null} $root - HTML element to use for header
     */
    constructor($root) {
      super($root);
      this.$menuButton = void 0;
      this.$menu = void 0;
      this.menuIsOpen = false;
      this.mql = null;
      const $menuButton = this.$root.querySelector('.govuk-js-service-navigation-toggle');
      if (!$menuButton) {
        return this;
      }
      const menuId = $menuButton.getAttribute('aria-controls');
      if (!menuId) {
        throw new ElementError({
          component: ServiceNavigation,
          identifier: 'Navigation button (`<button class="govuk-js-service-navigation-toggle">`) attribute (`aria-controls`)'
        });
      }
      const $menu = document.getElementById(menuId);
      if (!$menu) {
        throw new ElementError({
          component: ServiceNavigation,
          element: $menu,
          identifier: `Navigation (\`<ul id="${menuId}">\`)`
        });
      }
      this.$menu = $menu;
      this.$menuButton = $menuButton;
      this.setupResponsiveChecks();
      this.$menuButton.addEventListener('click', () => this.handleMenuButtonClick());
    }
    setupResponsiveChecks() {
      const breakpoint = getBreakpoint('tablet');
      if (!breakpoint.value) {
        throw new ElementError({
          component: ServiceNavigation,
          identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
        });
      }
      this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => this.checkMode());
      } else {
        this.mql.addListener(() => this.checkMode());
      }
      this.checkMode();
    }
    checkMode() {
      if (!this.mql || !this.$menu || !this.$menuButton) {
        return;
      }
      if (this.mql.matches) {
        this.$menu.removeAttribute('hidden');
        this.$menuButton.setAttribute('hidden', '');
      } else {
        this.$menuButton.removeAttribute('hidden');
        this.$menuButton.setAttribute('aria-expanded', this.menuIsOpen.toString());
        if (this.menuIsOpen) {
          this.$menu.removeAttribute('hidden');
        } else {
          this.$menu.setAttribute('hidden', '');
        }
      }
    }
    handleMenuButtonClick() {
      this.menuIsOpen = !this.menuIsOpen;
      this.checkMode();
    }
  }
  ServiceNavigation.moduleName = 'govuk-service-navigation';

  /**
   * Skip link component
   *
   * @preserve
   * @augments Component<HTMLAnchorElement>
   */
  class SkipLink extends Component {
    /**
     * @param {Element | null} $root - HTML element to use for skip link
     * @throws {ElementError} when $root is not set or the wrong type
     * @throws {ElementError} when $root.hash does not contain a hash
     * @throws {ElementError} when the linked element is missing or the wrong type
     */
    constructor($root) {
      var _this$$root$getAttrib;
      super($root);
      const hash = this.$root.hash;
      const href = (_this$$root$getAttrib = this.$root.getAttribute('href')) != null ? _this$$root$getAttrib : '';
      let url;
      try {
        url = new window.URL(this.$root.href);
      } catch (error) {
        throw new ElementError(`Skip link: Target link (\`href="${href}"\`) is invalid`);
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
        return;
      }
      const linkedElementId = getFragmentFromUrl(hash);
      if (!linkedElementId) {
        throw new ElementError(`Skip link: Target link (\`href="${href}"\`) has no hash fragment`);
      }
      const $linkedElement = document.getElementById(linkedElementId);
      if (!$linkedElement) {
        throw new ElementError({
          component: SkipLink,
          element: $linkedElement,
          identifier: `Target content (\`id="${linkedElementId}"\`)`
        });
      }
      this.$root.addEventListener('click', () => setFocus($linkedElement, {
        onBeforeFocus() {
          $linkedElement.classList.add('govuk-skip-link-focused-element');
        },
        onBlur() {
          $linkedElement.classList.remove('govuk-skip-link-focused-element');
        }
      }));
    }
  }
  SkipLink.elementType = HTMLAnchorElement;
  SkipLink.moduleName = 'govuk-skip-link';

  /**
   * Tabs component
   *
   * @preserve
   */
  class Tabs extends Component {
    /**
     * @param {Element | null} $root - HTML element to use for tabs
     */
    constructor($root) {
      super($root);
      this.$tabs = void 0;
      this.$tabList = void 0;
      this.$tabListItems = void 0;
      this.jsHiddenClass = 'govuk-tabs__panel--hidden';
      this.changingHash = false;
      this.boundTabClick = void 0;
      this.boundTabKeydown = void 0;
      this.boundOnHashChange = void 0;
      this.mql = null;
      const $tabs = this.$root.querySelectorAll('a.govuk-tabs__tab');
      if (!$tabs.length) {
        throw new ElementError({
          component: Tabs,
          identifier: 'Links (`<a class="govuk-tabs__tab">`)'
        });
      }
      this.$tabs = $tabs;
      this.boundTabClick = this.onTabClick.bind(this);
      this.boundTabKeydown = this.onTabKeydown.bind(this);
      this.boundOnHashChange = this.onHashChange.bind(this);
      const $tabList = this.$root.querySelector('.govuk-tabs__list');
      const $tabListItems = this.$root.querySelectorAll('li.govuk-tabs__list-item');
      if (!$tabList) {
        throw new ElementError({
          component: Tabs,
          identifier: 'List (`<ul class="govuk-tabs__list">`)'
        });
      }
      if (!$tabListItems.length) {
        throw new ElementError({
          component: Tabs,
          identifier: 'List items (`<li class="govuk-tabs__list-item">`)'
        });
      }
      this.$tabList = $tabList;
      this.$tabListItems = $tabListItems;
      this.setupResponsiveChecks();
    }
    setupResponsiveChecks() {
      const breakpoint = getBreakpoint('tablet');
      if (!breakpoint.value) {
        throw new ElementError({
          component: Tabs,
          identifier: `CSS custom property (\`${breakpoint.property}\`) on pseudo-class \`:root\``
        });
      }
      this.mql = window.matchMedia(`(min-width: ${breakpoint.value})`);
      if ('addEventListener' in this.mql) {
        this.mql.addEventListener('change', () => this.checkMode());
      } else {
        this.mql.addListener(() => this.checkMode());
      }
      this.checkMode();
    }
    checkMode() {
      var _this$mql;
      if ((_this$mql = this.mql) != null && _this$mql.matches) {
        this.setup();
      } else {
        this.teardown();
      }
    }
    setup() {
      var _this$getTab;
      this.$tabList.setAttribute('role', 'tablist');
      this.$tabListItems.forEach($item => {
        $item.setAttribute('role', 'presentation');
      });
      this.$tabs.forEach($tab => {
        this.setAttributes($tab);
        $tab.addEventListener('click', this.boundTabClick, true);
        $tab.addEventListener('keydown', this.boundTabKeydown, true);
        this.hideTab($tab);
      });
      const $activeTab = (_this$getTab = this.getTab(window.location.hash)) != null ? _this$getTab : this.$tabs[0];
      this.showTab($activeTab);
      window.addEventListener('hashchange', this.boundOnHashChange, true);
    }
    teardown() {
      this.$tabList.removeAttribute('role');
      this.$tabListItems.forEach($item => {
        $item.removeAttribute('role');
      });
      this.$tabs.forEach($tab => {
        $tab.removeEventListener('click', this.boundTabClick, true);
        $tab.removeEventListener('keydown', this.boundTabKeydown, true);
        this.unsetAttributes($tab);
      });
      window.removeEventListener('hashchange', this.boundOnHashChange, true);
    }
    onHashChange() {
      const hash = window.location.hash;
      const $tabWithHash = this.getTab(hash);
      if (!$tabWithHash) {
        return;
      }
      if (this.changingHash) {
        this.changingHash = false;
        return;
      }
      const $previousTab = this.getCurrentTab();
      if (!$previousTab) {
        return;
      }
      this.hideTab($previousTab);
      this.showTab($tabWithHash);
      $tabWithHash.focus();
    }
    hideTab($tab) {
      this.unhighlightTab($tab);
      this.hidePanel($tab);
    }
    showTab($tab) {
      this.highlightTab($tab);
      this.showPanel($tab);
    }
    getTab(hash) {
      return this.$root.querySelector(`a.govuk-tabs__tab[href="${hash}"]`);
    }
    setAttributes($tab) {
      const panelId = getFragmentFromUrl($tab.href);
      if (!panelId) {
        return;
      }
      $tab.setAttribute('id', `tab_${panelId}`);
      $tab.setAttribute('role', 'tab');
      $tab.setAttribute('aria-controls', panelId);
      $tab.setAttribute('aria-selected', 'false');
      $tab.setAttribute('tabindex', '-1');
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.setAttribute('role', 'tabpanel');
      $panel.setAttribute('aria-labelledby', $tab.id);
      $panel.classList.add(this.jsHiddenClass);
    }
    unsetAttributes($tab) {
      $tab.removeAttribute('id');
      $tab.removeAttribute('role');
      $tab.removeAttribute('aria-controls');
      $tab.removeAttribute('aria-selected');
      $tab.removeAttribute('tabindex');
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.removeAttribute('role');
      $panel.removeAttribute('aria-labelledby');
      $panel.classList.remove(this.jsHiddenClass);
    }
    onTabClick(event) {
      const $currentTab = this.getCurrentTab();
      const $nextTab = event.currentTarget;
      if (!$currentTab || !($nextTab instanceof HTMLAnchorElement)) {
        return;
      }
      event.preventDefault();
      this.hideTab($currentTab);
      this.showTab($nextTab);
      this.createHistoryEntry($nextTab);
    }
    createHistoryEntry($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      const panelId = $panel.id;
      $panel.id = '';
      this.changingHash = true;
      window.location.hash = panelId;
      $panel.id = panelId;
    }
    onTabKeydown(event) {
      switch (event.key) {
        case 'ArrowLeft':
        case 'Left':
          this.activatePreviousTab();
          event.preventDefault();
          break;
        case 'ArrowRight':
        case 'Right':
          this.activateNextTab();
          event.preventDefault();
          break;
      }
    }
    activateNextTab() {
      const $currentTab = this.getCurrentTab();
      if (!($currentTab != null && $currentTab.parentElement)) {
        return;
      }
      const $nextTabListItem = $currentTab.parentElement.nextElementSibling;
      if (!$nextTabListItem) {
        return;
      }
      const $nextTab = $nextTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$nextTab) {
        return;
      }
      this.hideTab($currentTab);
      this.showTab($nextTab);
      $nextTab.focus();
      this.createHistoryEntry($nextTab);
    }
    activatePreviousTab() {
      const $currentTab = this.getCurrentTab();
      if (!($currentTab != null && $currentTab.parentElement)) {
        return;
      }
      const $previousTabListItem = $currentTab.parentElement.previousElementSibling;
      if (!$previousTabListItem) {
        return;
      }
      const $previousTab = $previousTabListItem.querySelector('a.govuk-tabs__tab');
      if (!$previousTab) {
        return;
      }
      this.hideTab($currentTab);
      this.showTab($previousTab);
      $previousTab.focus();
      this.createHistoryEntry($previousTab);
    }
    getPanel($tab) {
      const panelId = getFragmentFromUrl($tab.href);
      if (!panelId) {
        return null;
      }
      return this.$root.querySelector(`#${panelId}`);
    }
    showPanel($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.classList.remove(this.jsHiddenClass);
    }
    hidePanel($tab) {
      const $panel = this.getPanel($tab);
      if (!$panel) {
        return;
      }
      $panel.classList.add(this.jsHiddenClass);
    }
    unhighlightTab($tab) {
      if (!$tab.parentElement) {
        return;
      }
      $tab.setAttribute('aria-selected', 'false');
      $tab.parentElement.classList.remove('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '-1');
    }
    highlightTab($tab) {
      if (!$tab.parentElement) {
        return;
      }
      $tab.setAttribute('aria-selected', 'true');
      $tab.parentElement.classList.add('govuk-tabs__list-item--selected');
      $tab.setAttribute('tabindex', '0');
    }
    getCurrentTab() {
      return this.$root.querySelector('.govuk-tabs__list-item--selected a.govuk-tabs__tab');
    }
  }
  Tabs.moduleName = 'govuk-tabs';

  /**
   * Initialise all components
   *
   * Use the `data-module` attributes to find, instantiate and init all of the
   * components provided as part of GOV.UK Frontend.
   *
   * @param {Config & { scope?: Element, onError?: OnErrorCallback<CompatibleClass> }} [config] - Config for all components (with optional scope)
   */
  function initAll(config) {
    var _config$scope;
    config = typeof config !== 'undefined' ? config : {};
    if (!isSupported()) {
      if (config.onError) {
        config.onError(new SupportError(), {
          config
        });
      } else {
        console.log(new SupportError());
      }
      return;
    }
    const components = [[Accordion, config.accordion], [Button, config.button], [CharacterCount, config.characterCount], [Checkboxes], [ErrorSummary, config.errorSummary], [ExitThisPage, config.exitThisPage], [FileUpload, config.fileUpload], [Header], [NotificationBanner, config.notificationBanner], [PasswordInput, config.passwordInput], [Radios], [ServiceNavigation], [SkipLink], [Tabs]];
    const options = {
      scope: (_config$scope = config.scope) != null ? _config$scope : document,
      onError: config.onError
    };
    components.forEach(([Component, config]) => {
      createAll(Component, config, options);
    });
  }

  /**
   * Create all instances of a specific component on the page
   *
   * Uses the `data-module` attribute to find all elements matching the specified
   * component on the page, creating instances of the component object for each
   * of them.
   *
   * Any component errors will be caught and logged to the console.
   *
   * @template {CompatibleClass} ComponentClass
   * @param {ComponentClass} Component - class of the component to create
   * @param {ComponentConfig<ComponentClass>} [config] - Config supplied to component
   * @param {OnErrorCallback<ComponentClass> | Element | Document | CreateAllOptions<ComponentClass> } [createAllOptions] - options for createAll including scope of the document to search within and callback function if error throw by component on init
   * @returns {Array<InstanceType<ComponentClass>>} - array of instantiated components
   */
  function createAll(Component, config, createAllOptions) {
    let $scope = document;
    let onError;
    if (typeof createAllOptions === 'object') {
      var _createAllOptions$sco;
      createAllOptions = createAllOptions;
      $scope = (_createAllOptions$sco = createAllOptions.scope) != null ? _createAllOptions$sco : $scope;
      onError = createAllOptions.onError;
    }
    if (typeof createAllOptions === 'function') {
      onError = createAllOptions;
    }
    if (createAllOptions instanceof HTMLElement) {
      $scope = createAllOptions;
    }
    const $elements = $scope.querySelectorAll(`[data-module="${Component.moduleName}"]`);
    if (!isSupported()) {
      if (onError) {
        onError(new SupportError(), {
          component: Component,
          config
        });
      } else {
        console.log(new SupportError());
      }
      return [];
    }
    return Array.from($elements).map($element => {
      try {
        return typeof config !== 'undefined' ? new Component($element, config) : new Component($element);
      } catch (error) {
        if (onError) {
          onError(error, {
            element: $element,
            component: Component,
            config
          });
        } else {
          console.log(error);
        }
        return null;
      }
    }).filter(Boolean);
  }
  /**
   * @typedef {{new (...args: any[]): any, moduleName: string}} CompatibleClass
   */
  /**
   * Config for all components via `initAll()`
   *
   * @typedef {object} Config
   * @property {AccordionConfig} [accordion] - Accordion config
   * @property {ButtonConfig} [button] - Button config
   * @property {CharacterCountConfig} [characterCount] - Character Count config
   * @property {ErrorSummaryConfig} [errorSummary] - Error Summary config
   * @property {ExitThisPageConfig} [exitThisPage] - Exit This Page config
   * @property {FileUploadConfig} [fileUpload] - File Upload config
   * @property {NotificationBannerConfig} [notificationBanner] - Notification Banner config
   * @property {PasswordInputConfig} [passwordInput] - Password input config
   */
  /**
   * Config for individual components
   *
   * @import { AccordionConfig } from './components/accordion/accordion.mjs'
   * @import { ButtonConfig } from './components/button/button.mjs'
   * @import { CharacterCountConfig } from './components/character-count/character-count.mjs'
   * @import { ErrorSummaryConfig } from './components/error-summary/error-summary.mjs'
   * @import { ExitThisPageConfig } from './components/exit-this-page/exit-this-page.mjs'
   * @import { NotificationBannerConfig } from './components/notification-banner/notification-banner.mjs'
   * @import { PasswordInputConfig } from './components/password-input/password-input.mjs'
   * @import { FileUploadConfig } from './components/file-upload/file-upload.mjs'
   */
  /**
   * Component config keys, e.g. `accordion` and `characterCount`
   *
   * @typedef {keyof Config} ConfigKey
   */
  /**
   * @template {CompatibleClass} ComponentClass
   * @typedef {ConstructorParameters<ComponentClass>[1]} ComponentConfig
   */
  /**
   * @template {CompatibleClass} ComponentClass
   * @typedef {object} ErrorContext
   * @property {Element} [element] - Element used for component module initialisation
   * @property {ComponentClass} [component] - Class of component
   * @property {ComponentConfig<ComponentClass>} config - Config supplied to component
   */
  /**
   * @template {CompatibleClass} ComponentClass
   * @callback OnErrorCallback
   * @param {unknown} error - Thrown error
   * @param {ErrorContext<ComponentClass>} context - Object containing the element, component class and configuration
   */
  /**
   * @template {CompatibleClass} ComponentClass
   * @typedef {object} CreateAllOptions
   * @property {Element | Document} [scope] - scope of the document to search within
   * @property {OnErrorCallback<ComponentClass>} [onError] - callback function if error throw by component on init
   */

  exports.Accordion = Accordion;
  exports.Button = Button;
  exports.CharacterCount = CharacterCount;
  exports.Checkboxes = Checkboxes;
  exports.Component = Component;
  exports.ConfigurableComponent = ConfigurableComponent;
  exports.ErrorSummary = ErrorSummary;
  exports.ExitThisPage = ExitThisPage;
  exports.FileUpload = FileUpload;
  exports.Header = Header;
  exports.NotificationBanner = NotificationBanner;
  exports.PasswordInput = PasswordInput;
  exports.Radios = Radios;
  exports.ServiceNavigation = ServiceNavigation;
  exports.SkipLink = SkipLink;
  exports.Tabs = Tabs;
  exports.createAll = createAll;
  exports.initAll = initAll;
  exports.isSupported = isSupported;
  exports.version = version;
});

/***/ }),

/***/ "./node_modules/js-cookie/src/js.cookie.js":
/*!*************************************************!*\
  !*** ./node_modules/js-cookie/src/js.cookie.js ***!
  \*************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;
(function (factory) {
  var registeredInModuleLoader;
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    registeredInModuleLoader = true;
  }
  if (true) {
    module.exports = factory();
    registeredInModuleLoader = true;
  }
  if (!registeredInModuleLoader) {
    var OldCookies = window.Cookies;
    var api = window.Cookies = factory();
    api.noConflict = function () {
      window.Cookies = OldCookies;
      return api;
    };
  }
})(function () {
  function extend() {
    var i = 0;
    var result = {};
    for (; i < arguments.length; i++) {
      var attributes = arguments[i];
      for (var key in attributes) {
        result[key] = attributes[key];
      }
    }
    return result;
  }
  function decode(s) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  }
  function init(converter) {
    function api() {}
    function set(key, value, attributes) {
      if (typeof document === 'undefined') {
        return;
      }
      attributes = extend({
        path: '/'
      }, api.defaults, attributes);
      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
      }

      // We're using "expires" because "max-age" is not supported by IE
      attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';
      try {
        var result = JSON.stringify(value);
        if (/^[\{\[]/.test(result)) {
          value = result;
        }
      } catch (e) {}
      value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
      key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
      var stringifiedAttributes = '';
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue;
        }
        stringifiedAttributes += '; ' + attributeName;
        if (attributes[attributeName] === true) {
          continue;
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
      }
      return document.cookie = key + '=' + value + stringifiedAttributes;
    }
    function get(key, json) {
      if (typeof document === 'undefined') {
        return;
      }
      var jar = {};
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : [];
      var i = 0;
      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=');
        var cookie = parts.slice(1).join('=');
        if (!json && cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1);
        }
        try {
          var name = decode(parts[0]);
          cookie = (converter.read || converter)(cookie, name) || decode(cookie);
          if (json) {
            try {
              cookie = JSON.parse(cookie);
            } catch (e) {}
          }
          jar[name] = cookie;
          if (key === name) {
            break;
          }
        } catch (e) {}
      }
      return key ? jar[key] : jar;
    }
    api.set = set;
    api.get = function (key) {
      return get(key, false /* read as raw */);
    };
    api.getJSON = function (key) {
      return get(key, true /* read as json */);
    };
    api.remove = function (key, attributes) {
      set(key, '', extend(attributes, {
        expires: -1
      }));
    };
    api.defaults = {};
    api.withConverter = init;
    return api;
  }
  return init(function () {});
});

/***/ }),

/***/ "./node_modules/time-convert/index.js":
/*!********************************************!*\
  !*** ./node_modules/time-convert/index.js ***!
  \********************************************/
/***/ ((module) => {

const {
  floor
} = Math;
class Unit {
  /**
   * Represents a time unit
   * @param {Number} magnitude - The number by which to multiply the unit to obtain its equivalent in the base unit (milliseconds).
   */
  constructor(magnitude) {
    this.magnitude = magnitude;
  }

  /**
   * Convert base units (milliseconds) to this unit.
   * @param {Number} n - Number of base units (miliseconds) to be converted.
   * @returns {[Number, Number]} - The floored number of units, and the remainder in base unit.
   */
  convert(n) {
    const mag = this.magnitude;
    return [floor(n / mag), n % mag];
  }

  /**
   * Returns a function that converts this unit to a number of other units.
   * @param {...Function} units - Any number of units, in order, to which to convert this unit.
   * @returns {Function}
   */
  to(...units) {
    const mag = this.magnitude;
    /**
     * @param {Number} n - Number of this unit to be converted.
     * @returns {Array} - Each element corresponds to a unit, in the same order they were passed to `convert`
     */
    return n => units.reduce((arr, unit) => [...arr.slice(0, -1), ...unit.convert(arr[arr.length - 1] * this.magnitude)], [n]).slice(0, -1);
    /* 
    ** The last element of the array always represents the base unit (miliseconds).
    ** For each unit, replace the last element of the result array by the number of units it contains,
    ** and carry the remainder, which is in milliseconds, as the last element.
    ** Finally, remove the last element (the last carried remainder).
    */
  }

  /**
   * Returns a function that converts a number of other units to this unit.
   * @param {...Function} units - Any number of units, in order.
   * @returns {Function}
   */
  from(...units) {
    /**
     * @param {...Number} - Number of units, in the same order they were passed to the `from` method.
     * @returns {Number} - A number of this unit.
     */
    return (...ns) => units.reduce((sum, unit, i) => sum + ns[i] * unit.magnitude, 0) / this.magnitude;
  }
}
const ms = milliseconds = new Unit(1);
const s = seconds = new Unit(1000);
const m = minutes = new Unit(1000 * 60);
const h = hours = new Unit(1000 * 60 * 60);
const d = days = new Unit(1000 * 60 * 60 * 24);
module.exports = {
  Unit,
  d,
  h,
  m,
  s,
  ms,
  days,
  hours,
  minutes,
  seconds,
  milliseconds
};

/***/ }),

/***/ "./src/modules/autocomplete/autocomplete.js":
/*!**************************************************!*\
  !*** ./src/modules/autocomplete/autocomplete.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createAutocomplete(window) {
  /**
   * Initialises the `Enhanced auto-complete` select element implementation.
   *
   * @param {(string|NodeList)} elements - A CSS selector for the elements, or a collection of the elements that are to be turned in to autocomplete select elements.
   *
   * @example
   *
   *     autocomplete.init('.govuk-select');
   *     autocomplete.init(window.document.querySelectorAll('.govuk-select'));
   */
  function init(elements) {
    let selectElements = elements;
    if (typeof selectElements === 'string') {
      selectElements = window.document.querySelectorAll(selectElements);
    }
    if (selectElements.length) {
      for (let i = 0; i < selectElements.length; i += 1) {
        selectElements[i].parentNode.classList.add('autocomplete__wrapper');

        // Select the hint element
        const hintElement = window.document.querySelector('.govuk-hint');

        // Define the default assistive hint
        let assistiveHint = 'When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.';

        // Append the innerText of hintElement to assistiveHint if hintElement exists
        if (hintElement && hintElement.innerText.trim() !== '') {
          assistiveHint = `${hintElement.innerText} ${assistiveHint}`;
        }
        window.accessibleAutocomplete.enhanceSelectElement({
          selectElement: selectElements[i],
          minLength: 2,
          defaultValue: '',
          placeholder: 'Start typing to find a police force',
          displayMenu: 'overlay',
          showAllValues: true,
          autoselect: true,
          confirmOnBlur: false,
          tAssistiveHint: () => assistiveHint
        });
      }
    }
  }
  return Object.freeze({
    init
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAutocomplete);

/***/ }),

/***/ "./src/modules/cookie-banner/index.js":
/*!********************************************!*\
  !*** ./src/modules/cookie-banner/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createCookieBanner(window, cookiePreference, options = {}) {
  const defaultOptions = {
    cookieBannerElement: '#cookie-banner',
    cookieBannerVisibleClass: 'cookie-banner--visible',
    cookieBannerButtonAcceptAll: '#cookie-banner-accept-all'
  };
  const combinedOptions = {
    ...defaultOptions,
    ...options
  };
  const cookieBannerElement = window.document.querySelector(combinedOptions.cookieBannerElement);
  function show() {
    if (!cookiePreference.getCookie()) {
      cookieBannerElement.classList.add(combinedOptions.cookieBannerVisibleClass);
    }
  }
  function hide() {
    cookieBannerElement.classList.remove(combinedOptions.cookieBannerVisibleClass);
  }
  const buttonAcceptAll = window.document.querySelector(combinedOptions.cookieBannerButtonAcceptAll);
  buttonAcceptAll.addEventListener('click', e => {
    cookiePreference.acceptAll();
    hide();
    e.preventDefault();
    return false;
  });
  const formCookiePreference = window.document.querySelector('#cookie-preferences');
  if (formCookiePreference) {
    const preferencesElements = formCookiePreference.querySelectorAll('[data-cookie-preference]');
    // check/select the radio button that corresponds to the current cookie settings.
    preferencesElements.forEach(element => {
      if (element.value === cookiePreference.get(element.getAttribute('data-cookie-preference')).value) {
        // eslint-disable-next-line no-param-reassign
        element.checked = true;
      }
    });
    formCookiePreference.addEventListener('submit', e => {
      const preferencesElementsSelected = formCookiePreference.querySelectorAll('[data-cookie-preference]:checked');
      // always needs to be set regardless.
      cookiePreference.set('essential', 1);
      preferencesElementsSelected.forEach(element => {
        cookiePreference.set(element.getAttribute('data-cookie-preference'), element.value);
      });
      hide();
      window.document.querySelector('#preferences-set-success').classList.remove('moj-banner--invisible');
      // eslint-disable-next-line no-param-reassign
      window.document.body.scrollTop = 0;
      // eslint-disable-next-line no-param-reassign
      window.document.documentElement.scrollTop = 0;
      e.preventDefault();
      return false;
    });
  }
  return Object.freeze({
    show,
    hide
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCookieBanner);

/***/ }),

/***/ "./src/modules/cookie-preference/index.js":
/*!************************************************!*\
  !*** ./src/modules/cookie-preference/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);

function createCookiePreference(cookieName, allowedPreferences) {
  const cookieConfig = {
    path: '/',
    expires: 365,
    sameSite: 'Lax'
  };
  function get(preferenceName) {
    const cookieValue = js_cookie__WEBPACK_IMPORTED_MODULE_0__.getJSON(cookieName) || {};
    return {
      name: preferenceName,
      value: cookieValue[preferenceName]
    };
  }
  function set(preferenceName, preferenceValue) {
    if (!allowedPreferences.includes(preferenceName)) {
      throw Error(`Unable to set preference "${preferenceName}" as it is not in the preference whitelist`);
    }
    const cookieValue = js_cookie__WEBPACK_IMPORTED_MODULE_0__.getJSON(cookieName) || {};
    cookieValue[preferenceName] = preferenceValue;
    js_cookie__WEBPACK_IMPORTED_MODULE_0__.set(cookieName, cookieValue, cookieConfig);
  }
  function getCookie() {
    return js_cookie__WEBPACK_IMPORTED_MODULE_0__.get(cookieName);
  }
  function acceptAll() {
    allowedPreferences.forEach(cookiePreference => {
      set(cookiePreference, '1');
    });
  }
  return Object.freeze({
    set,
    get,
    getCookie,
    acceptAll
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCookiePreference);

/***/ }),

/***/ "./src/modules/ga/index.js":
/*!*********************************!*\
  !*** ./src/modules/ga/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js");
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_cookie__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _vendor_gua_anchor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vendor/gua-anchor */ "./src/modules/ga/vendor/gua-anchor.js");


function createCicaGa(window) {
  // eslint-disable-next-line no-undef
  (0,_vendor_gua_anchor__WEBPACK_IMPORTED_MODULE_1__["default"])(window.CICA.SERVICE_URL, window);
  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  // gtag('event', <action>, {
  //     'event_category': <category>,
  //     'event_label': <label>,
  //     'value': <value>
  // });
  const defaultOptions = {
    type: 'event',
    // <String>
    action: 'click',
    // <String>
    category: 'category',
    // <String>
    label: undefined,
    // <String>
    value: undefined,
    // non-negative <Integer>
    transaction_id: undefined
  };
  const cookieConfig = {
    // no `expires` property means the cookie will die alongside the session.
    path: '/apply/',
    // only set it during the application
    sameSite: 'Lax'
  };
  function send(options) {
    const gtagOptions = {
      ...defaultOptions,
      ...options
    };
    window.gtag(gtagOptions.type, gtagOptions.action, {
      event_category: gtagOptions.category,
      event_label: gtagOptions.label,
      value: gtagOptions.value,
      event_callback: gtagOptions.callback,
      non_interaction: gtagOptions.nonInteraction,
      transaction_id: gtagOptions.transaction_id
    });
  }

  /* * ******************************************* * */
  /* * * TRACKING HANDLERS START                 * * */
  /* * ******************************************* * */

  function detailsElement(element) {
    // the open attribute is added when the user reveals
    // the content of the details element.
    // click it from closed to open will result in
    // the open variable having a value of `null`.
    // checking for `null` will tell us that the element
    // is being opened (and not closed). We can then send
    // a GA event for the user opening the details element.
    const open = element.getAttribute('open');
    if (open === null) {
      const detailsTextElement = element.querySelector('.govuk-details__summary-text');
      const detailsTagText = detailsTextElement.innerText || detailsTextElement.innerHTML.trim();
      send({
        action: 'open',
        category: 'details-tag',
        label: detailsTagText
      });
    }
  }
  function click(element, options) {
    element.addEventListener('click', () => {
      send({
        action: 'click',
        category: options.category,
        label: options.label
      });
    }, false);
  }
  function paste(element, event) {
    let pasteContent = '';
    if (event.clipboardData || window.clipboardData) {
      pasteContent = (event.clipboardData || window.clipboardData).getData('text');
    }
    send({
      action: 'paste',
      category: element.id,
      label: pasteContent.length,
      nonInteraction: true
    });
  }
  function charCount() {
    const elements = window.document.querySelectorAll('.govuk-input, .govuk-textarea');
    elements.forEach(element => {
      send({
        action: 'charCount',
        category: element.id,
        label: element.value.length || 0,
        nonInteraction: true
      });
    });
  }
  function validationError() {
    if (window.document.title.startsWith('Error')) {
      const errorElements = window.document.querySelectorAll('.govuk-error-summary__list li a');
      errorElements.forEach(element => {
        send({
          action: 'validationError',
          category: element.href.split('#')[1],
          label: element.innerText || element.innerHTML.trim(),
          nonInteraction: true
        });
      });
    }
  }

  // ******************************************
  // *        GA4 APP TRACKING                *
  // ******************************************

  function trackApplication() {
    const isFirstPage = new URLSearchParams(window.location.search).get('utm_source');
    if (isFirstPage) {
      const gtagOptions = {
        type: 'event',
        action: 'conversion',
        category: 'application_journey_tracker',
        label: 'start',
        nonInteraction: true,
        transaction_id: window.CICA.CICA_ANALYTICS_ID
      };
      send(gtagOptions);
    } else if (window.location.pathname.includes('sign-in/success')) {
      const gtagOptions = {
        type: 'event',
        action: 'conversion',
        category: 'application_journey_tracker',
        label: 'save',
        nonInteraction: true,
        transaction_id: window.CICA.CICA_ANALYTICS_ID
      };
      send(gtagOptions);
    } else if (window.location.pathname.includes('declaration')) {
      window.addEventListener('submit', () => {
        const gtagOptions = {
          type: 'event',
          action: 'conversion',
          category: 'application_journey_tracker',
          label: 'complete',
          nonInteraction: true,
          transaction_id: window.CICA.CICA_ANALYTICS_ID
        };
        send(gtagOptions);
      }, false);
    }
  }
  function recordJourneyDuration() {
    const cookieValue = js_cookie__WEBPACK_IMPORTED_MODULE_0__.getJSON('client') || {};
    if (!cookieValue.journeyStartTime) {
      cookieValue.journeyStartTime = new Date().getTime();
      js_cookie__WEBPACK_IMPORTED_MODULE_0__.set('client', cookieValue, cookieConfig);
      return;
    }
    if (window.location.pathname === '/apply/confirmation') {
      const now = new Date().getTime();
      const {
        journeyStartTime
      } = cookieValue;
      const differenceInSeconds = Math.floor((now - journeyStartTime) / 1000);
      send({
        category: 'application',
        action: 'duration',
        label: differenceInSeconds,
        nonInteraction: true
      });
      // reset value.
      cookieValue.journeyStartTime = undefined;
      js_cookie__WEBPACK_IMPORTED_MODULE_0__.set('client', cookieValue, cookieConfig);
    }
  }

  /* * ******************************************* * */
  /* * * TRACKING HANDLERS END                   * * */
  /* * ******************************************* * */

  function init() {
    const trackableElements = window.document.querySelectorAll('[data-module], .ga-event, .govuk-input, .govuk-textarea');
    // GOVUK modules, and custom events tracking.
    trackableElements.forEach(element => {
      if (element.classList.contains('ga-event--click')) {
        click(element, {
          label: element.getAttribute('data-tracking-label') || element.pathname || element.innerText && element.innerText.trim() || element.innerHTML && element.innerHTML.trim(),
          category: element.getAttribute('data-tracking-category') || element.tagName
        });
        return;
      }
      if (element.classList.contains('govuk-textarea') || element.classList.contains('govuk-input')) {
        element.addEventListener('paste', e => {
          paste(element, e);
        }, false);
        return;
      }
      const dataModuleId = element.getAttribute('data-module');
      if (dataModuleId === 'govuk-details') {
        element.addEventListener('click', () => {
          detailsElement(element);
        }, false);
      }
    });
    window.addEventListener('beforeunload', () => {
      charCount();
    }, false);
    validationError();
    recordJourneyDuration();
    trackApplication();
  }
  return Object.freeze({
    init
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCicaGa);

/***/ }),

/***/ "./src/modules/ga/vendor/gua-anchor.js":
/*!*********************************************!*\
  !*** ./src/modules/ga/vendor/gua-anchor.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* eslint-disable func-names */
/* eslint-disable no-loop-func */
/* eslint-disable object-shorthand */
/* eslint-disable prefer-destructuring, no-var  */

/**
 * Logs an event with Google Universal Analytics
 * when an external, download, or non http(s), link is clicked.
 *
 * Supports IE6+, Firefox, Chrome, Safari, Opera, and any other standards based browser.
 *
 * Does not track links that the user opens with the right-click context menu e.g. "Open Link in New Tab".
 *
 * If present, does not currently replicate target="_blank" when opening links.
 *
 * @method guaTrackLinks
 * @requires gtag.js
 * @param domain {String} current domain, can be as specific as required e.g.
 *
 * Given the current domain is "http://www.yoursite.co.uk"
 *
 * setting domain to "yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = Internal
 * https://www.yoursite.co.uk/index.html = Internal
 * http://yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * setting domain to "subdomain.yoursite.co.uk" would work as follows:
 * http://www.yoursite.co.uk = External
 * https://www.yoursite.co.uk/index.html = External
 * http://yoursite.co.uk = External
 * https://subdomain.yoursite.co.uk = Internal
 * https://subdomain.yoursite.co.uk/index.html = Internal
 *
 * @param window {Object} window object
 */
// eslint-disable-next-line no-unused-vars
function guaTrackLinks(domain, window) {
  var document = window.document;
  var body = document.body;
  var anchor = document.createElement('a');
  var isQualifiedURL;
  var rDownloads = /.+\.(?:zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|mp4|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;

  // set the test anchor's href to a relative url "a".
  anchor.href = 'a';

  // if the href is still "a" when accessed then the browser doesn't return fully qualified URLs (probably IE <= 7).
  // e.g. should be "http://www.some-domain.co.uk/a" not "a".
  isQualifiedURL = anchor.href !== 'a';
  function handler(ev) {
    var node = ev.target || ev.srcElement;
    var href;
    var hrefNoQuerystring;
    var scheme;
    var target;

    // click may have originated from an element within an anchor e.g.
    // <a href="index.html"><img src="logo.jpg" alt="Home" /></a>
    // walk up dom and check if target has a parent anchor
    while (node !== body) {
      if (node.nodeName.toLowerCase() === 'a' && node.href) {
        // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
        // https://msdn.microsoft.com/en-us/ie/ms536429(v=vs.94)
        // on dynamically created links with a relative path, IE 7 does not return a fully qualified URL for the href attribute
        // passing the 4 flag will get this
        href = isQualifiedURL ? node.href : node.getAttribute('href', 4);
        hrefNoQuerystring = href.split('?')[0];

        // get scheme from url e.g. http:, https:, mailto:, tel:, etc
        // http://en.wikipedia.org/wiki/URI_scheme
        scheme = href.slice(0, href.indexOf(':') + 1);
        target = node.target;

        // handle schemes
        if (scheme.indexOf('http') === 0) {
          if (hrefNoQuerystring.indexOf(domain) === -1) {
            scheme = 'external-link';
          } else if (rDownloads.test(hrefNoQuerystring)) {
            scheme = 'download-link';
          } else {
            // internal link and not a download, ignore it
            break;
          }
        }
        // will be called for relevant http(s) links and catch all for other schemes (mailto:, tel:, etc)
        window.gtag('event', 'click', {
          event_category: scheme,
          event_label: href,
          event_callback: function () {
            if (target === '_blank') {
              window.open(href, href).focus();
              return;
            }
            // eslint-disable-next-line no-param-reassign
            window.location.href = href;
          }
        });

        // stop default link click and let the GA hitCallback redirect to the link
        // eslint-disable-next-line no-unused-expressions, no-param-reassign
        ev.preventDefault ? ev.preventDefault() : ev.returnValue = 0;
        break;
      } else {
        node = node.parentNode;
      }
    }
  }

  // attach listener to body and delegate clicks
  // eslint-disable-next-line no-unused-expressions
  body.addEventListener ? body.addEventListener('click', handler) : body.attachEvent('onclick', handler);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (guaTrackLinks);

/***/ }),

/***/ "./src/modules/govuk-one-login-service-header/index.js":
/*!*************************************************************!*\
  !*** ./src/modules/govuk-one-login-service-header/index.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_govuk_one_login_service_header_service_header__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/govuk/one-login-service-header/service-header */ "./components/govuk/one-login-service-header/service-header.js");

function createCrossServiceHeader(window) {
  const oneLoginHeader = window.document.querySelector('[data-module="one-login-header"]');
  if (oneLoginHeader) {
    new _components_govuk_one_login_service_header_service_header__WEBPACK_IMPORTED_MODULE_0__["default"](oneLoginHeader).init();
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createCrossServiceHeader);

/***/ }),

/***/ "./src/modules/modal-timeout/index.js":
/*!********************************************!*\
  !*** ./src/modules/modal-timeout/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _components_cica_modal_modal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/cica/modal/modal */ "./components/cica/modal/modal.js");
/* harmony import */ var _utils_AccurateInterval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/AccurateInterval */ "./src/modules/modal-timeout/utils/AccurateInterval/index.js");



// document all available options that can be passed in.
/**
 * Factory that returns a TimeoutModal constructor.
 * @param {Object} window  Global window object
 */
function createTimeoutModal(window) {
  // available options:
  // element {String} - CSS selector of the modal element.
  // init {Function} - Callback function that will be executed on instantiation.
  // closeElement {String} - CSS selector of the element that, when clicked, will closes the modal.
  // openIn {Integer} - How long (in milliseconds) until the modal will be opened.
  // closeIn {Integer} - How long (in milliseconds) until the modal will be closed.
  // onOpen {Function} - Callback function that will be executed when the modal is opened.
  // onBeforeOpen {Function} - Callback function that will be executed just before the modal is opened. If
  //                            the return value of this callback is `false`, the modal will not open. If the
  //                            modal is already opened this function will not be executed.
  // onClose {Function} - Callback function that will be executed when the modal is closed.
  // content {Object} - Object containing `content.title`{String}, and `content.body`{String}.
  // triggerElement {String} - CSS selector of the element that, when clicked, will closes the modal.
  // timer {Object} - Configuration for the in-build countdown timer.
  function TimeoutModal(options) {
    const element = window.document.querySelector(options.element);
    const closeElement = element.querySelector(options.closeElement); // closeElement must be a child element of `element`.
    const triggerElement = window.document.querySelector(options.triggerElement); // closeElement must be a child element of `element`.
    let openInTimeout;
    let closeInTimeout;
    const config = {
      element,
      closeElement,
      init: options.init,
      openIn: options.openIn,
      closeIn: options.closeIn,
      onOpen: options.onOpen,
      onBeforeOpen: options.onBeforeOpen,
      onClose: options.onClose,
      content: options.content,
      triggerElement,
      timer: options.timer
    };
    const modal = new _components_cica_modal_modal__WEBPACK_IMPORTED_MODULE_0__["default"](element).init({
      triggerElement,
      closeElement,
      onOpen: config.onOpen,
      onBeforeOpen: config.onBeforeOpen,
      onClose: config.onClose,
      content: config.content
    });
    if (typeof config.init === 'function') {
      config.init();
    }
    function setUp(setUpOptions = {}) {
      if (modal.timer) {
        modal.timer.stop();
        modal.timer = null;
      }
      if (config.timer) {
        const {
          duration,
          interval,
          onTick,
          onEnd,
          startTime
        } = config.timer;
        const timerDuration = setUpOptions.duration || duration;
        const timerStartTime = setUpOptions.startTime || startTime;
        const timer = new _utils_AccurateInterval__WEBPACK_IMPORTED_MODULE_1__["default"]({
          onTick,
          onEnd,
          interval,
          duration: timerDuration,
          startTime: timerStartTime
        });
        timer.start();
        modal.timer = timer;
      }
      if (config.openIn && !Number.isNaN(config.openIn)) {
        window.clearTimeout(openInTimeout);
        openInTimeout = window.setTimeout(modal.open, config.openIn);
      }
      if (config.closeIn && !Number.isNaN(config.closeIn)) {
        window.clearTimeout(closeInTimeout);
        closeInTimeout = window.setTimeout(modal.close, config.closeIn);
      }
    }
    modal.config = config;
    modal.refresh = setUp;
    modal.refresh();
    return modal;
  }
  return TimeoutModal;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createTimeoutModal);

/***/ }),

/***/ "./src/modules/modal-timeout/utils/AccurateInterval/index.js":
/*!*******************************************************************!*\
  !*** ./src/modules/modal-timeout/utils/AccurateInterval/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function AccurateInterval({
  onTick,
  onEnd,
  interval,
  duration,
  startTime,
  err
}) {
  const self = this;
  let expected;
  let timeout;
  let stopTimer = false;
  this.startTime = startTime;
  this.interval = parseInt(interval, 10);
  this.duration = parseInt(duration, 10);
  this.endTime = this.startTime + this.duration;
  this.tickCount = 0;
  this.step = () => {
    if (stopTimer === true) {
      return;
    }
    const drift = Date.now() - expected;
    if (drift > self.interval) {
      if (err) {
        err(drift);
      }
    }
    const now = Date.now();
    const timeRemaining = this.endTime - now;
    if (onTick) {
      onTick(Math.max(timeRemaining, 0));
    }
    this.tickCount += 1;
    this.timeRemaining = timeRemaining;
    if (now > this.endTime) {
      this.stop();
      if (onEnd) {
        onEnd();
      }
      return;
    }
    expected += this.interval;
    timeout = window.setTimeout(this.step, Math.max(0, this.interval - drift));
  };
  this.start = () => {
    if (!this.startTime) {
      this.startTime = Date.now();
    }
    this.endTime = this.startTime + this.duration;
    expected = this.startTime + this.interval;
    timeout = window.setTimeout(this.step, this.interval);
  };
  this.stop = () => {
    stopTimer = true;
    window.clearTimeout(timeout);
  };
  this.restart = () => {
    this.startTime = Date.now();
    this.endTime = this.startTime + this.duration;
    expected = this.startTime + this.interval;
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AccurateInterval);

/***/ }),

/***/ "./src/modules/modal-timeout/utils/msToMinutesAndSeconds/index.js":
/*!************************************************************************!*\
  !*** ./src/modules/modal-timeout/utils/msToMinutesAndSeconds/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var time_convert__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! time-convert */ "./node_modules/time-convert/index.js");
/* harmony import */ var time_convert__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(time_convert__WEBPACK_IMPORTED_MODULE_0__);
// eslint-disable-next-line import/no-extraneous-dependencies

function msToMinutesAndSeconds(duration) {
  const result = time_convert__WEBPACK_IMPORTED_MODULE_0__.ms.to(time_convert__WEBPACK_IMPORTED_MODULE_0__.m, time_convert__WEBPACK_IMPORTED_MODULE_0__.s)(duration);
  const minutes = result[0];
  const seconds = result[1];
  let minutesText = '';
  let secondsText = '';
  let conjunctionText = '';
  if (minutes > 0) {
    minutesText = minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
  }
  if (seconds > 0) {
    secondsText = seconds === 1 ? `${seconds} second` : `${seconds} seconds`;
  }
  if (minutes > 0 && seconds > 0) {
    conjunctionText = ' and ';
  }
  return `${minutesText}${conjunctionText}${secondsText}` || `0 seconds`;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (msToMinutesAndSeconds);

/***/ }),

/***/ "./src/modules/new-window-anchors/index.js":
/*!*************************************************!*\
  !*** ./src/modules/new-window-anchors/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createNewWindowAnchors(elements) {
  if (elements && elements.length) {
    const defaultOptions = {
      directories: 'no',
      titlebar: 'no',
      toolbar: 'no',
      location: 'no',
      status: 'no',
      menubar: 'no',
      scrollbars: 'no',
      resizable: 'no',
      width: '500',
      height: '500'
    };
    elements.forEach(anchor => {
      let options;
      try {
        options = JSON.parse(anchor.getAttribute('open-new-window'));
      } catch (e) {
        options = {};
      }
      const combinedOptions = Object.entries({
        ...defaultOptions,
        ...options
      }).map(x => `${x[0]}=${x[1]}`).join(', ');
      anchor.addEventListener('click', e => {
        window.open(anchor.href, 'popupWindow', combinedOptions);
        e.preventDefault();
      }, false);
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createNewWindowAnchors);

/***/ }),

/***/ "./src/modules/postcode-lookup/index.js":
/*!**********************************************!*\
  !*** ./src/modules/postcode-lookup/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Returns a postocde lookup module.
 * @param {Object} window  Global window object
 */
function createPostcodeLookup(window) {
  // Define an empty JSON object to temporarily store matched address results.
  // eslint-disable-next-line no-unused-vars
  let tmpAddressSearchResultsJson = {};
  let apiNoAddressesFoundErrorMessage;
  let apiResponseNotOkErrorMessage;
  const INVALID_POSTCODE_ERROR = 'Enter a valid postcode';
  let emptySearchInputErrorMessage;
  let searchResultsDiv;
  let selectElementResults;
  let addressSearchResultsOptions;
  let addressSearchInput;

  // Matches a single letter (e.g 'A'), number range (e.g. 110-114), delimiter (e.g. 1/2)
  // Does not match 'Flat A'
  const flatIdentifierRegex = /((^\d\S+([a-zA-Z]|\d)$|^[a-zA-Z]$))/;
  function isSelectedValueInteger(str) {
    const num = Number(str);
    if (Number.isInteger(num)) {
      return true;
    }
    return false;
  }
  function clearAddressForm() {
    const elements = window.document.querySelectorAll("form input[type='text']");
    elements.forEach(el => {
      const addressInput = el;
      addressInput.value = '';
    });
  }
  function mapSelectionToAddressFormInputs() {
    const selectedValue = this.options[this.selectedIndex].value;
    if (!isSelectedValueInteger(selectedValue)) {
      return;
    }
    const dataset = 'DPA';
    const result = tmpAddressSearchResultsJson[selectedValue][dataset];
    clearAddressForm();

    // The following is based on the rules for generating multi-line addresses which are
    // documented in Chapter 9 of the AddressBase Premium Getting Started Guide:
    // https://www.ordnancesurvey.co.uk/documents/product-support/getting-started/addressbase-premium-getting-started-guide.pdf

    // Define constants for DPA address components (blank if NULL).
    let dpaOrganisationName = result.ORGANISATION_NAME || '';
    const dpaSubBuildingName = result.SUB_BUILDING_NAME || '';
    let dpaBuildingName = result.BUILDING_NAME || '';
    const dpaBuildingNumber = result.BUILDING_NUMBER || '';
    let dpaPOBoxNumber = result.PO_BOX_NUMBER || '';
    const dpaDependentThoroughfareName = result.DEPENDENT_THOROUGHFARE_NAME || '';
    const dpaThoroughfareName = result.THOROUGHFARE_NAME || '';
    const dpaDependentLocality = result.DEPENDENT_LOCALITY || '';
    const dpaPostTown = result.POST_TOWN;
    const dpaPostcode = result.POSTCODE;

    // Add a "PO BOX " prefix to the PO Box Number integer.
    if (dpaPOBoxNumber !== '') {
      dpaPOBoxNumber = `PO BOX ${dpaPOBoxNumber}`;
    }

    // Remove empty values from the array
    const thoroughfareLocality = [dpaDependentThoroughfareName, dpaThoroughfareName, dpaDependentLocality].filter(item => item);
    const premises = [];
    if (dpaSubBuildingName !== '' && dpaBuildingName !== '' && flatIdentifierRegex.test(dpaSubBuildingName)) {
      dpaBuildingName = `${dpaSubBuildingName} ${dpaBuildingName}`;
    } else {
      premises.push(dpaSubBuildingName);
    }
    let premisesThoroughfareLocality = '';
    if (flatIdentifierRegex.test(dpaBuildingName)) {
      // add to thouroughfare
      premisesThoroughfareLocality = `${dpaBuildingName} ${thoroughfareLocality[0]}`;
      thoroughfareLocality.shift();
    } else {
      premises.push(dpaBuildingName);
    }
    if (dpaBuildingNumber !== '') {
      premisesThoroughfareLocality = `${dpaBuildingNumber} ${thoroughfareLocality[0]}`;
      thoroughfareLocality.shift();
    }
    let addressLines = [];

    // Does the page contain an organisation name?
    const organisationName = window.document.querySelector('input[id *= "organisation-name"]');
    if (organisationName) {
      organisationName.value = dpaOrganisationName;
      dpaOrganisationName = '';
    }

    // Push the Organisation Name and PO Box Number to the address array.
    addressLines.push(dpaPOBoxNumber, dpaOrganisationName);

    // Merge the structured premises and thoroughfare components into the address array.
    addressLines = addressLines.concat(premises);
    addressLines = addressLines.concat(premisesThoroughfareLocality);
    addressLines = addressLines.concat(thoroughfareLocality);

    // Remove any duplicates and blanks from the address array.
    addressLines = [...new Set(addressLines)];
    addressLines = addressLines.filter(item => item);
    const [selectionLine1, selectionLine2, selectionLine3] = addressLines;
    const addressLine1 = window.document.querySelector('input[id *= "street"]');
    addressLine1.value = selectionLine1;
    const addressLine2 = window.document.querySelector('input[id *= "street-2"]');
    addressLine2.value = selectionLine2 || '';
    const addressLine3 = window.document.querySelector('input[id *= "street-3"]');
    addressLine3.value = selectionLine3 || '';
    const addressTown = window.document.querySelector('input[id *= "town-or-city"]');
    addressTown.value = dpaPostTown;
    const addressPostcode = window.document.querySelector('input[id *= "postcode"]');
    addressPostcode.value = dpaPostcode;
  }
  function clearAddressResultsDropdown() {
    addressSearchResultsOptions = window.document.querySelectorAll('#address-search-results-dropdown option');
    addressSearchResultsOptions.forEach(option => option.remove());
  }
  function addSearchResultsToSelectElement(data) {
    clearAddressResultsDropdown();

    // Update the JSON object with the data results.
    tmpAddressSearchResultsJson = data.results;
    const option = window.document.createElement('option');
    option.text = data.header.totalresults === 1 ? '1 address found' : `${data.header.totalresults} addresses found`;
    selectElementResults.add(option);

    // See also {@link https://apidocs.os.uk/reference/os-places-dpa-output}
    const dataset = 'DPA';
    // Loop through the data results; adding the address string as a new option
    // to the results drop-down list.
    data.results.forEach(function addElements(val, i) {
      const opt = window.document.createElement('option');
      opt.value = i;
      opt.text = val[dataset].ADDRESS;
      selectElementResults.add(opt);
    });

    // Display the hidden search results div
    searchResultsDiv.style.display = 'block';
    selectElementResults.focus();
  }
  let addressSearchDiv;
  function displayFieldErrors(message) {
    const errorInnerSpan = window.document.createElement('span');
    errorInnerSpan.setAttribute('class', 'govuk-visually-hidden');
    const errorInnerSpanText = window.document.createTextNode('Error:');
    errorInnerSpan.appendChild(errorInnerSpanText);
    const errorOuterSpan = window.document.createElement('span');
    errorOuterSpan.setAttribute('id', 'address-search-input-error');
    errorOuterSpan.setAttribute('class', 'govuk-error-message');
    const errorOuterSpanText = window.document.createTextNode(message);
    errorOuterSpan.appendChild(errorOuterSpanText);
    errorOuterSpan.appendChild(errorInnerSpan);

    // const addressSearchInput = window.document.getElementById('address-search-input');
    addressSearchInput.setAttribute('class', 'govuk-input govuk-input--error govuk-input--width-10');
    addressSearchInput.setAttribute('aria-describedby', 'address-search-input-error');
    addressSearchInput.insertAdjacentElement('beforebegin', errorOuterSpan);
    addressSearchDiv.setAttribute('class', 'govuk-form-group govuk-form-group--error');
    addressSearchDiv.className = 'govuk-form-group govuk-form-group--error';
  }
  function handleErrorSummaryListElement(message) {
    if (message === apiResponseNotOkErrorMessage || message === apiNoAddressesFoundErrorMessage) {
      return window.document.createTextNode(message);
    }
    const errorAnchor = window.document.createElement('a');
    const link = window.document.createTextNode(message);
    errorAnchor.appendChild(link);
    errorAnchor.href = '#address-search-input';
    /* eslint-disable func-names */
    errorAnchor.onclick = function () {
      const assocLabel = window.document.querySelector(`label[for='${addressSearchInput.id}']`);
      assocLabel.scrollIntoView();
      addressSearchInput.focus({
        preventScroll: true
      });
      return false;
    };
    return errorAnchor;
  }
  function displayErrorSummary(message) {
    const error = window.document.createElement('li');
    error.appendChild(handleErrorSummaryListElement(message));
    const errorList = window.document.createElement('ul');
    errorList.setAttribute('class', 'govuk-list govuk-error-summary__list');
    errorList.appendChild(error);
    const errorSummaryBody = window.document.createElement('div');
    errorSummaryBody.setAttribute('class', 'govuk-error-summary__body');
    errorSummaryBody.appendChild(errorList);
    const errorHeading = window.document.createElement('h2');
    errorHeading.setAttribute('class', 'govuk-error-summary__title');
    errorHeading.setAttribute('id', 'error-summary-title');
    const errorHeadingText = window.document.createTextNode('There is a problem');
    errorHeading.appendChild(errorHeadingText);
    const errorSummary = window.document.createElement('div');
    errorSummary.setAttribute('class', 'govuk-error-summary');
    errorSummary.setAttribute('aria-labelledby', 'error-summary-title');
    errorSummary.setAttribute('role', 'alert');
    errorSummary.setAttribute('tabindex', '-1');
    errorSummary.setAttribute('data-module', 'govuk-error-summary');
    errorSummary.appendChild(errorHeading);
    errorSummary.appendChild(errorSummaryBody);
    const form = window.document.querySelector('form');
    form.insertAdjacentElement('afterbegin', errorSummary);
    errorSummary.focus();
  }
  function removeErrorMessages() {
    const pageTitle = window.document.title.replace('Error: ', '');
    // eslint-disable-next-line no-param-reassign
    window.document.title = pageTitle;
    const errorSummary = window.document.querySelector('.govuk-error-summary');
    if (errorSummary) {
      errorSummary.remove();
    } else {
      return;
    }
    const errorSpans = window.document.querySelectorAll('.govuk-error-message');
    errorSpans.forEach(errorSpan => {
      errorSpan.remove();
    });
    const errorInputs = window.document.querySelectorAll('.govuk-input--error');
    errorInputs.forEach(errorInput => {
      const inputClass = errorInput.getAttribute('class');
      errorInput.setAttribute('class', inputClass.replace('govuk-input--error', ''));
      errorInput.removeAttribute('aria-describedby');
    });
    const errorDivs = window.document.querySelectorAll('.govuk-form-group--error');
    errorDivs.forEach(errorDiv => {
      errorDiv.setAttribute('class', 'govuk-form-group');
    });
  }
  function removeAddressSearchElements() {
    addressSearchDiv.remove();
    const hintTextDiv = window.document.getElementById('fill-out-the-fields-manually-hint');
    hintTextDiv.remove();
    const addressSearchButton = window.document.getElementById('search-button');
    addressSearchButton.remove();
    const addressSearchResults = window.document.getElementById('address-search-results');
    addressSearchResults.remove();
  }
  function sendAnalyticsEvent(message) {
    const action = message === apiResponseNotOkErrorMessage ? 'systemError' : 'validationError';
    const gtagOptions = {
      type: 'event',
      action,
      category: 'address-search-input',
      label: message,
      nonInteraction: true
    };
    window.gtag(gtagOptions.type, gtagOptions.action, {
      event_category: gtagOptions.category,
      event_label: gtagOptions.label,
      value: gtagOptions.value,
      event_callback: gtagOptions.callback,
      // ?
      non_interaction: gtagOptions.nonInteraction
    });
  }
  function displayErrors(message) {
    displayErrorSummary(message);
    if (message !== apiNoAddressesFoundErrorMessage) {
      displayFieldErrors(message);
    }
    searchResultsDiv.style.display = 'none';
    clearAddressResultsDropdown();
    const pageErrorTitle = `Error: ${window.document.title}`;
    // eslint-disable-next-line no-param-reassign
    window.document.title = pageErrorTitle;
    sendAnalyticsEvent(message);
  }

  // A simple postcode regular expression, or postcode regex, checks the general shape of the postcode is correct. i.e.
  // Is the string between 5 to 7 characters?
  // Is the inward code first character numeric?
  // Are the last 2 characters non-numeric?
  // removes all whitespace, before, after, within as the OS-places api will handle that
  function isValidPostcode(postcode) {
    const regex = /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i;
    return regex.test(postcode.replace(/\s/g, ''));
  }
  async function addressSearch() {
    removeErrorMessages();
    clearAddressForm();
    const addressSearchInputValue = addressSearchInput.value;
    if (addressSearchInputValue === '') {
      displayErrors(emptySearchInputErrorMessage);
      return;
    }

    // test for a valid postcode
    if (!isValidPostcode(addressSearchInputValue)) {
      displayErrors(INVALID_POSTCODE_ERROR);
      return;
    }
    const response = await fetch(`/address-finder/postcode?postcode=${addressSearchInputValue}`);
    if (!response.ok) {
      if (response.status === 400) {
        displayErrors(INVALID_POSTCODE_ERROR);
        return;
      }
      displayErrors(apiResponseNotOkErrorMessage);
      removeAddressSearchElements();
      return;
    }
    const data = await response.json();
    if (data.header.totalresults === 0 || !data.results) {
      displayErrors(apiNoAddressesFoundErrorMessage);
      return;
    }
    addSearchResultsToSelectElement(data);
  }
  function createContentElements() {
    const descriptionDiv = window.document.createElement('div');
    descriptionDiv.appendChild(window.document.createTextNode('Enter a UK postcode to search for and select an address. If you cannot find the correct address, or the address is not in the UK, you should enter it manually.'));
    descriptionDiv.setAttribute('id', 'fill-out-the-fields-manually-hint');
    descriptionDiv.setAttribute('class', 'govuk-hint');
    window.document.querySelector('.govuk-form-group').insertAdjacentElement('beforeBegin', descriptionDiv);
  }
  function createPostcodeSearchElements() {
    const addressSearchLabelContent = window.document.createTextNode('Search for a UK address using a postcode (optional)');
    const addressSearchLabel = window.document.createElement('label');
    addressSearchLabel.appendChild(addressSearchLabelContent);
    addressSearchLabel.setAttribute('class', 'govuk-label');
    addressSearchLabel.setAttribute('for', 'address-search-input');
    addressSearchInput = window.document.createElement('input');
    addressSearchInput.setAttribute('class', 'govuk-input govuk-input--width-10');
    addressSearchInput.setAttribute('id', 'address-search-input');
    addressSearchInput.setAttribute('name', 'address-search-input');
    addressSearchInput.setAttribute('type', 'search');
    addressSearchInput.setAttribute('autocomplete', 'postal-code');
    addressSearchInput.setAttribute('aria-describedby', 'fill-out-the-fields-manually-hint');
    addressSearchInput.addEventListener('keypress', event => {
      if (event.code === 'Enter') {
        event.preventDefault();
        window.document.getElementById('search-button').click();
      }
    });
    addressSearchDiv = window.document.createElement('div');
    addressSearchDiv.setAttribute('id', 'address-search');
    addressSearchDiv.setAttribute('class', 'govuk-form-group');
    addressSearchDiv.appendChild(addressSearchLabel);
    addressSearchDiv.appendChild(addressSearchInput);
    window.document.getElementById('fill-out-the-fields-manually-hint').insertAdjacentElement('afterend', addressSearchDiv);
  }
  function createFindAddressButton() {
    const searchButton = window.document.createElement('button');
    searchButton.setAttribute('id', 'search-button');
    searchButton.setAttribute('class', 'govuk-button govuk-button--secondary ga-event ga-event--click');
    searchButton.setAttribute('data-module', 'govuk-button');
    searchButton.setAttribute('type', 'button');
    searchButton.setAttribute('data-tracking-label', 'Find address');
    searchButton.setAttribute('data-tracking-category', 'button');
    searchButton.appendChild(window.document.createTextNode('Find address'));
    window.document.getElementById('address-search').insertAdjacentElement('afterend', searchButton);
    searchButton.addEventListener('click', addressSearch);
  }
  function createSearchResultsElements() {
    // CREATE INITALLY HIDDEN SEARCH RESULTS SELECT ELEMENT
    const addressSearchResultsLabel = window.document.createElement('label');
    addressSearchResultsLabel.appendChild(window.document.createTextNode('Select an address'));
    addressSearchResultsLabel.setAttribute('class', 'govuk-label');
    addressSearchResultsLabel.setAttribute('for', 'address-search-results-dropdown');
    const searchResults = window.document.createElement('select');
    searchResults.setAttribute('class', 'govuk-select');
    searchResults.setAttribute('id', 'address-search-results-dropdown');
    searchResults.setAttribute('name', 'address-search-results-dropdown');
    searchResults.appendChild(addressSearchResultsLabel);
    searchResultsDiv = window.document.createElement('div');
    searchResultsDiv.setAttribute('class', 'govuk-form-group');
    searchResultsDiv.setAttribute('id', 'address-search-results');
    searchResultsDiv.setAttribute('name', 'address-search-results');
    searchResultsDiv.setAttribute('role', 'region');
    searchResultsDiv.setAttribute('aria-live', 'polite');
    searchResultsDiv.appendChild(addressSearchResultsLabel);
    searchResultsDiv.appendChild(searchResults);
    searchResultsDiv.style.display = 'none';
    window.document.getElementById('search-button').insertAdjacentElement('afterend', searchResultsDiv);
    searchResults.addEventListener('change', mapSelectionToAddressFormInputs);
    selectElementResults = window.document.getElementById('address-search-results-dropdown');
  }
  function addRemovePostcodeInputTextOnSubmitHandler() {
    const form = window.document.getElementsByTagName('form')[0];
    form.addEventListener('submit', () => {
      addressSearchInput.removeAttribute('name');
      window.document.getElementById('address-search-results-dropdown').removeAttribute('name');
    });
  }
  function setContextualisationMessages() {
    const h1TextContent = window.document.querySelector('h1').textContent;
    let pageContext = 'the';
    if (h1TextContent.includes('their') || h1TextContent.includes('your')) {
      pageContext = h1TextContent.includes('their') ? 'their' : 'your';
    }
    apiNoAddressesFoundErrorMessage = `We could not find any addresses for that postcode. Check ${pageContext} postcode is correct, or enter ${pageContext} address manually.`;
    apiResponseNotOkErrorMessage = `The system is experiencing an issue. Enter ${pageContext} address manually.`;
    emptySearchInputErrorMessage = `Enter ${pageContext} postcode`;
  }
  function init() {
    if (window.document.querySelector('[id *= "building-and-street"]') === null) {
      return;
    }
    createContentElements();
    createPostcodeSearchElements();
    createFindAddressButton();
    createSearchResultsElements();
    addRemovePostcodeInputTextOnSubmitHandler();
    setContextualisationMessages();
  }
  return Object.freeze({
    init
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createPostcodeLookup);

/***/ }),

/***/ "./node_modules/core-js/internals/a-callable.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-callable.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsCallable(argument) is true`
module.exports = function (argument) {
  if (isCallable(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a function');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-constructor.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/a-constructor.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");

var $TypeError = TypeError;

// `Assert: IsConstructor(argument) is true`
module.exports = function (argument) {
  if (isConstructor(argument)) return argument;
  throw new $TypeError(tryToString(argument) + ' is not a constructor');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-map.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/a-map.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var has = (__webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js").has);

// Perform ? RequireInternalSlot(M, [[MapData]])
module.exports = function (it) {
  has(it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-possible-prototype.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/a-possible-prototype.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPossiblePrototype = __webpack_require__(/*! ../internals/is-possible-prototype */ "./node_modules/core-js/internals/is-possible-prototype.js");

var $String = String;
var $TypeError = TypeError;

module.exports = function (argument) {
  if (isPossiblePrototype(argument)) return argument;
  throw new $TypeError("Can't set " + $String(argument) + ' as a prototype');
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-set.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/a-set.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var has = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").has);

// Perform ? RequireInternalSlot(M, [[SetData]])
module.exports = function (it) {
  has(it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-weak-map.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-weak-map.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var has = (__webpack_require__(/*! ../internals/weak-map-helpers */ "./node_modules/core-js/internals/weak-map-helpers.js").has);

// Perform ? RequireInternalSlot(M, [[WeakMapData]])
module.exports = function (it) {
  has(it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/a-weak-set.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/a-weak-set.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var has = (__webpack_require__(/*! ../internals/weak-set-helpers */ "./node_modules/core-js/internals/weak-set-helpers.js").has);

// Perform ? RequireInternalSlot(M, [[WeakSetData]])
module.exports = function (it) {
  has(it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/add-to-unscopables.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/add-to-unscopables.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] === undefined) {
  defineProperty(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-instance.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/an-instance.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");

var $TypeError = TypeError;

module.exports = function (it, Prototype) {
  if (isPrototypeOf(Prototype, it)) return it;
  throw new $TypeError('Incorrect invocation');
};


/***/ }),

/***/ "./node_modules/core-js/internals/an-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/an-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $String = String;
var $TypeError = TypeError;

// `Assert: Type(argument) is Object`
module.exports = function (argument) {
  if (isObject(argument)) return argument;
  throw new $TypeError($String(argument) + ' is not an object');
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-basic-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-basic-detection.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";

// eslint-disable-next-line es/no-typed-arrays -- safe
module.exports = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-non-extensible.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-non-extensible.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = fails(function () {
  if (typeof ArrayBuffer == 'function') {
    var buffer = new ArrayBuffer(8);
    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
  }
});


/***/ }),

/***/ "./node_modules/core-js/internals/array-buffer-view-core.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/array-buffer-view-core.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_ARRAY_BUFFER = __webpack_require__(/*! ../internals/array-buffer-basic-detection */ "./node_modules/core-js/internals/array-buffer-basic-detection.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var Int8Array = global.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray = global.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray && Uint8ClampedArray.prototype;
var TypedArray = Int8Array && getPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && getPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError = global.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = NATIVE_ARRAY_BUFFER && !!setPrototypeOf && classof(global.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var getTypedArrayConstructor = function (it) {
  var proto = getPrototypeOf(it);
  if (!isObject(proto)) return;
  var state = getInternalState(proto);
  return (state && hasOwn(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor(proto);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwn(TypedArrayConstructorsList, klass)
    || hasOwn(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw new TypeError('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!setPrototypeOf || isPrototypeOf(TypedArray, C))) return C;
  throw new TypeError(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!DESCRIPTORS) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && hasOwn(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    defineBuiltIn(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!DESCRIPTORS) return;
  if (setPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global[ARRAY];
      if (TypedArrayConstructor && hasOwn(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return defineBuiltIn(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      defineBuiltIn(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) enforceInternalState(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw new TypeError('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global[NAME]) setPrototypeOf(global[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && getPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  setPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (DESCRIPTORS && !hasOwn(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineBuiltInAccessor(TypedArrayPrototype, TO_STRING_TAG, {
    configurable: true,
    get: function () {
      return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
    }
  });
  for (NAME in TypedArrayConstructorsList) if (global[NAME]) {
    createNonEnumerableProperty(global[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

module.exports = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  getTypedArrayConstructor: getTypedArrayConstructor,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-from-constructor-and-list.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/array-from-constructor-and-list.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

module.exports = function (Constructor, list, $length) {
  var index = 0;
  var length = arguments.length > 2 ? $length : lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-includes.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-includes.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toAbsoluteIndex = __webpack_require__(/*! ../internals/to-absolute-index */ "./node_modules/core-js/internals/to-absolute-index.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = lengthOfArrayLike(O);
    if (length === 0) return !IS_INCLUDES && -1;
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el !== el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value !== value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-iteration.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-iteration.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var arraySpeciesCreate = __webpack_require__(/*! ../internals/array-species-create */ "./node_modules/core-js/internals/array-species-create.js");

var push = uncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE === 1;
  var IS_FILTER = TYPE === 2;
  var IS_SOME = TYPE === 3;
  var IS_EVERY = TYPE === 4;
  var IS_FIND_INDEX = TYPE === 6;
  var IS_FILTER_REJECT = TYPE === 7;
  var NO_HOLES = TYPE === 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var length = lengthOfArrayLike(self);
    var boundFunction = bind(callbackfn, that);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-slice.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/array-slice.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis([].slice);


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-constructor.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');
var $Array = Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === $Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? $Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-species-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/array-species-create.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var arraySpeciesConstructor = __webpack_require__(/*! ../internals/array-species-constructor */ "./node_modules/core-js/internals/array-species-constructor.js");

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/array-unique-by.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/array-unique-by.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

var Map = MapHelpers.Map;
var mapHas = MapHelpers.has;
var mapSet = MapHelpers.set;
var push = uncurryThis([].push);

// `Array.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
module.exports = function uniqueBy(resolver) {
  var that = toObject(this);
  var length = lengthOfArrayLike(that);
  var result = [];
  var map = new Map();
  var resolverFunction = !isNullOrUndefined(resolver) ? aCallable(resolver) : function (value) {
    return value;
  };
  var index, item, key;
  for (index = 0; index < length; index++) {
    item = that[index];
    key = resolverFunction(item);
    if (!mapHas(map, key)) mapSet(map, key, item);
  }
  iterate(map, function (value) {
    push(result, value);
  });
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-from-sync-iterator.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/async-from-sync-iterator.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var AsyncIteratorPrototype = __webpack_require__(/*! ../internals/async-iterator-prototype */ "./node_modules/core-js/internals/async-iterator-prototype.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");

var Promise = getBuiltIn('Promise');

var ASYNC_FROM_SYNC_ITERATOR = 'AsyncFromSyncIterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ASYNC_FROM_SYNC_ITERATOR);

var asyncFromSyncIteratorContinuation = function (result, resolve, reject) {
  var done = result.done;
  Promise.resolve(result.value).then(function (value) {
    resolve(createIterResultObject(value, done));
  }, reject);
};

var AsyncFromSyncIterator = function AsyncIterator(iteratorRecord) {
  iteratorRecord.type = ASYNC_FROM_SYNC_ITERATOR;
  setInternalState(this, iteratorRecord);
};

AsyncFromSyncIterator.prototype = defineBuiltIns(create(AsyncIteratorPrototype), {
  next: function next() {
    var state = getInternalState(this);
    return new Promise(function (resolve, reject) {
      var result = anObject(call(state.next, state.iterator));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  },
  'return': function () {
    var iterator = getInternalState(this).iterator;
    return new Promise(function (resolve, reject) {
      var $return = getMethod(iterator, 'return');
      if ($return === undefined) return resolve(createIterResultObject(undefined, true));
      var result = anObject(call($return, iterator));
      asyncFromSyncIteratorContinuation(result, resolve, reject);
    });
  }
});

module.exports = AsyncFromSyncIterator;


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-close.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-close.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");

module.exports = function (iterator, method, argument, reject) {
  try {
    var returnMethod = getMethod(iterator, 'return');
    if (returnMethod) {
      return getBuiltIn('Promise').resolve(call(returnMethod, iterator)).then(function () {
        method(argument);
      }, function (error) {
        reject(error);
      });
    }
  } catch (error2) {
    return reject(error2);
  } method(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-create-proxy.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-create-proxy.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js/internals/perform.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var AsyncIteratorPrototype = __webpack_require__(/*! ../internals/async-iterator-prototype */ "./node_modules/core-js/internals/async-iterator-prototype.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

var Promise = getBuiltIn('Promise');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ASYNC_ITERATOR_HELPER = 'AsyncIteratorHelper';
var WRAP_FOR_VALID_ASYNC_ITERATOR = 'WrapForValidAsyncIterator';
var setInternalState = InternalStateModule.set;

var createAsyncIteratorProxyPrototype = function (IS_ITERATOR) {
  var IS_GENERATOR = !IS_ITERATOR;
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER);

  var getStateOrEarlyExit = function (that) {
    var stateCompletion = perform(function () {
      return getInternalState(that);
    });

    var stateError = stateCompletion.error;
    var state = stateCompletion.value;

    if (stateError || (IS_GENERATOR && state.done)) {
      return { exit: true, value: stateError ? Promise.reject(state) : Promise.resolve(createIterResultObject(undefined, true)) };
    } return { exit: false, value: state };
  };

  return defineBuiltIns(create(AsyncIteratorPrototype), {
    next: function next() {
      var stateCompletion = getStateOrEarlyExit(this);
      var state = stateCompletion.value;
      if (stateCompletion.exit) return state;
      var handlerCompletion = perform(function () {
        return anObject(state.nextHandler(Promise));
      });
      var handlerError = handlerCompletion.error;
      var value = handlerCompletion.value;
      if (handlerError) state.done = true;
      return handlerError ? Promise.reject(value) : Promise.resolve(value);
    },
    'return': function () {
      var stateCompletion = getStateOrEarlyExit(this);
      var state = stateCompletion.value;
      if (stateCompletion.exit) return state;
      state.done = true;
      var iterator = state.iterator;
      var returnMethod, result;
      var completion = perform(function () {
        if (state.inner) try {
          iteratorClose(state.inner.iterator, 'normal');
        } catch (error) {
          return iteratorClose(iterator, 'throw', error);
        }
        return getMethod(iterator, 'return');
      });
      returnMethod = result = completion.value;
      if (completion.error) return Promise.reject(result);
      if (returnMethod === undefined) return Promise.resolve(createIterResultObject(undefined, true));
      completion = perform(function () {
        return call(returnMethod, iterator);
      });
      result = completion.value;
      if (completion.error) return Promise.reject(result);
      return IS_ITERATOR ? Promise.resolve(result) : Promise.resolve(result).then(function (resolved) {
        anObject(resolved);
        return createIterResultObject(undefined, true);
      });
    }
  });
};

var WrapForValidAsyncIteratorPrototype = createAsyncIteratorProxyPrototype(true);
var AsyncIteratorHelperPrototype = createAsyncIteratorProxyPrototype(false);

createNonEnumerableProperty(AsyncIteratorHelperPrototype, TO_STRING_TAG, 'Async Iterator Helper');

module.exports = function (nextHandler, IS_ITERATOR) {
  var AsyncIteratorProxy = function AsyncIterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ASYNC_ITERATOR : ASYNC_ITERATOR_HELPER;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };

  AsyncIteratorProxy.prototype = IS_ITERATOR ? WrapForValidAsyncIteratorPrototype : AsyncIteratorHelperPrototype;

  return AsyncIteratorProxy;
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-indexed.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-indexed.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var map = __webpack_require__(/*! ../internals/async-iterator-map */ "./node_modules/core-js/internals/async-iterator-map.js");

var callback = function (value, counter) {
  return [counter, value];
};

// `AsyncIterator.prototype.indexed` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function indexed() {
  return call(map, this, callback);
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-iteration.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-iteration.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://github.com/tc39/proposal-iterator-helpers
// https://github.com/tc39/proposal-array-from-async
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var doesNotExceedSafeInteger = __webpack_require__(/*! ../internals/does-not-exceed-safe-integer */ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var closeAsyncIteration = __webpack_require__(/*! ../internals/async-iterator-close */ "./node_modules/core-js/internals/async-iterator-close.js");

var createMethod = function (TYPE) {
  var IS_TO_ARRAY = TYPE === 0;
  var IS_FOR_EACH = TYPE === 1;
  var IS_EVERY = TYPE === 2;
  var IS_SOME = TYPE === 3;
  return function (object, fn, target) {
    anObject(object);
    var MAPPING = fn !== undefined;
    if (MAPPING || !IS_TO_ARRAY) aCallable(fn);
    var record = getIteratorDirect(object);
    var Promise = getBuiltIn('Promise');
    var iterator = record.iterator;
    var next = record.next;
    var counter = 0;

    return new Promise(function (resolve, reject) {
      var ifAbruptCloseAsyncIterator = function (error) {
        closeAsyncIteration(iterator, reject, error, reject);
      };

      var loop = function () {
        try {
          if (MAPPING) try {
            doesNotExceedSafeInteger(counter);
          } catch (error5) { ifAbruptCloseAsyncIterator(error5); }
          Promise.resolve(anObject(call(next, iterator))).then(function (step) {
            try {
              if (anObject(step).done) {
                if (IS_TO_ARRAY) {
                  target.length = counter;
                  resolve(target);
                } else resolve(IS_SOME ? false : IS_EVERY || undefined);
              } else {
                var value = step.value;
                try {
                  if (MAPPING) {
                    var result = fn(value, counter);

                    var handler = function ($result) {
                      if (IS_FOR_EACH) {
                        loop();
                      } else if (IS_EVERY) {
                        $result ? loop() : closeAsyncIteration(iterator, resolve, false, reject);
                      } else if (IS_TO_ARRAY) {
                        try {
                          target[counter++] = $result;
                          loop();
                        } catch (error4) { ifAbruptCloseAsyncIterator(error4); }
                      } else {
                        $result ? closeAsyncIteration(iterator, resolve, IS_SOME || value, reject) : loop();
                      }
                    };

                    if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
                    else handler(result);
                  } else {
                    target[counter++] = value;
                    loop();
                  }
                } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
              }
            } catch (error2) { reject(error2); }
          }, reject);
        } catch (error) { reject(error); }
      };

      loop();
    });
  };
};

module.exports = {
  toArray: createMethod(0),
  forEach: createMethod(1),
  every: createMethod(2),
  some: createMethod(3),
  find: createMethod(4)
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-map.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-map.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var closeAsyncIteration = __webpack_require__(/*! ../internals/async-iterator-close */ "./node_modules/core-js/internals/async-iterator-close.js");

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var mapper = state.mapper;

  return new Promise(function (resolve, reject) {
    var doneAndReject = function (error) {
      state.done = true;
      reject(error);
    };

    var ifAbruptCloseAsyncIterator = function (error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };

    Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
      try {
        if (anObject(step).done) {
          state.done = true;
          resolve(createIterResultObject(undefined, true));
        } else {
          var value = step.value;
          try {
            var result = mapper(value, state.counter++);

            var handler = function (mapped) {
              resolve(createIterResultObject(mapped, false));
            };

            if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
            else handler(result);
          } catch (error2) { ifAbruptCloseAsyncIterator(error2); }
        }
      } catch (error) { doneAndReject(error); }
    }, doneAndReject);
  });
});

// `AsyncIterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  anObject(this);
  aCallable(mapper);
  return new AsyncIteratorProxy(getIteratorDirect(this), {
    mapper: mapper
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-prototype.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-prototype.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var USE_FUNCTION_CONSTRUCTOR = 'USE_FUNCTION_CONSTRUCTOR';
var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');
var AsyncIterator = global.AsyncIterator;
var PassedAsyncIteratorPrototype = shared.AsyncIteratorPrototype;
var AsyncIteratorPrototype, prototype;

if (PassedAsyncIteratorPrototype) {
  AsyncIteratorPrototype = PassedAsyncIteratorPrototype;
} else if (isCallable(AsyncIterator)) {
  AsyncIteratorPrototype = AsyncIterator.prototype;
} else if (shared[USE_FUNCTION_CONSTRUCTOR] || global[USE_FUNCTION_CONSTRUCTOR]) {
  try {
    // eslint-disable-next-line no-new-func -- we have no alternatives without usage of modern syntax
    prototype = getPrototypeOf(getPrototypeOf(getPrototypeOf(Function('return async function*(){}()')())));
    if (getPrototypeOf(prototype) === Object.prototype) AsyncIteratorPrototype = prototype;
  } catch (error) { /* empty */ }
}

if (!AsyncIteratorPrototype) AsyncIteratorPrototype = {};
else if (IS_PURE) AsyncIteratorPrototype = create(AsyncIteratorPrototype);

if (!isCallable(AsyncIteratorPrototype[ASYNC_ITERATOR])) {
  defineBuiltIn(AsyncIteratorPrototype, ASYNC_ITERATOR, function () {
    return this;
  });
}

module.exports = AsyncIteratorPrototype;


/***/ }),

/***/ "./node_modules/core-js/internals/async-iterator-wrap.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/async-iterator-wrap.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");

module.exports = createAsyncIteratorProxy(function () {
  return call(this.next, this.iterator);
}, true);


/***/ }),

/***/ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js":
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/internals/call-with-safe-iteration-closing.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/check-correctness-of-iteration.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/check-correctness-of-iteration.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  try {
    if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  } catch (error) { return false; } // workaround of old WebKit + `eval` bug
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof-raw.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/classof-raw.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var toString = uncurryThis({}.toString);
var stringSlice = uncurryThis(''.slice);

module.exports = function (it) {
  return stringSlice(toString(it), 8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/internals/classof.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/classof.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(/*! ../internals/to-string-tag-support */ "./node_modules/core-js/internals/to-string-tag-support.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var $Object = Object;

// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) === 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = $Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) === 'Object' && isCallable(O.callee) ? 'Arguments' : result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection-from.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/collection-from.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://tc39.github.io/proposal-setmap-offrom/
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");

module.exports = function (C, adder, ENTRY) {
  return function from(source /* , mapFn, thisArg */) {
    var O = toObject(source);
    var length = arguments.length;
    var mapFn = length > 1 ? arguments[1] : undefined;
    var mapping = mapFn !== undefined;
    var boundFunction = mapping ? bind(mapFn, length > 2 ? arguments[2] : undefined) : undefined;
    var result = new C();
    var n = 0;
    iterate(O, function (nextItem) {
      var entry = mapping ? boundFunction(nextItem, n++) : nextItem;
      if (ENTRY) adder(result, anObject(entry)[0], entry[1]);
      else adder(result, entry);
    });
    return result;
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection-of.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/collection-of.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// https://tc39.github.io/proposal-setmap-offrom/
module.exports = function (C, adder, ENTRY) {
  return function of() {
    var result = new C();
    var length = arguments.length;
    for (var index = 0; index < length; index++) {
      var entry = arguments[index];
      if (ENTRY) adder(result, anObject(entry)[0], entry[1]);
      else adder(result, entry);
    } return result;
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection-strong.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/collection-strong.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var defineIterator = __webpack_require__(/*! ../internals/iterator-define */ "./node_modules/core-js/internals/iterator-define.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fastKey = (__webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js").fastKey);
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key === key) return entry;
      }
    };

    defineBuiltIns(Prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          entry = entry.next;
        }
        state.first = state.last = undefined;
        state.index = create(null);
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first === entry) state.first = next;
          if (state.last === entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    defineBuiltIns(Prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineBuiltInAccessor(Prototype, 'size', {
      configurable: true,
      get: function () {
        return getInternalState(this).size;
      }
    });
    return Constructor;
  },
  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return createIterResultObject(undefined, true);
      }
      // return step by kind
      if (kind === 'keys') return createIterResultObject(entry.key, false);
      if (kind === 'values') return createIterResultObject(entry.value, false);
      return createIterResultObject([entry.key, entry.value], false);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection-weak.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/collection-weak.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var getWeakData = (__webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js").getWeakData);
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var ArrayIterationModule = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;
var find = ArrayIterationModule.find;
var findIndex = ArrayIterationModule.findIndex;
var splice = uncurryThis([].splice);
var id = 0;

// fallback for uncaught frozen keys
var uncaughtFrozenStore = function (state) {
  return state.frozen || (state.frozen = new UncaughtFrozenStore());
};

var UncaughtFrozenStore = function () {
  this.entries = [];
};

var findUncaughtFrozen = function (store, key) {
  return find(store.entries, function (it) {
    return it[0] === key;
  });
};

UncaughtFrozenStore.prototype = {
  get: function (key) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) return entry[1];
  },
  has: function (key) {
    return !!findUncaughtFrozen(this, key);
  },
  set: function (key, value) {
    var entry = findUncaughtFrozen(this, key);
    if (entry) entry[1] = value;
    else this.entries.push([key, value]);
  },
  'delete': function (key) {
    var index = findIndex(this.entries, function (it) {
      return it[0] === key;
    });
    if (~index) splice(this.entries, index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var Constructor = wrapper(function (that, iterable) {
      anInstance(that, Prototype);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        id: id++,
        frozen: undefined
      });
      if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var Prototype = Constructor.prototype;

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var data = getWeakData(anObject(key), true);
      if (data === true) uncaughtFrozenStore(state).set(key, value);
      else data[state.id] = value;
      return that;
    };

    defineBuiltIns(Prototype, {
      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
      'delete': function (key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
        return data && hasOwn(data, state.id) && delete data[state.id];
      },
      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
      // https://tc39.es/ecma262/#sec-weakset.prototype.has
      has: function has(key) {
        var state = getInternalState(this);
        if (!isObject(key)) return false;
        var data = getWeakData(key);
        if (data === true) return uncaughtFrozenStore(state).has(key);
        return data && hasOwn(data, state.id);
      }
    });

    defineBuiltIns(Prototype, IS_MAP ? {
      // `WeakMap.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
      get: function get(key) {
        var state = getInternalState(this);
        if (isObject(key)) {
          var data = getWeakData(key);
          if (data === true) return uncaughtFrozenStore(state).get(key);
          return data ? data[state.id] : undefined;
        }
      },
      // `WeakMap.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
      set: function set(key, value) {
        return define(this, key, value);
      }
    } : {
      // `WeakSet.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-weakset.prototype.add
      add: function add(value) {
        return define(this, value, true);
      }
    });

    return Constructor;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/collection.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/collection.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var InternalMetadataModule = __webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var inheritIfRequired = __webpack_require__(/*! ../internals/inherit-if-required */ "./node_modules/core-js/internals/inherit-if-required.js");

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var uncurriedNativeMethod = uncurryThis(NativePrototype[KEY]);
    defineBuiltIn(NativePrototype, KEY,
      KEY === 'add' ? function add(value) {
        uncurriedNativeMethod(this, value === 0 ? 0 : value);
        return this;
      } : KEY === 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY === 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : KEY === 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced(
    CONSTRUCTOR_NAME,
    !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) !== instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, NativePrototype);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (!isNullOrUndefined(iterable)) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, constructor: true, forced: Constructor !== NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/composite-key.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/composite-key.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.map */ "./node_modules/core-js/modules/es.map.js");
__webpack_require__(/*! ../modules/es.weak-map */ "./node_modules/core-js/modules/es.weak-map.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $Object = Object;
var $TypeError = TypeError;
var Map = getBuiltIn('Map');
var WeakMap = getBuiltIn('WeakMap');

var Node = function () {
  // keys
  this.object = null;
  this.symbol = null;
  // child nodes
  this.primitives = null;
  this.objectsByIndex = create(null);
};

Node.prototype.get = function (key, initializer) {
  return this[key] || (this[key] = initializer());
};

Node.prototype.next = function (i, it, IS_OBJECT) {
  var store = IS_OBJECT
    ? this.objectsByIndex[i] || (this.objectsByIndex[i] = new WeakMap())
    : this.primitives || (this.primitives = new Map());
  var entry = store.get(it);
  if (!entry) store.set(it, entry = new Node());
  return entry;
};

var root = new Node();

module.exports = function () {
  var active = root;
  var length = arguments.length;
  var i, it;
  // for prevent leaking, start from objects
  for (i = 0; i < length; i++) {
    if (isObject(it = arguments[i])) active = active.next(i, it, true);
  }
  if (this === $Object && active === root) throw new $TypeError('Composite keys must contain a non-primitive component');
  for (i = 0; i < length; i++) {
    if (!isObject(it = arguments[i])) active = active.next(i, it, false);
  } return active;
};


/***/ }),

/***/ "./node_modules/core-js/internals/copy-constructor-properties.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/copy-constructor-properties.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var ownKeys = __webpack_require__(/*! ../internals/own-keys */ "./node_modules/core-js/internals/own-keys.js");
var getOwnPropertyDescriptorModule = __webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, source, exceptions) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!hasOwn(target, key) && !(exceptions && hasOwn(exceptions, key))) {
      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/correct-prototype-getter.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-prototype-getter.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),

/***/ "./node_modules/core-js/internals/create-iter-result-object.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-iter-result-object.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";

// `CreateIterResultObject` abstract operation
// https://tc39.es/ecma262/#sec-createiterresultobject
module.exports = function (value, done) {
  return { value: value, done: done };
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-non-enumerable-property.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/create-non-enumerable-property.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property-descriptor.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/internals/create-property-descriptor.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/create-property.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/create-property.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");

module.exports = function (object, key, value) {
  if (DESCRIPTORS) definePropertyModule.f(object, key, createPropertyDescriptor(0, value));
  else object[key] = value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in-accessor.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in-accessor.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineProperty = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");

module.exports = function (target, name, descriptor) {
  if (descriptor.get) makeBuiltIn(descriptor.get, name, { getter: true });
  if (descriptor.set) makeBuiltIn(descriptor.set, name, { setter: true });
  return defineProperty.f(target, name, descriptor);
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-in.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-in.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var makeBuiltIn = __webpack_require__(/*! ../internals/make-built-in */ "./node_modules/core-js/internals/make-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

module.exports = function (O, key, value, options) {
  if (!options) options = {};
  var simple = options.enumerable;
  var name = options.name !== undefined ? options.name : key;
  if (isCallable(value)) makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple) O[key] = value;
    else defineGlobalProperty(key, value);
  } else {
    try {
      if (!options.unsafe) delete O[key];
      else if (O[key]) simple = true;
    } catch (error) { /* empty */ }
    if (simple) O[key] = value;
    else definePropertyModule.f(O, key, {
      value: value,
      enumerable: false,
      configurable: !options.nonConfigurable,
      writable: !options.nonWritable
    });
  } return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-built-ins.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/define-built-ins.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");

module.exports = function (target, src, options) {
  for (var key in src) defineBuiltIn(target, key, src[key], options);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js/internals/define-global-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/define-global-property.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;

module.exports = function (key, value) {
  try {
    defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/descriptors.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/descriptors.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/document-create-element.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/document-create-element.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/internals/does-not-exceed-safe-integer.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/does-not-exceed-safe-integer.js ***!
  \************************************************************************/
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

module.exports = function (it) {
  if (it > MAX_SAFE_INTEGER) throw $TypeError('Maximum allowed index exceeded');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/engine-is-bun.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/engine-is-bun.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";

/* global Bun -- Bun case */
module.exports = typeof Bun == 'function' && Bun && typeof Bun.version == 'string';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-is-ios.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/engine-is-ios.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

// eslint-disable-next-line redos/no-vulnerable -- safe
module.exports = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);


/***/ }),

/***/ "./node_modules/core-js/internals/engine-is-node.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/engine-is-node.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

module.exports = classof(global.process) === 'process';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-user-agent.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-user-agent.js ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";

module.exports = typeof navigator != 'undefined' && String(navigator.userAgent) || '';


/***/ }),

/***/ "./node_modules/core-js/internals/engine-v8-version.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/engine-v8-version.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
  // but their correct versions are not interesting for us
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}

// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
// so check `userAgent` even if `.v8` exists, but 0
if (!version && userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = +match[1];
  }
}

module.exports = version;


/***/ }),

/***/ "./node_modules/core-js/internals/enum-bug-keys.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/enum-bug-keys.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),

/***/ "./node_modules/core-js/internals/export.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/export.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");
var copyConstructorProperties = __webpack_require__(/*! ../internals/copy-constructor-properties */ "./node_modules/core-js/internals/copy-constructor-properties.js");
var isForced = __webpack_require__(/*! ../internals/is-forced */ "./node_modules/core-js/internals/is-forced.js");

/*
  options.target         - name of the target object
  options.global         - target is the global object
  options.stat           - export as static methods of target
  options.proto          - export as prototype methods of target
  options.real           - real prototype method for the `pure` version
  options.forced         - export even if the native feature is available
  options.bind           - bind methods to the target, required for the `pure` version
  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
  options.sham           - add a flag to not completely full polyfills
  options.enumerable     - export as enumerable property
  options.dontCallGetSet - prevent calling a getter on target
  options.name           - the .name of the function if it does not match the key
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = global[TARGET] && global[TARGET].prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.dontCallGetSet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty == typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    defineBuiltIn(target, key, sourceProperty, options);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/fails.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/internals/fails.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/freezing.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/freezing.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-apply.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/function-apply.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var apply = FunctionPrototype.apply;
var call = FunctionPrototype.call;

// eslint-disable-next-line es/no-reflect -- safe
module.exports = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND ? call.bind(apply) : function () {
  return call.apply(apply, arguments);
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-context.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-context.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this-clause */ "./node_modules/core-js/internals/function-uncurry-this-clause.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var bind = uncurryThis(uncurryThis.bind);

// optional / simple context binding
module.exports = function (fn, that) {
  aCallable(fn);
  return that === undefined ? fn : NATIVE_BIND ? bind(fn, that) : function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-bind-native.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-bind-native.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-function-prototype-bind -- safe
  var test = (function () { /* empty */ }).bind();
  // eslint-disable-next-line no-prototype-builtins -- safe
  return typeof test != 'function' || test.hasOwnProperty('prototype');
});


/***/ }),

/***/ "./node_modules/core-js/internals/function-call.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-call.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var call = Function.prototype.call;

module.exports = NATIVE_BIND ? call.bind(call) : function () {
  return call.apply(call, arguments);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-name.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/function-name.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");

var FunctionPrototype = Function.prototype;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getDescriptor = DESCRIPTORS && Object.getOwnPropertyDescriptor;

var EXISTS = hasOwn(FunctionPrototype, 'name');
// additional protection from minified / mangled / dropped function names
var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
var CONFIGURABLE = EXISTS && (!DESCRIPTORS || (DESCRIPTORS && getDescriptor(FunctionPrototype, 'name').configurable));

module.exports = {
  EXISTS: EXISTS,
  PROPER: PROPER,
  CONFIGURABLE: CONFIGURABLE
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-accessor.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-accessor.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

module.exports = function (object, key, method) {
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    return uncurryThis(aCallable(Object.getOwnPropertyDescriptor(object, key)[method]));
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this-clause.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this-clause.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classofRaw = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = function (fn) {
  // Nashorn bug:
  //   https://github.com/zloirock/core-js/issues/1128
  //   https://github.com/zloirock/core-js/issues/1130
  if (classofRaw(fn) === 'Function') return uncurryThis(fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/function-uncurry-this.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/function-uncurry-this.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_BIND = __webpack_require__(/*! ../internals/function-bind-native */ "./node_modules/core-js/internals/function-bind-native.js");

var FunctionPrototype = Function.prototype;
var call = FunctionPrototype.call;
var uncurryThisWithBind = NATIVE_BIND && FunctionPrototype.bind.bind(call, call);

module.exports = NATIVE_BIND ? uncurryThisWithBind : function (fn) {
  return function () {
    return call.apply(fn, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-async-iterator-flattenable.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/internals/get-async-iterator-flattenable.js ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var AsyncFromSyncIterator = __webpack_require__(/*! ../internals/async-from-sync-iterator */ "./node_modules/core-js/internals/async-from-sync-iterator.js");

var ASYNC_ITERATOR = wellKnownSymbol('asyncIterator');

module.exports = function (obj) {
  var object = anObject(obj);
  var alreadyAsync = true;
  var method = getMethod(object, ASYNC_ITERATOR);
  var iterator;
  if (!isCallable(method)) {
    method = getIteratorMethod(object);
    alreadyAsync = false;
  }
  if (method !== undefined) {
    iterator = call(method, object);
  } else {
    iterator = object;
    alreadyAsync = true;
  }
  anObject(iterator);
  return getIteratorDirect(alreadyAsync ? iterator : new AsyncFromSyncIterator(getIteratorDirect(iterator)));
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-built-in.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-built-in.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var aFunction = function (argument) {
  return isCallable(argument) ? argument : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-direct.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-direct.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";

// `GetIteratorDirect(obj)` abstract operation
// https://tc39.es/proposal-iterator-helpers/#sec-getiteratordirect
module.exports = function (obj) {
  return {
    iterator: obj,
    next: obj.next,
    done: false
  };
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-flattenable.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-flattenable.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

module.exports = function (obj, stringHandling) {
  if (!stringHandling || typeof obj !== 'string') anObject(obj);
  var method = getIteratorMethod(obj);
  return getIteratorDirect(anObject(method !== undefined ? call(method, obj) : obj));
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator-method.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (!isNullOrUndefined(it)) return getMethod(it, ITERATOR)
    || getMethod(it, '@@iterator')
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-iterator.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/get-iterator.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

var $TypeError = TypeError;

module.exports = function (argument, usingIterator) {
  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
  if (aCallable(iteratorMethod)) return anObject(call(iteratorMethod, argument));
  throw new $TypeError(tryToString(argument) + ' is not iterable');
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-method.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/get-method.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

// `GetMethod` abstract operation
// https://tc39.es/ecma262/#sec-getmethod
module.exports = function (V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? undefined : aCallable(func);
};


/***/ }),

/***/ "./node_modules/core-js/internals/get-set-record.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/get-set-record.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

var INVALID_SIZE = 'Invalid size';
var $RangeError = RangeError;
var $TypeError = TypeError;
var max = Math.max;

var SetRecord = function (set, intSize) {
  this.set = set;
  this.size = max(intSize, 0);
  this.has = aCallable(set.has);
  this.keys = aCallable(set.keys);
};

SetRecord.prototype = {
  getIterator: function () {
    return getIteratorDirect(anObject(call(this.keys, this.set)));
  },
  includes: function (it) {
    return call(this.has, this.set, it);
  }
};

// `GetSetRecord` abstract operation
// https://tc39.es/proposal-set-methods/#sec-getsetrecord
module.exports = function (obj) {
  anObject(obj);
  var numSize = +obj.size;
  // NOTE: If size is undefined, then numSize will be NaN
  // eslint-disable-next-line no-self-compare -- NaN check
  if (numSize !== numSize) throw new $TypeError(INVALID_SIZE);
  var intSize = toIntegerOrInfinity(numSize);
  if (intSize < 0) throw new $RangeError(INVALID_SIZE);
  return new SetRecord(obj, intSize);
};


/***/ }),

/***/ "./node_modules/core-js/internals/global.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/global.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var check = function (it) {
  return it && it.Math === Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof __webpack_require__.g == 'object' && __webpack_require__.g) ||
  check(typeof this == 'object' && this) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();


/***/ }),

/***/ "./node_modules/core-js/internals/has-own-property.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/has-own-property.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var hasOwnProperty = uncurryThis({}.hasOwnProperty);

// `HasOwnProperty` abstract operation
// https://tc39.es/ecma262/#sec-hasownproperty
// eslint-disable-next-line es/no-object-hasown -- safe
module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};


/***/ }),

/***/ "./node_modules/core-js/internals/hidden-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/hidden-keys.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/host-report-errors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/host-report-errors.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";

module.exports = function (a, b) {
  try {
    // eslint-disable-next-line no-console -- safe
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  } catch (error) { /* empty */ }
};


/***/ }),

/***/ "./node_modules/core-js/internals/html.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/html.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),

/***/ "./node_modules/core-js/internals/ie8-dom-define.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/ie8-dom-define.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");

// Thanks to IE8 for its funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a !== 7;
});


/***/ }),

/***/ "./node_modules/core-js/internals/indexed-object.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/indexed-object.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

var $Object = Object;
var split = uncurryThis(''.split);

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !$Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) === 'String' ? split(it, '') : $Object(it);
} : $Object;


/***/ }),

/***/ "./node_modules/core-js/internals/inherit-if-required.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/inherit-if-required.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    isCallable(NewTarget = dummy.constructor) &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),

/***/ "./node_modules/core-js/internals/inspect-source.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/inspect-source.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

var functionToString = uncurryThis(Function.toString);

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (!isCallable(store.inspectSource)) {
  store.inspectSource = function (it) {
    return functionToString(it);
  };
}

module.exports = store.inspectSource;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-metadata.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/internal-metadata.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertyNamesExternalModule = __webpack_require__(/*! ../internals/object-get-own-property-names-external */ "./node_modules/core-js/internals/object-get-own-property-names-external.js");
var isExtensible = __webpack_require__(/*! ../internals/object-is-extensible */ "./node_modules/core-js/internals/object-is-extensible.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var FREEZING = __webpack_require__(/*! ../internals/freezing */ "./node_modules/core-js/internals/freezing.js");

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!hasOwn(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !hasOwn(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = uncurryThis([].splice);
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),

/***/ "./node_modules/core-js/internals/internal-state.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/internal-state.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var shared = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var TypeError = global.TypeError;
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw new TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  /* eslint-disable no-self-assign -- prototype methods protection */
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  /* eslint-enable no-self-assign -- prototype methods protection */
  set = function (it, metadata) {
    if (store.has(it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function (it) {
    return store.get(it) || {};
  };
  has = function (it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (hasOwn(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return hasOwn(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return hasOwn(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array-iterator-method.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/is-array-iterator-method.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-array.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/is-array.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(argument) {
  return classof(argument) === 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-callable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-callable.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";

// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
var documentAll = typeof document == 'object' && document.all;

// `IsCallable` abstract operation
// https://tc39.es/ecma262/#sec-iscallable
// eslint-disable-next-line unicorn/no-typeof-undefined -- required for testing
module.exports = typeof documentAll == 'undefined' && documentAll !== undefined ? function (argument) {
  return typeof argument == 'function' || argument === documentAll;
} : function (argument) {
  return typeof argument == 'function';
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-constructor.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/is-constructor.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");

var noop = function () { /* empty */ };
var construct = getBuiltIn('Reflect', 'construct');
var constructorRegExp = /^\s*(?:class|function)\b/;
var exec = uncurryThis(constructorRegExp.exec);
var INCORRECT_TO_STRING = !constructorRegExp.test(noop);

var isConstructorModern = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  try {
    construct(noop, [], argument);
    return true;
  } catch (error) {
    return false;
  }
};

var isConstructorLegacy = function isConstructor(argument) {
  if (!isCallable(argument)) return false;
  switch (classof(argument)) {
    case 'AsyncFunction':
    case 'GeneratorFunction':
    case 'AsyncGeneratorFunction': return false;
  }
  try {
    // we can't check .prototype since constructors produced by .bind haven't it
    // `Function#toString` throws on some built-it function in some legacy engines
    // (for example, `DOMQuad` and similar in FF41-)
    return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
  } catch (error) {
    return true;
  }
};

isConstructorLegacy.sham = true;

// `IsConstructor` abstract operation
// https://tc39.es/ecma262/#sec-isconstructor
module.exports = !construct || fails(function () {
  var called;
  return isConstructorModern(isConstructorModern.call)
    || !isConstructorModern(Object)
    || !isConstructorModern(function () { called = true; })
    || called;
}) ? isConstructorLegacy : isConstructorModern;


/***/ }),

/***/ "./node_modules/core-js/internals/is-forced.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-forced.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value === POLYFILL ? true
    : value === NATIVE ? false
    : isCallable(detection) ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),

/***/ "./node_modules/core-js/internals/is-iterable.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/is-iterable.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var ITERATOR = wellKnownSymbol('iterator');
var $Object = Object;

module.exports = function (it) {
  if (isNullOrUndefined(it)) return false;
  var O = $Object(it);
  return O[ITERATOR] !== undefined
    || '@@iterator' in O
    || hasOwn(Iterators, classof(O));
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-null-or-undefined.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-null-or-undefined.js ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";

// we can't use just `it == null` since of `document.all` special case
// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
module.exports = function (it) {
  return it === null || it === undefined;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

module.exports = function (it) {
  return typeof it == 'object' ? it !== null : isCallable(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-possible-prototype.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/is-possible-prototype.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

module.exports = function (argument) {
  return isObject(argument) || argument === null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/is-pure.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/is-pure.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/internals/is-symbol.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/is-symbol.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var $Object = Object;

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return isCallable($Symbol) && isPrototypeOf($Symbol.prototype, $Object(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterate-simple.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterate-simple.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");

module.exports = function (record, fn, ITERATOR_INSTEAD_OF_RECORD) {
  var iterator = ITERATOR_INSTEAD_OF_RECORD ? record : record.iterator;
  var next = record.next;
  var step, result;
  while (!(step = call(next, iterator)).done) {
    result = fn(step.value);
    if (result !== undefined) return result;
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterate.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/iterate.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var tryToString = __webpack_require__(/*! ../internals/try-to-string */ "./node_modules/core-js/internals/try-to-string.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js/internals/get-iterator.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

var $TypeError = TypeError;

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var ResultPrototype = Result.prototype;

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_RECORD = !!(options && options.IS_RECORD);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator, 'normal', condition);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_RECORD) {
    iterator = iterable.iterator;
  } else if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (!iterFn) throw new $TypeError(tryToString(iterable) + ' is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && isPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    }
    iterator = getIterator(iterable, iterFn);
  }

  next = IS_RECORD ? iterable.next : iterator.next;
  while (!(step = call(next, iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
    if (typeof result == 'object' && result && isPrototypeOf(ResultPrototype, result)) return result;
  } return new Result(false);
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-close.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-close.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");

module.exports = function (iterator, kind, value) {
  var innerResult, innerError;
  anObject(iterator);
  try {
    innerResult = getMethod(iterator, 'return');
    if (!innerResult) {
      if (kind === 'throw') throw value;
      return value;
    }
    innerResult = call(innerResult, iterator);
  } catch (error) {
    innerError = true;
    innerResult = error;
  }
  if (kind === 'throw') throw value;
  if (innerError) throw innerResult;
  anObject(innerResult);
  return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-create-constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-create-constructor.js ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-create-proxy.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-create-proxy.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ITERATOR_HELPER = 'IteratorHelper';
var WRAP_FOR_VALID_ITERATOR = 'WrapForValidIterator';
var setInternalState = InternalStateModule.set;

var createIteratorProxyPrototype = function (IS_ITERATOR) {
  var getInternalState = InternalStateModule.getterFor(IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER);

  return defineBuiltIns(create(IteratorPrototype), {
    next: function next() {
      var state = getInternalState(this);
      // for simplification:
      //   for `%WrapForValidIteratorPrototype%.next` our `nextHandler` returns `IterResultObject`
      //   for `%IteratorHelperPrototype%.next` - just a value
      if (IS_ITERATOR) return state.nextHandler();
      try {
        var result = state.done ? undefined : state.nextHandler();
        return createIterResultObject(result, state.done);
      } catch (error) {
        state.done = true;
        throw error;
      }
    },
    'return': function () {
      var state = getInternalState(this);
      var iterator = state.iterator;
      state.done = true;
      if (IS_ITERATOR) {
        var returnMethod = getMethod(iterator, 'return');
        return returnMethod ? call(returnMethod, iterator) : createIterResultObject(undefined, true);
      }
      if (state.inner) try {
        iteratorClose(state.inner.iterator, 'normal');
      } catch (error) {
        return iteratorClose(iterator, 'throw', error);
      }
      iteratorClose(iterator, 'normal');
      return createIterResultObject(undefined, true);
    }
  });
};

var WrapForValidIteratorPrototype = createIteratorProxyPrototype(true);
var IteratorHelperPrototype = createIteratorProxyPrototype(false);

createNonEnumerableProperty(IteratorHelperPrototype, TO_STRING_TAG, 'Iterator Helper');

module.exports = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(record, state) {
    if (state) {
      state.iterator = record.iterator;
      state.next = record.next;
    } else state = record;
    state.type = IS_ITERATOR ? WRAP_FOR_VALID_ITERATOR : ITERATOR_HELPER;
    state.nextHandler = nextHandler;
    state.counter = 0;
    state.done = false;
    setInternalState(this, state);
  };

  IteratorProxy.prototype = IS_ITERATOR ? WrapForValidIteratorPrototype : IteratorHelperPrototype;

  return IteratorProxy;
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-define.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-define.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var FunctionName = __webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var setPrototypeOf = __webpack_require__(/*! ../internals/object-set-prototype-of */ "./node_modules/core-js/internals/object-set-prototype-of.js");
var setToStringTag = __webpack_require__(/*! ../internals/set-to-string-tag */ "./node_modules/core-js/internals/set-to-string-tag.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var Iterators = __webpack_require__(/*! ../internals/iterators */ "./node_modules/core-js/internals/iterators.js");
var IteratorsCore = __webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js");

var PROPER_FUNCTION_NAME = FunctionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND && KIND in IterablePrototype) return IterablePrototype[KIND];

    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    }

    return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME === 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (!isCallable(CurrentIteratorPrototype[ITERATOR])) {
          defineBuiltIn(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (PROPER_FUNCTION_NAME && DEFAULT === VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    if (!IS_PURE && CONFIGURABLE_FUNCTION_NAME) {
      createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
    } else {
      INCORRECT_VALUES_NAME = true;
      defaultIterator = function values() { return call(nativeIterator, this); };
    }
  }

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    defineBuiltIn(IterablePrototype, ITERATOR, defaultIterator, { name: DEFAULT });
  }
  Iterators[NAME] = defaultIterator;

  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-indexed.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-indexed.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var map = __webpack_require__(/*! ../internals/iterator-map */ "./node_modules/core-js/internals/iterator-map.js");

var callback = function (value, counter) {
  return [counter, value];
};

// `Iterator.prototype.indexed` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function indexed() {
  return call(map, this, callback);
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterator-map.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/iterator-map.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, [result.value, this.counter++], true);
});

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
module.exports = function map(mapper) {
  anObject(this);
  aCallable(mapper);
  return new IteratorProxy(getIteratorDirect(this), {
    mapper: mapper
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators-core.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/iterators-core.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = !isObject(IteratorPrototype) || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};
else if (IS_PURE) IteratorPrototype = create(IteratorPrototype);

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if (!isCallable(IteratorPrototype[ITERATOR])) {
  defineBuiltIn(IteratorPrototype, ITERATOR, function () {
    return this;
  });
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),

/***/ "./node_modules/core-js/internals/iterators.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/iterators.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/internals/length-of-array-like.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/length-of-array-like.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");

// `LengthOfArrayLike` abstract operation
// https://tc39.es/ecma262/#sec-lengthofarraylike
module.exports = function (obj) {
  return toLength(obj.length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/make-built-in.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/make-built-in.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var CONFIGURABLE_FUNCTION_NAME = (__webpack_require__(/*! ../internals/function-name */ "./node_modules/core-js/internals/function-name.js").CONFIGURABLE);
var inspectSource = __webpack_require__(/*! ../internals/inspect-source */ "./node_modules/core-js/internals/inspect-source.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var $String = String;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var defineProperty = Object.defineProperty;
var stringSlice = uncurryThis(''.slice);
var replace = uncurryThis(''.replace);
var join = uncurryThis([].join);

var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails(function () {
  return defineProperty(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
});

var TEMPLATE = String(String).split('String');

var makeBuiltIn = module.exports = function (value, name, options) {
  if (stringSlice($String(name), 0, 7) === 'Symbol(') {
    name = '[' + replace($String(name), /^Symbol\(([^)]*)\).*$/, '$1') + ']';
  }
  if (options && options.getter) name = 'get ' + name;
  if (options && options.setter) name = 'set ' + name;
  if (!hasOwn(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
    if (DESCRIPTORS) defineProperty(value, 'name', { value: name, configurable: true });
    else value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn(options, 'arity') && value.length !== options.arity) {
    defineProperty(value, 'length', { value: options.arity });
  }
  try {
    if (options && hasOwn(options, 'constructor') && options.constructor) {
      if (DESCRIPTORS) defineProperty(value, 'prototype', { writable: false });
    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
    } else if (value.prototype) value.prototype = undefined;
  } catch (error) { /* empty */ }
  var state = enforceInternalState(value);
  if (!hasOwn(state, 'source')) {
    state.source = join(TEMPLATE, typeof name == 'string' ? name : '');
  } return value;
};

// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
// eslint-disable-next-line no-extend-native -- required
Function.prototype.toString = makeBuiltIn(function toString() {
  return isCallable(this) && getInternalState(this).source || inspectSource(this);
}, 'toString');


/***/ }),

/***/ "./node_modules/core-js/internals/map-helpers.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/map-helpers.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

// eslint-disable-next-line es/no-map -- safe
var MapPrototype = Map.prototype;

module.exports = {
  // eslint-disable-next-line es/no-map -- safe
  Map: Map,
  set: uncurryThis(MapPrototype.set),
  get: uncurryThis(MapPrototype.get),
  has: uncurryThis(MapPrototype.has),
  remove: uncurryThis(MapPrototype['delete']),
  proto: MapPrototype
};


/***/ }),

/***/ "./node_modules/core-js/internals/map-iterate.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/map-iterate.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");

var Map = MapHelpers.Map;
var MapPrototype = MapHelpers.proto;
var forEach = uncurryThis(MapPrototype.forEach);
var entries = uncurryThis(MapPrototype.entries);
var next = entries(new Map()).next;

module.exports = function (map, fn, interruptible) {
  return interruptible ? iterateSimple({ iterator: entries(map), next: next }, function (entry) {
    return fn(entry[1], entry[0]);
  }) : forEach(map, fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/map-upsert.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/map-upsert.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var $TypeError = TypeError;

// `Map.prototype.upsert` method
// https://github.com/tc39/proposal-upsert
module.exports = function upsert(key, updateFn /* , insertFn */) {
  var map = anObject(this);
  var get = aCallable(map.get);
  var has = aCallable(map.has);
  var set = aCallable(map.set);
  var insertFn = arguments.length > 2 ? arguments[2] : undefined;
  var value;
  if (!isCallable(updateFn) && !isCallable(insertFn)) {
    throw new $TypeError('At least one callback required');
  }
  if (call(has, map, key)) {
    value = call(get, map, key);
    if (isCallable(updateFn)) {
      value = updateFn(value);
      call(set, map, key, value);
    }
  } else if (isCallable(insertFn)) {
    value = insertFn();
    call(set, map, key, value);
  } return value;
};


/***/ }),

/***/ "./node_modules/core-js/internals/math-float-round.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/math-float-round.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var sign = __webpack_require__(/*! ../internals/math-sign */ "./node_modules/core-js/internals/math-sign.js");

var abs = Math.abs;

var EPSILON = 2.220446049250313e-16; // Number.EPSILON
var INVERSE_EPSILON = 1 / EPSILON;

var roundTiesToEven = function (n) {
  return n + INVERSE_EPSILON - INVERSE_EPSILON;
};

module.exports = function (x, FLOAT_EPSILON, FLOAT_MAX_VALUE, FLOAT_MIN_VALUE) {
  var n = +x;
  var absolute = abs(n);
  var s = sign(n);
  if (absolute < FLOAT_MIN_VALUE) return s * roundTiesToEven(absolute / FLOAT_MIN_VALUE / FLOAT_EPSILON) * FLOAT_MIN_VALUE * FLOAT_EPSILON;
  var a = (1 + FLOAT_EPSILON / EPSILON) * absolute;
  var result = a - (a - absolute);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (result > FLOAT_MAX_VALUE || result !== result) return s * Infinity;
  return s * result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/math-fround.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/math-fround.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var floatRound = __webpack_require__(/*! ../internals/math-float-round */ "./node_modules/core-js/internals/math-float-round.js");

var FLOAT32_EPSILON = 1.1920928955078125e-7; // 2 ** -23;
var FLOAT32_MAX_VALUE = 3.4028234663852886e+38; // 2 ** 128 - 2 ** 104
var FLOAT32_MIN_VALUE = 1.1754943508222875e-38; // 2 ** -126;

// `Math.fround` method implementation
// https://tc39.es/ecma262/#sec-math.fround
// eslint-disable-next-line es/no-math-fround -- safe
module.exports = Math.fround || function fround(x) {
  return floatRound(x, FLOAT32_EPSILON, FLOAT32_MAX_VALUE, FLOAT32_MIN_VALUE);
};


/***/ }),

/***/ "./node_modules/core-js/internals/math-scale.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-scale.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";

// `Math.scale` method implementation
// https://rwaldron.github.io/proposal-math-extensions/
module.exports = Math.scale || function scale(x, inLow, inHigh, outLow, outHigh) {
  var nx = +x;
  var nInLow = +inLow;
  var nInHigh = +inHigh;
  var nOutLow = +outLow;
  var nOutHigh = +outHigh;
  // eslint-disable-next-line no-self-compare -- NaN check
  if (nx !== nx || nInLow !== nInLow || nInHigh !== nInHigh || nOutLow !== nOutLow || nOutHigh !== nOutHigh) return NaN;
  if (nx === Infinity || nx === -Infinity) return nx;
  return (nx - nInLow) * (nOutHigh - nOutLow) / (nInHigh - nInLow) + nOutLow;
};


/***/ }),

/***/ "./node_modules/core-js/internals/math-sign.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/math-sign.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";

// `Math.sign` method implementation
// https://tc39.es/ecma262/#sec-math.sign
// eslint-disable-next-line es/no-math-sign -- safe
module.exports = Math.sign || function sign(x) {
  var n = +x;
  // eslint-disable-next-line no-self-compare -- NaN check
  return n === 0 || n !== n ? n : n < 0 ? -1 : 1;
};


/***/ }),

/***/ "./node_modules/core-js/internals/math-trunc.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/math-trunc.js ***!
  \******************************************************/
/***/ ((module) => {

"use strict";

var ceil = Math.ceil;
var floor = Math.floor;

// `Math.trunc` method
// https://tc39.es/ecma262/#sec-math.trunc
// eslint-disable-next-line es/no-math-trunc -- safe
module.exports = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};


/***/ }),

/***/ "./node_modules/core-js/internals/new-promise-capability.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/new-promise-capability.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");

var $TypeError = TypeError;

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw new $TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aCallable(resolve);
  this.reject = aCallable(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "./node_modules/core-js/internals/not-a-nan.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/not-a-nan.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";

var $RangeError = RangeError;

module.exports = function (it) {
  // eslint-disable-next-line no-self-compare -- NaN check
  if (it === it) return it;
  throw new $RangeError('NaN is not allowed');
};


/***/ }),

/***/ "./node_modules/core-js/internals/number-is-finite.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/number-is-finite.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.es/ecma262/#sec-number.isfinite
// eslint-disable-next-line es/no-number-isfinite -- safe
module.exports = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};


/***/ }),

/***/ "./node_modules/core-js/internals/numeric-range-iterator.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/numeric-range-iterator.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var INCORRECT_RANGE = 'Incorrect Iterator.range arguments';
var NUMERIC_RANGE_ITERATOR = 'NumericRangeIterator';

var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(NUMERIC_RANGE_ITERATOR);

var $RangeError = RangeError;
var $TypeError = TypeError;

var $RangeIterator = createIteratorConstructor(function NumericRangeIterator(start, end, option, type, zero, one) {
  // TODO: Drop the first `typeof` check after removing legacy methods in `core-js@4`
  if (typeof start != type || (end !== Infinity && end !== -Infinity && typeof end != type)) {
    throw new $TypeError(INCORRECT_RANGE);
  }
  if (start === Infinity || start === -Infinity) {
    throw new $RangeError(INCORRECT_RANGE);
  }
  var ifIncrease = end > start;
  var inclusiveEnd = false;
  var step;
  if (option === undefined) {
    step = undefined;
  } else if (isObject(option)) {
    step = option.step;
    inclusiveEnd = !!option.inclusive;
  } else if (typeof option == type) {
    step = option;
  } else {
    throw new $TypeError(INCORRECT_RANGE);
  }
  if (isNullOrUndefined(step)) {
    step = ifIncrease ? one : -one;
  }
  if (typeof step != type) {
    throw new $TypeError(INCORRECT_RANGE);
  }
  if (step === Infinity || step === -Infinity || (step === zero && start !== end)) {
    throw new $RangeError(INCORRECT_RANGE);
  }
  // eslint-disable-next-line no-self-compare -- NaN check
  var hitsEnd = start !== start || end !== end || step !== step || (end > start) !== (step > zero);
  setInternalState(this, {
    type: NUMERIC_RANGE_ITERATOR,
    start: start,
    end: end,
    step: step,
    inclusive: inclusiveEnd,
    hitsEnd: hitsEnd,
    currentCount: zero,
    zero: zero
  });
  if (!DESCRIPTORS) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.inclusive = inclusiveEnd;
  }
}, NUMERIC_RANGE_ITERATOR, function next() {
  var state = getInternalState(this);
  if (state.hitsEnd) return createIterResultObject(undefined, true);
  var start = state.start;
  var end = state.end;
  var step = state.step;
  var currentYieldingValue = start + (step * state.currentCount++);
  if (currentYieldingValue === end) state.hitsEnd = true;
  var inclusiveEnd = state.inclusive;
  var endCondition;
  if (end > start) {
    endCondition = inclusiveEnd ? currentYieldingValue > end : currentYieldingValue >= end;
  } else {
    endCondition = inclusiveEnd ? end > currentYieldingValue : end >= currentYieldingValue;
  }
  if (endCondition) {
    state.hitsEnd = true;
    return createIterResultObject(undefined, true);
  } return createIterResultObject(currentYieldingValue, false);
});

var addGetter = function (key) {
  defineBuiltInAccessor($RangeIterator.prototype, key, {
    get: function () {
      return getInternalState(this)[key];
    },
    set: function () { /* empty */ },
    configurable: true,
    enumerable: false
  });
};

if (DESCRIPTORS) {
  addGetter('start');
  addGetter('end');
  addGetter('inclusive');
  addGetter('step');
}

module.exports = $RangeIterator;


/***/ }),

/***/ "./node_modules/core-js/internals/object-create.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/object-create.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* global ActiveXObject -- old IE, WSH */
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var definePropertiesModule = __webpack_require__(/*! ../internals/object-define-properties */ "./node_modules/core-js/internals/object-define-properties.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var documentCreateElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = typeof document != 'undefined'
    ? document.domain && activeXDocument
      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
      : NullProtoObjectViaIFrame()
    : NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
// eslint-disable-next-line es/no-object-create -- safe
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : definePropertiesModule.f(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-properties.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-properties.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var definePropertyModule = __webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
exports.f = DESCRIPTORS && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var props = toIndexedObject(Properties);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], props[key]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-define-property.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-define-property.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");
var V8_PROTOTYPE_DEFINE_BUG = __webpack_require__(/*! ../internals/v8-prototype-define-bug */ "./node_modules/core-js/internals/v8-prototype-define-bug.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");

var $TypeError = TypeError;
// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = 'enumerable';
var CONFIGURABLE = 'configurable';
var WRITABLE = 'writable';

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE in Attributes ? Attributes[CONFIGURABLE] : current[CONFIGURABLE],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  } return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw new $TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-descriptor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-descriptor.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var propertyIsEnumerableModule = __webpack_require__(/*! ../internals/object-property-is-enumerable */ "./node_modules/core-js/internals/object-property-is-enumerable.js");
var createPropertyDescriptor = __webpack_require__(/*! ../internals/create-property-descriptor */ "./node_modules/core-js/internals/create-property-descriptor.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var toPropertyKey = __webpack_require__(/*! ../internals/to-property-key */ "./node_modules/core-js/internals/to-property-key.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ../internals/ie8-dom-define */ "./node_modules/core-js/internals/ie8-dom-define.js");

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (hasOwn(O, P)) return createPropertyDescriptor(!call(propertyIsEnumerableModule.f, O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names-external.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names-external.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-object-getownpropertynames -- safe */
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var $getOwnPropertyNames = (__webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js").f);
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return arraySlice(windowNames);
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && classof(it) === 'Window'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-names.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-names.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-own-property-symbols.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-own-property-symbols.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "./node_modules/core-js/internals/object-get-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-get-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var sharedKey = __webpack_require__(/*! ../internals/shared-key */ "./node_modules/core-js/internals/shared-key.js");
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(/*! ../internals/correct-prototype-getter */ "./node_modules/core-js/internals/correct-prototype-getter.js");

var IE_PROTO = sharedKey('IE_PROTO');
var $Object = Object;
var ObjectPrototype = $Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? $Object.getPrototypeOf : function (O) {
  var object = toObject(O);
  if (hasOwn(object, IE_PROTO)) return object[IE_PROTO];
  var constructor = object.constructor;
  if (isCallable(constructor) && object instanceof constructor) {
    return constructor.prototype;
  } return object instanceof $Object ? ObjectPrototype : null;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-extensible.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-extensible.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var classof = __webpack_require__(/*! ../internals/classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var ARRAY_BUFFER_NON_EXTENSIBLE = __webpack_require__(/*! ../internals/array-buffer-non-extensible */ "./node_modules/core-js/internals/array-buffer-non-extensible.js");

// eslint-disable-next-line es/no-object-isextensible -- safe
var $isExtensible = Object.isExtensible;
var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

// `Object.isExtensible` method
// https://tc39.es/ecma262/#sec-object.isextensible
module.exports = (FAILS_ON_PRIMITIVES || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
  if (!isObject(it)) return false;
  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof(it) === 'ArrayBuffer') return false;
  return $isExtensible ? $isExtensible(it) : true;
} : $isExtensible;


/***/ }),

/***/ "./node_modules/core-js/internals/object-is-prototype-of.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-is-prototype-of.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

module.exports = uncurryThis({}.isPrototypeOf);


/***/ }),

/***/ "./node_modules/core-js/internals/object-iterator.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/object-iterator.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var objectKeys = __webpack_require__(/*! ../internals/object-keys */ "./node_modules/core-js/internals/object-keys.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");

var OBJECT_ITERATOR = 'Object Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(OBJECT_ITERATOR);

module.exports = createIteratorConstructor(function ObjectIterator(source, mode) {
  var object = toObject(source);
  setInternalState(this, {
    type: OBJECT_ITERATOR,
    mode: mode,
    object: object,
    keys: objectKeys(object),
    index: 0
  });
}, 'Object', function next() {
  var state = getInternalState(this);
  var keys = state.keys;
  while (true) {
    if (keys === null || state.index >= keys.length) {
      state.object = state.keys = null;
      return createIterResultObject(undefined, true);
    }
    var key = keys[state.index++];
    var object = state.object;
    if (!hasOwn(object, key)) continue;
    switch (state.mode) {
      case 'keys': return createIterResultObject(key, false);
      case 'values': return createIterResultObject(object[key], false);
    } /* entries */ return createIterResultObject([key, object[key]], false);
  }
});


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys-internal.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys-internal.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var toIndexedObject = __webpack_require__(/*! ../internals/to-indexed-object */ "./node_modules/core-js/internals/to-indexed-object.js");
var indexOf = (__webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf);
var hiddenKeys = __webpack_require__(/*! ../internals/hidden-keys */ "./node_modules/core-js/internals/hidden-keys.js");

var push = uncurryThis([].push);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !hasOwn(hiddenKeys, key) && hasOwn(O, key) && push(result, key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (hasOwn(O, key = names[i++])) {
    ~indexOf(result, key) || push(result, key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-keys.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/object-keys.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var internalObjectKeys = __webpack_require__(/*! ../internals/object-keys-internal */ "./node_modules/core-js/internals/object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ../internals/enum-bug-keys */ "./node_modules/core-js/internals/enum-bug-keys.js");

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/internals/object-property-is-enumerable.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/internals/object-property-is-enumerable.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/internals/object-set-prototype-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/object-set-prototype-of.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable no-proto -- safe */
var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js/internals/function-uncurry-this-accessor.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aPossiblePrototype = __webpack_require__(/*! ../internals/a-possible-prototype */ "./node_modules/core-js/internals/a-possible-prototype.js");

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = uncurryThisAccessor(Object.prototype, '__proto__', 'set');
    setter(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),

/***/ "./node_modules/core-js/internals/ordinary-to-primitive.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/ordinary-to-primitive.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var $TypeError = TypeError;

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  if (isCallable(fn = input.valueOf) && !isObject(val = call(fn, input))) return val;
  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = call(fn, input))) return val;
  throw new $TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/internals/own-keys.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/own-keys.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var getOwnPropertyNamesModule = __webpack_require__(/*! ../internals/object-get-own-property-names */ "./node_modules/core-js/internals/object-get-own-property-names.js");
var getOwnPropertySymbolsModule = __webpack_require__(/*! ../internals/object-get-own-property-symbols */ "./node_modules/core-js/internals/object-get-own-property-symbols.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var concat = uncurryThis([].concat);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys, getOwnPropertySymbols(it)) : keys;
};


/***/ }),

/***/ "./node_modules/core-js/internals/path.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/path.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

module.exports = global;


/***/ }),

/***/ "./node_modules/core-js/internals/perform.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/internals/perform.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/reflect-metadata.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/reflect-metadata.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`
__webpack_require__(/*! ../modules/es.map */ "./node_modules/core-js/modules/es.map.js");
__webpack_require__(/*! ../modules/es.weak-map */ "./node_modules/core-js/modules/es.weak-map.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");

var Map = getBuiltIn('Map');
var WeakMap = getBuiltIn('WeakMap');
var push = uncurryThis([].push);

var metadata = shared('metadata');
var store = metadata.store || (metadata.store = new WeakMap());

var getOrCreateMetadataMap = function (target, targetKey, create) {
  var targetMetadata = store.get(target);
  if (!targetMetadata) {
    if (!create) return;
    store.set(target, targetMetadata = new Map());
  }
  var keyMetadata = targetMetadata.get(targetKey);
  if (!keyMetadata) {
    if (!create) return;
    targetMetadata.set(targetKey, keyMetadata = new Map());
  } return keyMetadata;
};

var ordinaryHasOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? false : metadataMap.has(MetadataKey);
};

var ordinaryGetOwnMetadata = function (MetadataKey, O, P) {
  var metadataMap = getOrCreateMetadataMap(O, P, false);
  return metadataMap === undefined ? undefined : metadataMap.get(MetadataKey);
};

var ordinaryDefineOwnMetadata = function (MetadataKey, MetadataValue, O, P) {
  getOrCreateMetadataMap(O, P, true).set(MetadataKey, MetadataValue);
};

var ordinaryOwnMetadataKeys = function (target, targetKey) {
  var metadataMap = getOrCreateMetadataMap(target, targetKey, false);
  var keys = [];
  if (metadataMap) metadataMap.forEach(function (_, key) { push(keys, key); });
  return keys;
};

var toMetadataKey = function (it) {
  return it === undefined || typeof it == 'symbol' ? it : String(it);
};

module.exports = {
  store: store,
  getMap: getOrCreateMetadataMap,
  has: ordinaryHasOwnMetadata,
  get: ordinaryGetOwnMetadata,
  set: ordinaryDefineOwnMetadata,
  keys: ordinaryOwnMetadataKeys,
  toKey: toMetadataKey
};


/***/ }),

/***/ "./node_modules/core-js/internals/require-object-coercible.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/require-object-coercible.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");

var $TypeError = TypeError;

// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (isNullOrUndefined(it)) throw new $TypeError("Can't call method on " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/same-value-zero.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/same-value-zero.js ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";

// `SameValueZero` abstract operation
// https://tc39.es/ecma262/#sec-samevaluezero
module.exports = function (x, y) {
  // eslint-disable-next-line no-self-compare -- NaN check
  return x === y || x !== x && y !== y;
};


/***/ }),

/***/ "./node_modules/core-js/internals/schedulers-fix.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/schedulers-fix.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var ENGINE_IS_BUN = __webpack_require__(/*! ../internals/engine-is-bun */ "./node_modules/core-js/internals/engine-is-bun.js");
var USER_AGENT = __webpack_require__(/*! ../internals/engine-user-agent */ "./node_modules/core-js/internals/engine-user-agent.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js/internals/validate-arguments-length.js");

var Function = global.Function;
// dirty IE9- and Bun 0.3.0- checks
var WRAP = /MSIE .\./.test(USER_AGENT) || ENGINE_IS_BUN && (function () {
  var version = global.Bun.version.split('.');
  return version.length < 3 || version[0] === '0' && (version[1] < 3 || version[1] === '3' && version[2] === '0');
})();

// IE9- / Bun 0.3.0- setTimeout / setInterval / setImmediate additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
// https://github.com/oven-sh/bun/issues/1633
module.exports = function (scheduler, hasTimeArg) {
  var firstParamIndex = hasTimeArg ? 2 : 1;
  return WRAP ? function (handler, timeout /* , ...arguments */) {
    var boundArgs = validateArgumentsLength(arguments.length, 1) > firstParamIndex;
    var fn = isCallable(handler) ? handler : Function(handler);
    var params = boundArgs ? arraySlice(arguments, firstParamIndex) : [];
    var callback = boundArgs ? function () {
      apply(fn, this, params);
    } : fn;
    return hasTimeArg ? scheduler(callback, timeout) : scheduler(callback);
  } : scheduler;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-clone.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/set-clone.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

var Set = SetHelpers.Set;
var add = SetHelpers.add;

module.exports = function (set) {
  var result = new Set();
  iterate(set, function (it) {
    add(result, it);
  });
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-difference.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/set-difference.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var clone = __webpack_require__(/*! ../internals/set-clone */ "./node_modules/core-js/internals/set-clone.js");
var size = __webpack_require__(/*! ../internals/set-size */ "./node_modules/core-js/internals/set-size.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSet = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");

var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function difference(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = clone(O);
  if (size(O) <= otherRec.size) iterateSet(O, function (e) {
    if (otherRec.includes(e)) remove(result, e);
  });
  else iterateSimple(otherRec.getIterator(), function (e) {
    if (has(O, e)) remove(result, e);
  });
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-helpers.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-helpers.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

// eslint-disable-next-line es/no-set -- safe
var SetPrototype = Set.prototype;

module.exports = {
  // eslint-disable-next-line es/no-set -- safe
  Set: Set,
  add: uncurryThis(SetPrototype.add),
  has: uncurryThis(SetPrototype.has),
  remove: uncurryThis(SetPrototype['delete']),
  proto: SetPrototype
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-intersection.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/set-intersection.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var size = __webpack_require__(/*! ../internals/set-size */ "./node_modules/core-js/internals/set-size.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSet = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");

var Set = SetHelpers.Set;
var add = SetHelpers.add;
var has = SetHelpers.has;

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
module.exports = function intersection(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  var result = new Set();

  if (size(O) > otherRec.size) {
    iterateSimple(otherRec.getIterator(), function (e) {
      if (has(O, e)) add(result, e);
    });
  } else {
    iterateSet(O, function (e) {
      if (otherRec.includes(e)) add(result, e);
    });
  }

  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-is-disjoint-from.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/set-is-disjoint-from.js ***!
  \****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var has = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").has);
var size = __webpack_require__(/*! ../internals/set-size */ "./node_modules/core-js/internals/set-size.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSet = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

// `Set.prototype.isDisjointFrom` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isDisjointFrom
module.exports = function isDisjointFrom(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) <= otherRec.size) return iterateSet(O, function (e) {
    if (otherRec.includes(e)) return false;
  }, true) !== false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-is-subset-of.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/set-is-subset-of.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var size = __webpack_require__(/*! ../internals/set-size */ "./node_modules/core-js/internals/set-size.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");

// `Set.prototype.isSubsetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSubsetOf
module.exports = function isSubsetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) > otherRec.size) return false;
  return iterate(O, function (e) {
    if (!otherRec.includes(e)) return false;
  }, true) !== false;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-is-superset-of.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/internals/set-is-superset-of.js ***!
  \**************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var has = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").has);
var size = __webpack_require__(/*! ../internals/set-size */ "./node_modules/core-js/internals/set-size.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");

// `Set.prototype.isSupersetOf` method
// https://tc39.github.io/proposal-set-methods/#Set.prototype.isSupersetOf
module.exports = function isSupersetOf(other) {
  var O = aSet(this);
  var otherRec = getSetRecord(other);
  if (size(O) < otherRec.size) return false;
  var iterator = otherRec.getIterator();
  return iterateSimple(iterator, function (e) {
    if (!has(O, e)) return iteratorClose(iterator, 'normal', false);
  }) !== false;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-iterate.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-iterate.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");

var Set = SetHelpers.Set;
var SetPrototype = SetHelpers.proto;
var forEach = uncurryThis(SetPrototype.forEach);
var keys = uncurryThis(SetPrototype.keys);
var next = keys(new Set()).next;

module.exports = function (set, fn, interruptible) {
  return interruptible ? iterateSimple({ iterator: keys(set), next: next }, fn) : forEach(set, fn);
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-size.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/internals/set-size.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThisAccessor = __webpack_require__(/*! ../internals/function-uncurry-this-accessor */ "./node_modules/core-js/internals/function-uncurry-this-accessor.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");

module.exports = uncurryThisAccessor(SetHelpers.proto, 'size', 'get') || function (set) {
  return set.size;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-species.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/set-species.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineBuiltInAccessor(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-symmetric-difference.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/set-symmetric-difference.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var clone = __webpack_require__(/*! ../internals/set-clone */ "./node_modules/core-js/internals/set-clone.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");

var add = SetHelpers.add;
var has = SetHelpers.has;
var remove = SetHelpers.remove;

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
module.exports = function symmetricDifference(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (e) {
    if (has(O, e)) remove(result, e);
    else add(result, e);
  });
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-to-string-tag.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/set-to-string-tag.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (target, TAG, STATIC) {
  if (target && !STATIC) target = target.prototype;
  if (target && !hasOwn(target, TO_STRING_TAG)) {
    defineProperty(target, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/set-union.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/set-union.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var add = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").add);
var clone = __webpack_require__(/*! ../internals/set-clone */ "./node_modules/core-js/internals/set-clone.js");
var getSetRecord = __webpack_require__(/*! ../internals/get-set-record */ "./node_modules/core-js/internals/get-set-record.js");
var iterateSimple = __webpack_require__(/*! ../internals/iterate-simple */ "./node_modules/core-js/internals/iterate-simple.js");

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
module.exports = function union(other) {
  var O = aSet(this);
  var keysIter = getSetRecord(other).getIterator();
  var result = clone(O);
  iterateSimple(keysIter, function (it) {
    add(result, it);
  });
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-key.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/shared-key.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/internals/shared-store.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/shared-store.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");
var globalThis = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineGlobalProperty = __webpack_require__(/*! ../internals/define-global-property */ "./node_modules/core-js/internals/define-global-property.js");

var SHARED = '__core-js_shared__';
var store = module.exports = globalThis[SHARED] || defineGlobalProperty(SHARED, {});

(store.versions || (store.versions = [])).push({
  version: '3.36.0',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2014-2024 Denis Pushkarev (zloirock.ru)',
  license: 'https://github.com/zloirock/core-js/blob/v3.36.0/LICENSE',
  source: 'https://github.com/zloirock/core-js'
});


/***/ }),

/***/ "./node_modules/core-js/internals/shared.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/internals/shared.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var store = __webpack_require__(/*! ../internals/shared-store */ "./node_modules/core-js/internals/shared-store.js");

module.exports = function (key, value) {
  return store[key] || (store[key] = value || {});
};


/***/ }),

/***/ "./node_modules/core-js/internals/species-constructor.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/species-constructor.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var aConstructor = __webpack_require__(/*! ../internals/a-constructor */ "./node_modules/core-js/internals/a-constructor.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || isNullOrUndefined(S = anObject(C)[SPECIES]) ? defaultConstructor : aConstructor(S);
};


/***/ }),

/***/ "./node_modules/core-js/internals/string-multibyte.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/string-multibyte.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var charAt = uncurryThis(''.charAt);
var charCodeAt = uncurryThis(''.charCodeAt);
var stringSlice = uncurryThis(''.slice);

var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toIntegerOrInfinity(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = charCodeAt(S, position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING
          ? charAt(S, position)
          : first
        : CONVERT_TO_STRING
          ? stringSlice(S, position, position + 2)
          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),

/***/ "./node_modules/core-js/internals/symbol-constructor-detection.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/internals/symbol-constructor-detection.js ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = __webpack_require__(/*! ../internals/engine-v8-version */ "./node_modules/core-js/internals/engine-v8-version.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");

var $String = global.String;

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol('symbol detection');
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  // nb: Do not call `String` directly to avoid this being optimized out to `symbol+''` which will,
  // of course, fail.
  return !$String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});


/***/ }),

/***/ "./node_modules/core-js/internals/task.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/internals/task.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var html = __webpack_require__(/*! ../internals/html */ "./node_modules/core-js/internals/html.js");
var arraySlice = __webpack_require__(/*! ../internals/array-slice */ "./node_modules/core-js/internals/array-slice.js");
var createElement = __webpack_require__(/*! ../internals/document-create-element */ "./node_modules/core-js/internals/document-create-element.js");
var validateArgumentsLength = __webpack_require__(/*! ../internals/validate-arguments-length */ "./node_modules/core-js/internals/validate-arguments-length.js");
var IS_IOS = __webpack_require__(/*! ../internals/engine-is-ios */ "./node_modules/core-js/internals/engine-is-ios.js");
var IS_NODE = __webpack_require__(/*! ../internals/engine-is-node */ "./node_modules/core-js/internals/engine-is-node.js");

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var Dispatch = global.Dispatch;
var Function = global.Function;
var MessageChannel = global.MessageChannel;
var String = global.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var $location, defer, channel, port;

fails(function () {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  $location = global.location;
});

var run = function (id) {
  if (hasOwn(queue, id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var eventListener = function (event) {
  run(event.data);
};

var globalPostMessageDefer = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), $location.protocol + '//' + $location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn = isCallable(handler) ? handler : Function(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function () {
      apply(fn, undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = eventListener;
    defer = bind(port.postMessage, port);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    isCallable(global.postMessage) &&
    !global.importScripts &&
    $location && $location.protocol !== 'file:' &&
    !fails(globalPostMessageDefer)
  ) {
    defer = globalPostMessageDefer;
    global.addEventListener('message', eventListener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-absolute-index.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-absolute-index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toIntegerOrInfinity(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-indexed-object.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/to-indexed-object.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(/*! ../internals/indexed-object */ "./node_modules/core-js/internals/indexed-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-integer-or-infinity.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/internals/to-integer-or-infinity.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var trunc = __webpack_require__(/*! ../internals/math-trunc */ "./node_modules/core-js/internals/math-trunc.js");

// `ToIntegerOrInfinity` abstract operation
// https://tc39.es/ecma262/#sec-tointegerorinfinity
module.exports = function (argument) {
  var number = +argument;
  // eslint-disable-next-line no-self-compare -- NaN check
  return number !== number || number === 0 ? 0 : trunc(number);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-length.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-length.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  var len = toIntegerOrInfinity(argument);
  return len > 0 ? min(len, 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-object.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-object.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");

var $Object = Object;

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return $Object(requireObjectCoercible(argument));
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-positive-integer.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/to-positive-integer.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var $RangeError = RangeError;

module.exports = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw new $RangeError("The argument can't be less than 0");
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-primitive.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/to-primitive.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var ordinaryToPrimitive = __webpack_require__(/*! ../internals/ordinary-to-primitive */ "./node_modules/core-js/internals/ordinary-to-primitive.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $TypeError = TypeError;
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === undefined) pref = 'default';
    result = call(exoticToPrim, input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw new $TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-property-key.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/internals/to-property-key.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPrimitive = __webpack_require__(/*! ../internals/to-primitive */ "./node_modules/core-js/internals/to-primitive.js");
var isSymbol = __webpack_require__(/*! ../internals/is-symbol */ "./node_modules/core-js/internals/is-symbol.js");

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : key + '';
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-set-like.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/to-set-like.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isIterable = __webpack_require__(/*! ../internals/is-iterable */ "./node_modules/core-js/internals/is-iterable.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");

var Set = getBuiltIn('Set');

var isSetLike = function (it) {
  return isObject(it)
    && typeof it.size == 'number'
    && isCallable(it.has)
    && isCallable(it.keys);
};

// fallback old -> new set methods proposal arguments
module.exports = function (it) {
  if (isSetLike(it)) return it;
  return isIterable(it) ? new Set(it) : it;
};


/***/ }),

/***/ "./node_modules/core-js/internals/to-string-tag-support.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/internals/to-string-tag-support.js ***!
  \*****************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),

/***/ "./node_modules/core-js/internals/to-string.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/internals/to-string.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classof = __webpack_require__(/*! ../internals/classof */ "./node_modules/core-js/internals/classof.js");

var $String = String;

module.exports = function (argument) {
  if (classof(argument) === 'Symbol') throw new TypeError('Cannot convert a Symbol value to a string');
  return $String(argument);
};


/***/ }),

/***/ "./node_modules/core-js/internals/try-to-string.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/internals/try-to-string.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";

var $String = String;

module.exports = function (argument) {
  try {
    return $String(argument);
  } catch (error) {
    return 'Object';
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/typed-array-from-species-and-list.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-from-species-and-list.js ***!
  \*****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var arrayFromConstructorAndList = __webpack_require__(/*! ../internals/array-from-constructor-and-list */ "./node_modules/core-js/internals/array-from-constructor-and-list.js");
var typedArraySpeciesConstructor = __webpack_require__(/*! ../internals/typed-array-species-constructor */ "./node_modules/core-js/internals/typed-array-species-constructor.js");

module.exports = function (instance, list) {
  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
};


/***/ }),

/***/ "./node_modules/core-js/internals/typed-array-species-constructor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/internals/typed-array-species-constructor.js ***!
  \***************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var speciesConstructor = __webpack_require__(/*! ../internals/species-constructor */ "./node_modules/core-js/internals/species-constructor.js");

var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
var getTypedArrayConstructor = ArrayBufferViewCore.getTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
module.exports = function (originalArray) {
  return aTypedArrayConstructor(speciesConstructor(originalArray, getTypedArrayConstructor(originalArray)));
};


/***/ }),

/***/ "./node_modules/core-js/internals/uid.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/internals/uid.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

var id = 0;
var postfix = Math.random();
var toString = uncurryThis(1.0.toString);

module.exports = function (key) {
  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
};


/***/ }),

/***/ "./node_modules/core-js/internals/use-symbol-as-uid.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/use-symbol-as-uid.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';


/***/ }),

/***/ "./node_modules/core-js/internals/v8-prototype-define-bug.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/v8-prototype-define-bug.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

// V8 ~ Chrome 36-
// https://bugs.chromium.org/p/v8/issues/detail?id=3334
module.exports = DESCRIPTORS && fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
    value: 42,
    writable: false
  }).prototype !== 42;
});


/***/ }),

/***/ "./node_modules/core-js/internals/validate-arguments-length.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/validate-arguments-length.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";

var $TypeError = TypeError;

module.exports = function (passed, required) {
  if (passed < required) throw new $TypeError('Not enough arguments');
  return passed;
};


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-basic-detection.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-basic-detection.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");

var WeakMap = global.WeakMap;

module.exports = isCallable(WeakMap) && /native code/.test(String(WeakMap));


/***/ }),

/***/ "./node_modules/core-js/internals/weak-map-helpers.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-map-helpers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

// eslint-disable-next-line es/no-weak-map -- safe
var WeakMapPrototype = WeakMap.prototype;

module.exports = {
  // eslint-disable-next-line es/no-weak-map -- safe
  WeakMap: WeakMap,
  set: uncurryThis(WeakMapPrototype.set),
  get: uncurryThis(WeakMapPrototype.get),
  has: uncurryThis(WeakMapPrototype.has),
  remove: uncurryThis(WeakMapPrototype['delete'])
};


/***/ }),

/***/ "./node_modules/core-js/internals/weak-set-helpers.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/internals/weak-set-helpers.js ***!
  \************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");

// eslint-disable-next-line es/no-weak-set -- safe
var WeakSetPrototype = WeakSet.prototype;

module.exports = {
  // eslint-disable-next-line es/no-weak-set -- safe
  WeakSet: WeakSet,
  add: uncurryThis(WeakSetPrototype.add),
  has: uncurryThis(WeakSetPrototype.has),
  remove: uncurryThis(WeakSetPrototype['delete'])
};


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol-define.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol-define.js ***!
  \********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var path = __webpack_require__(/*! ../internals/path */ "./node_modules/core-js/internals/path.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wrappedWellKnownSymbolModule = __webpack_require__(/*! ../internals/well-known-symbol-wrapped */ "./node_modules/core-js/internals/well-known-symbol-wrapped.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!hasOwn(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol-wrapped.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol-wrapped.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

exports.f = wellKnownSymbol;


/***/ }),

/***/ "./node_modules/core-js/internals/well-known-symbol.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/internals/well-known-symbol.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var shared = __webpack_require__(/*! ../internals/shared */ "./node_modules/core-js/internals/shared.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var uid = __webpack_require__(/*! ../internals/uid */ "./node_modules/core-js/internals/uid.js");
var NATIVE_SYMBOL = __webpack_require__(/*! ../internals/symbol-constructor-detection */ "./node_modules/core-js/internals/symbol-constructor-detection.js");
var USE_SYMBOL_AS_UID = __webpack_require__(/*! ../internals/use-symbol-as-uid */ "./node_modules/core-js/internals/use-symbol-as-uid.js");

var Symbol = global.Symbol;
var WellKnownSymbolsStore = shared('wks');
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol['for'] || Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!hasOwn(WellKnownSymbolsStore, name)) {
    WellKnownSymbolsStore[name] = NATIVE_SYMBOL && hasOwn(Symbol, name)
      ? Symbol[name]
      : createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.map.constructor.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.map.constructor.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var collection = __webpack_require__(/*! ../internals/collection */ "./node_modules/core-js/internals/collection.js");
var collectionStrong = __webpack_require__(/*! ../internals/collection-strong */ "./node_modules/core-js/internals/collection-strong.js");

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);


/***/ }),

/***/ "./node_modules/core-js/modules/es.map.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/es.map.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/es.map.constructor */ "./node_modules/core-js/modules/es.map.constructor.js");


/***/ }),

/***/ "./node_modules/core-js/modules/es.weak-map.constructor.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/es.weak-map.constructor.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var FREEZING = __webpack_require__(/*! ../internals/freezing */ "./node_modules/core-js/internals/freezing.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var InternalMetadataModule = __webpack_require__(/*! ../internals/internal-metadata */ "./node_modules/core-js/internals/internal-metadata.js");
var collection = __webpack_require__(/*! ../internals/collection */ "./node_modules/core-js/internals/collection.js");
var collectionWeak = __webpack_require__(/*! ../internals/collection-weak */ "./node_modules/core-js/internals/collection-weak.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var enforceInternalState = (__webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js").enforce);
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var NATIVE_WEAK_MAP = __webpack_require__(/*! ../internals/weak-map-basic-detection */ "./node_modules/core-js/internals/weak-map-basic-detection.js");

var $Object = Object;
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray;
// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = $Object.isExtensible;
// eslint-disable-next-line es/no-object-isfrozen -- safe
var isFrozen = $Object.isFrozen;
// eslint-disable-next-line es/no-object-issealed -- safe
var isSealed = $Object.isSealed;
// eslint-disable-next-line es/no-object-freeze -- safe
var freeze = $Object.freeze;
// eslint-disable-next-line es/no-object-seal -- safe
var seal = $Object.seal;

var IS_IE11 = !global.ActiveXObject && 'ActiveXObject' in global;
var InternalWeakMap;

var wrapper = function (init) {
  return function WeakMap() {
    return init(this, arguments.length ? arguments[0] : undefined);
  };
};

// `WeakMap` constructor
// https://tc39.es/ecma262/#sec-weakmap-constructor
var $WeakMap = collection('WeakMap', wrapper, collectionWeak);
var WeakMapPrototype = $WeakMap.prototype;
var nativeSet = uncurryThis(WeakMapPrototype.set);

// Chakra Edge bug: adding frozen arrays to WeakMap unfreeze them
var hasMSEdgeFreezingBug = function () {
  return FREEZING && fails(function () {
    var frozenArray = freeze([]);
    nativeSet(new $WeakMap(), frozenArray, 1);
    return !isFrozen(frozenArray);
  });
};

// IE11 WeakMap frozen keys fix
// We can't use feature detection because it crash some old IE builds
// https://github.com/zloirock/core-js/issues/485
if (NATIVE_WEAK_MAP) if (IS_IE11) {
  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
  InternalMetadataModule.enable();
  var nativeDelete = uncurryThis(WeakMapPrototype['delete']);
  var nativeHas = uncurryThis(WeakMapPrototype.has);
  var nativeGet = uncurryThis(WeakMapPrototype.get);
  defineBuiltIns(WeakMapPrototype, {
    'delete': function (key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeDelete(this, key) || state.frozen['delete'](key);
      } return nativeDelete(this, key);
    },
    has: function has(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) || state.frozen.has(key);
      } return nativeHas(this, key);
    },
    get: function get(key) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
      } return nativeGet(this, key);
    },
    set: function set(key, value) {
      if (isObject(key) && !isExtensible(key)) {
        var state = enforceInternalState(this);
        if (!state.frozen) state.frozen = new InternalWeakMap();
        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
      } else nativeSet(this, key, value);
      return this;
    }
  });
// Chakra Edge frozen keys fix
} else if (hasMSEdgeFreezingBug()) {
  defineBuiltIns(WeakMapPrototype, {
    set: function set(key, value) {
      var arrayIntegrityLevel;
      if (isArray(key)) {
        if (isFrozen(key)) arrayIntegrityLevel = freeze;
        else if (isSealed(key)) arrayIntegrityLevel = seal;
      }
      nativeSet(this, key, value);
      if (arrayIntegrityLevel) arrayIntegrityLevel(key);
      return this;
    }
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/es.weak-map.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/es.weak-map.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove this module from `core-js@4` since it's replaced to module below
__webpack_require__(/*! ../modules/es.weak-map.constructor */ "./node_modules/core-js/modules/es.weak-map.constructor.js");


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.array.filter-out.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.array.filter-out.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $filterReject = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").filterReject);
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");

// `Array.prototype.filterOut` method
// https://github.com/tc39/proposal-array-filtering
$({ target: 'Array', proto: true, forced: true }, {
  filterOut: function filterOut(callbackfn /* , thisArg */) {
    return $filterReject(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

addToUnscopables('filterOut');


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.array.is-template-object.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.array.is-template-object.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var isArray = __webpack_require__(/*! ../internals/is-array */ "./node_modules/core-js/internals/is-array.js");

// eslint-disable-next-line es/no-object-isfrozen -- safe
var isFrozen = Object.isFrozen;

var isFrozenStringArray = function (array, allowUndefined) {
  if (!isFrozen || !isArray(array) || !isFrozen(array)) return false;
  var index = 0;
  var length = array.length;
  var element;
  while (index < length) {
    element = array[index++];
    if (!(typeof element == 'string' || (allowUndefined && element === undefined))) {
      return false;
    }
  } return length !== 0;
};

// `Array.isTemplateObject` method
// https://github.com/tc39/proposal-array-is-template-object
$({ target: 'Array', stat: true, sham: true, forced: true }, {
  isTemplateObject: function isTemplateObject(value) {
    if (!isFrozenStringArray(value, true)) return false;
    var raw = value.raw;
    return raw.length === value.length && isFrozenStringArray(raw, false);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.array.last-index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.array.last-index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");

// `Array.prototype.lastIndex` getter
// https://github.com/keithamus/proposal-array-last
if (DESCRIPTORS) {
  defineBuiltInAccessor(Array.prototype, 'lastIndex', {
    configurable: true,
    get: function lastIndex() {
      var O = toObject(this);
      var len = lengthOfArrayLike(O);
      return len === 0 ? 0 : len - 1;
    }
  });

  addToUnscopables('lastIndex');
}


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.array.last-item.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.array.last-item.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var lengthOfArrayLike = __webpack_require__(/*! ../internals/length-of-array-like */ "./node_modules/core-js/internals/length-of-array-like.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");

// `Array.prototype.lastIndex` accessor
// https://github.com/keithamus/proposal-array-last
if (DESCRIPTORS) {
  defineBuiltInAccessor(Array.prototype, 'lastItem', {
    configurable: true,
    get: function lastItem() {
      var O = toObject(this);
      var len = lengthOfArrayLike(O);
      return len === 0 ? undefined : O[len - 1];
    },
    set: function lastItem(value) {
      var O = toObject(this);
      var len = lengthOfArrayLike(O);
      return O[len === 0 ? 0 : len - 1] = value;
    }
  });

  addToUnscopables('lastItem');
}


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.array.unique-by.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.array.unique-by.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var uniqueBy = __webpack_require__(/*! ../internals/array-unique-by */ "./node_modules/core-js/internals/array-unique-by.js");

// `Array.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
$({ target: 'Array', proto: true, forced: true }, {
  uniqueBy: uniqueBy
});

addToUnscopables('uniqueBy');


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.as-indexed-pairs.js":
/*!********************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.as-indexed-pairs.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var indexed = __webpack_require__(/*! ../internals/async-iterator-indexed */ "./node_modules/core-js/internals/async-iterator-indexed.js");

// `AsyncIterator.prototype.asIndexedPairs` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'AsyncIterator', name: 'indexed', proto: true, real: true, forced: true }, {
  asIndexedPairs: indexed
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.constructor.js":
/*!***************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.constructor.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var createNonEnumerableProperty = __webpack_require__(/*! ../internals/create-non-enumerable-property */ "./node_modules/core-js/internals/create-non-enumerable-property.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var AsyncIteratorPrototype = __webpack_require__(/*! ../internals/async-iterator-prototype */ "./node_modules/core-js/internals/async-iterator-prototype.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var $TypeError = TypeError;

var AsyncIteratorConstructor = function AsyncIterator() {
  anInstance(this, AsyncIteratorPrototype);
  if (getPrototypeOf(this) === AsyncIteratorPrototype) throw new $TypeError('Abstract class AsyncIterator not directly constructable');
};

AsyncIteratorConstructor.prototype = AsyncIteratorPrototype;

if (!hasOwn(AsyncIteratorPrototype, TO_STRING_TAG)) {
  createNonEnumerableProperty(AsyncIteratorPrototype, TO_STRING_TAG, 'AsyncIterator');
}

if (IS_PURE || !hasOwn(AsyncIteratorPrototype, 'constructor') || AsyncIteratorPrototype.constructor === Object) {
  createNonEnumerableProperty(AsyncIteratorPrototype, 'constructor', AsyncIteratorConstructor);
}

// `AsyncIterator` constructor
// https://github.com/tc39/proposal-async-iterator-helpers
$({ global: true, constructor: true, forced: IS_PURE }, {
  AsyncIterator: AsyncIteratorConstructor
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.drop.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.drop.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var notANaN = __webpack_require__(/*! ../internals/not-a-nan */ "./node_modules/core-js/internals/not-a-nan.js");
var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;

  return new Promise(function (resolve, reject) {
    var doneAndReject = function (error) {
      state.done = true;
      reject(error);
    };

    var loop = function () {
      try {
        Promise.resolve(anObject(call(state.next, state.iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else if (state.remaining) {
              state.remaining--;
              loop();
            } else resolve(createIterResultObject(step.value, false));
          } catch (err) { doneAndReject(err); }
        }, doneAndReject);
      } catch (error) { doneAndReject(error); }
    };

    loop();
  });
});

// `AsyncIterator.prototype.drop` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
  drop: function drop(limit) {
    anObject(this);
    var remaining = toPositiveInteger(notANaN(+limit));
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      remaining: remaining
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.every.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.every.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $every = (__webpack_require__(/*! ../internals/async-iterator-iteration */ "./node_modules/core-js/internals/async-iterator-iteration.js").every);

// `AsyncIterator.prototype.every` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  every: function every(predicate) {
    return $every(this, predicate);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.filter.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.filter.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var closeAsyncIteration = __webpack_require__(/*! ../internals/async-iterator-close */ "./node_modules/core-js/internals/async-iterator-close.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var predicate = state.predicate;

  return new Promise(function (resolve, reject) {
    var doneAndReject = function (error) {
      state.done = true;
      reject(error);
    };

    var ifAbruptCloseAsyncIterator = function (error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };

    var loop = function () {
      try {
        Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else {
              var value = step.value;
              try {
                var result = predicate(value, state.counter++);

                var handler = function (selected) {
                  selected ? resolve(createIterResultObject(value, false)) : loop();
                };

                if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
                else handler(result);
              } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
            }
          } catch (error2) { doneAndReject(error2); }
        }, doneAndReject);
      } catch (error) { doneAndReject(error); }
    };

    loop();
  });
});

// `AsyncIterator.prototype.filter` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
  filter: function filter(predicate) {
    anObject(this);
    aCallable(predicate);
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      predicate: predicate
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.find.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.find.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $find = (__webpack_require__(/*! ../internals/async-iterator-iteration */ "./node_modules/core-js/internals/async-iterator-iteration.js").find);

// `AsyncIterator.prototype.find` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  find: function find(predicate) {
    return $find(this, predicate);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.flat-map.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.flat-map.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var getAsyncIteratorFlattenable = __webpack_require__(/*! ../internals/get-async-iterator-flattenable */ "./node_modules/core-js/internals/get-async-iterator-flattenable.js");
var closeAsyncIteration = __webpack_require__(/*! ../internals/async-iterator-close */ "./node_modules/core-js/internals/async-iterator-close.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var mapper = state.mapper;

  return new Promise(function (resolve, reject) {
    var doneAndReject = function (error) {
      state.done = true;
      reject(error);
    };

    var ifAbruptCloseAsyncIterator = function (error) {
      closeAsyncIteration(iterator, doneAndReject, error, doneAndReject);
    };

    var outerLoop = function () {
      try {
        Promise.resolve(anObject(call(state.next, iterator))).then(function (step) {
          try {
            if (anObject(step).done) {
              state.done = true;
              resolve(createIterResultObject(undefined, true));
            } else {
              var value = step.value;
              try {
                var result = mapper(value, state.counter++);

                var handler = function (mapped) {
                  try {
                    state.inner = getAsyncIteratorFlattenable(mapped);
                    innerLoop();
                  } catch (error4) { ifAbruptCloseAsyncIterator(error4); }
                };

                if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
                else handler(result);
              } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
            }
          } catch (error2) { doneAndReject(error2); }
        }, doneAndReject);
      } catch (error) { doneAndReject(error); }
    };

    var innerLoop = function () {
      var inner = state.inner;
      if (inner) {
        try {
          Promise.resolve(anObject(call(inner.next, inner.iterator))).then(function (result) {
            try {
              if (anObject(result).done) {
                state.inner = null;
                outerLoop();
              } else resolve(createIterResultObject(result.value, false));
            } catch (error1) { ifAbruptCloseAsyncIterator(error1); }
          }, ifAbruptCloseAsyncIterator);
        } catch (error) { ifAbruptCloseAsyncIterator(error); }
      } else outerLoop();
    };

    innerLoop();
  });
});

// `AsyncIterator.prototype.flaMap` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
  flatMap: function flatMap(mapper) {
    anObject(this);
    aCallable(mapper);
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      mapper: mapper,
      inner: null
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.for-each.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.for-each.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $forEach = (__webpack_require__(/*! ../internals/async-iterator-iteration */ "./node_modules/core-js/internals/async-iterator-iteration.js").forEach);

// `AsyncIterator.prototype.forEach` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.from.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.from.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var getAsyncIteratorFlattenable = __webpack_require__(/*! ../internals/get-async-iterator-flattenable */ "./node_modules/core-js/internals/get-async-iterator-flattenable.js");
var AsyncIteratorPrototype = __webpack_require__(/*! ../internals/async-iterator-prototype */ "./node_modules/core-js/internals/async-iterator-prototype.js");
var WrapAsyncIterator = __webpack_require__(/*! ../internals/async-iterator-wrap */ "./node_modules/core-js/internals/async-iterator-wrap.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

// `AsyncIterator.from` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', stat: true, forced: IS_PURE }, {
  from: function from(O) {
    var iteratorRecord = getAsyncIteratorFlattenable(typeof O == 'string' ? toObject(O) : O);
    return isPrototypeOf(AsyncIteratorPrototype, iteratorRecord.iterator)
      ? iteratorRecord.iterator
      : new WrapAsyncIterator(iteratorRecord);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.map.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.map.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var map = __webpack_require__(/*! ../internals/async-iterator-map */ "./node_modules/core-js/internals/async-iterator-map.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

// `AsyncIterator.prototype.map` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
  map: map
});



/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.reduce.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.reduce.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var closeAsyncIteration = __webpack_require__(/*! ../internals/async-iterator-close */ "./node_modules/core-js/internals/async-iterator-close.js");

var Promise = getBuiltIn('Promise');
var $TypeError = TypeError;

// `AsyncIterator.prototype.reduce` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    anObject(this);
    aCallable(reducer);
    var record = getIteratorDirect(this);
    var iterator = record.iterator;
    var next = record.next;
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;

    return new Promise(function (resolve, reject) {
      var ifAbruptCloseAsyncIterator = function (error) {
        closeAsyncIteration(iterator, reject, error, reject);
      };

      var loop = function () {
        try {
          Promise.resolve(anObject(call(next, iterator))).then(function (step) {
            try {
              if (anObject(step).done) {
                noInitial ? reject(new $TypeError('Reduce of empty iterator with no initial value')) : resolve(accumulator);
              } else {
                var value = step.value;
                if (noInitial) {
                  noInitial = false;
                  accumulator = value;
                  loop();
                } else try {
                  var result = reducer(accumulator, value, counter);

                  var handler = function ($result) {
                    accumulator = $result;
                    loop();
                  };

                  if (isObject(result)) Promise.resolve(result).then(handler, ifAbruptCloseAsyncIterator);
                  else handler(result);
                } catch (error3) { ifAbruptCloseAsyncIterator(error3); }
              }
              counter++;
            } catch (error2) { reject(error2); }
          }, reject);
        } catch (error) { reject(error); }
      };

      loop();
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.some.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.some.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $some = (__webpack_require__(/*! ../internals/async-iterator-iteration */ "./node_modules/core-js/internals/async-iterator-iteration.js").some);

// `AsyncIterator.prototype.some` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  some: function some(predicate) {
    return $some(this, predicate);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.take.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.take.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var notANaN = __webpack_require__(/*! ../internals/not-a-nan */ "./node_modules/core-js/internals/not-a-nan.js");
var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");
var createAsyncIteratorProxy = __webpack_require__(/*! ../internals/async-iterator-create-proxy */ "./node_modules/core-js/internals/async-iterator-create-proxy.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var AsyncIteratorProxy = createAsyncIteratorProxy(function (Promise) {
  var state = this;
  var iterator = state.iterator;
  var returnMethod;

  if (!state.remaining--) {
    var resultDone = createIterResultObject(undefined, true);
    state.done = true;
    returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return Promise.resolve(call(returnMethod, iterator, undefined)).then(function () {
        return resultDone;
      });
    }
    return resultDone;
  } return Promise.resolve(call(state.next, iterator)).then(function (step) {
    if (anObject(step).done) {
      state.done = true;
      return createIterResultObject(undefined, true);
    } return createIterResultObject(step.value, false);
  }).then(null, function (error) {
    state.done = true;
    throw error;
  });
});

// `AsyncIterator.prototype.take` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true, forced: IS_PURE }, {
  take: function take(limit) {
    anObject(this);
    var remaining = toPositiveInteger(notANaN(+limit));
    return new AsyncIteratorProxy(getIteratorDirect(this), {
      remaining: remaining
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.async-iterator.to-array.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.async-iterator.to-array.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $toArray = (__webpack_require__(/*! ../internals/async-iterator-iteration */ "./node_modules/core-js/internals/async-iterator-iteration.js").toArray);

// `AsyncIterator.prototype.toArray` method
// https://github.com/tc39/proposal-async-iterator-helpers
$({ target: 'AsyncIterator', proto: true, real: true }, {
  toArray: function toArray() {
    return $toArray(this, undefined, []);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.bigint.range.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.bigint.range.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

/* eslint-disable es/no-bigint -- safe */
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var NumericRangeIterator = __webpack_require__(/*! ../internals/numeric-range-iterator */ "./node_modules/core-js/internals/numeric-range-iterator.js");

// `BigInt.range` method
// https://github.com/tc39/proposal-Number.range
// TODO: Remove from `core-js@4`
if (typeof BigInt == 'function') {
  $({ target: 'BigInt', stat: true, forced: true }, {
    range: function range(start, end, option) {
      return new NumericRangeIterator(start, end, option, 'bigint', BigInt(0), BigInt(1));
    }
  });
}


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.composite-key.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.composite-key.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");
var getCompositeKeyNode = __webpack_require__(/*! ../internals/composite-key */ "./node_modules/core-js/internals/composite-key.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var create = __webpack_require__(/*! ../internals/object-create */ "./node_modules/core-js/internals/object-create.js");

var $Object = Object;

var initializer = function () {
  var freeze = getBuiltIn('Object', 'freeze');
  return freeze ? freeze(create(null)) : create(null);
};

// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
$({ global: true, forced: true }, {
  compositeKey: function compositeKey() {
    return apply(getCompositeKeyNode, $Object, arguments).get('object', initializer);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.composite-symbol.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.composite-symbol.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getCompositeKeyNode = __webpack_require__(/*! ../internals/composite-key */ "./node_modules/core-js/internals/composite-key.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var apply = __webpack_require__(/*! ../internals/function-apply */ "./node_modules/core-js/internals/function-apply.js");

// https://github.com/tc39/proposal-richer-keys/tree/master/compositeKey
$({ global: true, forced: true }, {
  compositeSymbol: function compositeSymbol() {
    if (arguments.length === 1 && typeof arguments[0] == 'string') return getBuiltIn('Symbol')['for'](arguments[0]);
    return apply(getCompositeKeyNode, null, arguments).get('symbol', getBuiltIn('Symbol'));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.as-indexed-pairs.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.as-indexed-pairs.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var indexed = __webpack_require__(/*! ../internals/iterator-indexed */ "./node_modules/core-js/internals/iterator-indexed.js");

// `Iterator.prototype.asIndexedPairs` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', name: 'indexed', proto: true, real: true, forced: true }, {
  asIndexedPairs: indexed
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.constructor.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.constructor.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var hasOwn = __webpack_require__(/*! ../internals/has-own-property */ "./node_modules/core-js/internals/has-own-property.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var CONSTRUCTOR = 'constructor';
var ITERATOR = 'Iterator';
var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var $TypeError = TypeError;
var NativeIterator = global[ITERATOR];

// FF56- have non-standard global helper `Iterator`
var FORCED = IS_PURE
  || !isCallable(NativeIterator)
  || NativeIterator.prototype !== IteratorPrototype
  // FF44- non-standard `Iterator` passes previous tests
  || !fails(function () { NativeIterator({}); });

var IteratorConstructor = function Iterator() {
  anInstance(this, IteratorPrototype);
  if (getPrototypeOf(this) === IteratorPrototype) throw new $TypeError('Abstract class Iterator not directly constructable');
};

var defineIteratorPrototypeAccessor = function (key, value) {
  if (DESCRIPTORS) {
    defineBuiltInAccessor(IteratorPrototype, key, {
      configurable: true,
      get: function () {
        return value;
      },
      set: function (replacement) {
        anObject(this);
        if (this === IteratorPrototype) throw new $TypeError("You can't redefine this property");
        if (hasOwn(this, key)) this[key] = replacement;
        else createProperty(this, key, replacement);
      }
    });
  } else IteratorPrototype[key] = value;
};

if (!hasOwn(IteratorPrototype, TO_STRING_TAG)) defineIteratorPrototypeAccessor(TO_STRING_TAG, ITERATOR);

if (FORCED || !hasOwn(IteratorPrototype, CONSTRUCTOR) || IteratorPrototype[CONSTRUCTOR] === Object) {
  defineIteratorPrototypeAccessor(CONSTRUCTOR, IteratorConstructor);
}

IteratorConstructor.prototype = IteratorPrototype;

// `Iterator` constructor
// https://github.com/tc39/proposal-iterator-helpers
$({ global: true, constructor: true, forced: FORCED }, {
  Iterator: IteratorConstructor
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.drop.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.drop.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var notANaN = __webpack_require__(/*! ../internals/not-a-nan */ "./node_modules/core-js/internals/not-a-nan.js");
var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var next = this.next;
  var result, done;
  while (this.remaining) {
    this.remaining--;
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
  }
  result = anObject(call(next, iterator));
  done = this.done = !!result.done;
  if (!done) return result.value;
});

// `Iterator.prototype.drop` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  drop: function drop(limit) {
    anObject(this);
    var remaining = toPositiveInteger(notANaN(+limit));
    return new IteratorProxy(getIteratorDirect(this), {
      remaining: remaining
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.every.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.every.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

// `Iterator.prototype.every` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  every: function every(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return !iterate(record, function (value, stop) {
      if (!predicate(value, counter++)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.filter.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.filter.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var predicate = this.predicate;
  var next = this.next;
  var result, done, value;
  while (true) {
    result = anObject(call(next, iterator));
    done = this.done = !!result.done;
    if (done) return;
    value = result.value;
    if (callWithSafeIterationClosing(iterator, predicate, [value, this.counter++], true)) return value;
  }
});

// `Iterator.prototype.filter` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  filter: function filter(predicate) {
    anObject(this);
    aCallable(predicate);
    return new IteratorProxy(getIteratorDirect(this), {
      predicate: predicate
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.find.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.find.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

// `Iterator.prototype.find` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  find: function find(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop(value);
    }, { IS_RECORD: true, INTERRUPTED: true }).result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.flat-map.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.flat-map.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var getIteratorFlattenable = __webpack_require__(/*! ../internals/get-iterator-flattenable */ "./node_modules/core-js/internals/get-iterator-flattenable.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  var mapper = this.mapper;
  var result, inner;

  while (true) {
    if (inner = this.inner) try {
      result = anObject(call(inner.next, inner.iterator));
      if (!result.done) return result.value;
      this.inner = null;
    } catch (error) { iteratorClose(iterator, 'throw', error); }

    result = anObject(call(this.next, iterator));

    if (this.done = !!result.done) return;

    try {
      this.inner = getIteratorFlattenable(mapper(result.value, this.counter++), false);
    } catch (error) { iteratorClose(iterator, 'throw', error); }
  }
});

// `Iterator.prototype.flatMap` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  flatMap: function flatMap(mapper) {
    anObject(this);
    aCallable(mapper);
    return new IteratorProxy(getIteratorDirect(this), {
      mapper: mapper,
      inner: null
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.for-each.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.for-each.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

// `Iterator.prototype.forEach` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  forEach: function forEach(fn) {
    anObject(this);
    aCallable(fn);
    var record = getIteratorDirect(this);
    var counter = 0;
    iterate(record, function (value) {
      fn(value, counter++);
    }, { IS_RECORD: true });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.from.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.from.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var isPrototypeOf = __webpack_require__(/*! ../internals/object-is-prototype-of */ "./node_modules/core-js/internals/object-is-prototype-of.js");
var IteratorPrototype = (__webpack_require__(/*! ../internals/iterators-core */ "./node_modules/core-js/internals/iterators-core.js").IteratorPrototype);
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var getIteratorFlattenable = __webpack_require__(/*! ../internals/get-iterator-flattenable */ "./node_modules/core-js/internals/get-iterator-flattenable.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var IteratorProxy = createIteratorProxy(function () {
  return call(this.next, this.iterator);
}, true);

// `Iterator.from` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', stat: true, forced: IS_PURE }, {
  from: function from(O) {
    var iteratorRecord = getIteratorFlattenable(typeof O == 'string' ? toObject(O) : O, true);
    return isPrototypeOf(IteratorPrototype, iteratorRecord.iterator)
      ? iteratorRecord.iterator
      : new IteratorProxy(iteratorRecord);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.map.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.map.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var map = __webpack_require__(/*! ../internals/iterator-map */ "./node_modules/core-js/internals/iterator-map.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

// `Iterator.prototype.map` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  map: map
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.reduce.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.reduce.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

var $TypeError = TypeError;

// `Iterator.prototype.reduce` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  reduce: function reduce(reducer /* , initialValue */) {
    anObject(this);
    aCallable(reducer);
    var record = getIteratorDirect(this);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    var counter = 0;
    iterate(record, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = reducer(accumulator, value, counter);
      }
      counter++;
    }, { IS_RECORD: true });
    if (noInitial) throw new $TypeError('Reduce of empty iterator with no initial value');
    return accumulator;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.some.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.some.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

// `Iterator.prototype.some` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  some: function some(predicate) {
    anObject(this);
    aCallable(predicate);
    var record = getIteratorDirect(this);
    var counter = 0;
    return iterate(record, function (value, stop) {
      if (predicate(value, counter++)) return stop();
    }, { IS_RECORD: true, INTERRUPTED: true }).stopped;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.take.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.take.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");
var notANaN = __webpack_require__(/*! ../internals/not-a-nan */ "./node_modules/core-js/internals/not-a-nan.js");
var toPositiveInteger = __webpack_require__(/*! ../internals/to-positive-integer */ "./node_modules/core-js/internals/to-positive-integer.js");
var createIteratorProxy = __webpack_require__(/*! ../internals/iterator-create-proxy */ "./node_modules/core-js/internals/iterator-create-proxy.js");
var iteratorClose = __webpack_require__(/*! ../internals/iterator-close */ "./node_modules/core-js/internals/iterator-close.js");
var IS_PURE = __webpack_require__(/*! ../internals/is-pure */ "./node_modules/core-js/internals/is-pure.js");

var IteratorProxy = createIteratorProxy(function () {
  var iterator = this.iterator;
  if (!this.remaining--) {
    this.done = true;
    return iteratorClose(iterator, 'normal', undefined);
  }
  var result = anObject(call(this.next, iterator));
  var done = this.done = !!result.done;
  if (!done) return result.value;
});

// `Iterator.prototype.take` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true, forced: IS_PURE }, {
  take: function take(limit) {
    anObject(this);
    var remaining = toPositiveInteger(notANaN(+limit));
    return new IteratorProxy(getIteratorDirect(this), {
      remaining: remaining
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.iterator.to-array.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.iterator.to-array.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var getIteratorDirect = __webpack_require__(/*! ../internals/get-iterator-direct */ "./node_modules/core-js/internals/get-iterator-direct.js");

var push = [].push;

// `Iterator.prototype.toArray` method
// https://github.com/tc39/proposal-iterator-helpers
$({ target: 'Iterator', proto: true, real: true }, {
  toArray: function toArray() {
    var result = [];
    iterate(getIteratorDirect(anObject(this)), push, { that: result, IS_RECORD: true });
    return result;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.delete-all.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.delete-all.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var remove = (__webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js").remove);

// `Map.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  deleteAll: function deleteAll(/* ...elements */) {
    var collection = aMap(this);
    var allDeleted = true;
    var wasDeleted;
    for (var k = 0, len = arguments.length; k < len; k++) {
      wasDeleted = remove(collection, arguments[k]);
      allDeleted = allDeleted && wasDeleted;
    } return !!allDeleted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.emplace.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.emplace.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");

var get = MapHelpers.get;
var has = MapHelpers.has;
var set = MapHelpers.set;

// `Map.prototype.emplace` method
// https://github.com/tc39/proposal-upsert
$({ target: 'Map', proto: true, real: true, forced: true }, {
  emplace: function emplace(key, handler) {
    var map = aMap(this);
    var value, inserted;
    if (has(map, key)) {
      value = get(map, key);
      if ('update' in handler) {
        value = handler.update(value, key, map);
        set(map, key, value);
      } return value;
    }
    inserted = handler.insert(key, map);
    set(map, key, inserted);
    return inserted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.every.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.every.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.every` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  every: function every(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate(map, function (value, key) {
      if (!boundFunction(value, key, map)) return false;
    }, true) !== false;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.filter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

var Map = MapHelpers.Map;
var set = MapHelpers.set;

// `Map.prototype.filter` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  filter: function filter(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new Map();
    iterate(map, function (value, key) {
      if (boundFunction(value, key, map)) set(newMap, key, value);
    });
    return newMap;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.find-key.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.find-key.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.findKey` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  findKey: function findKey(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var result = iterate(map, function (value, key) {
      if (boundFunction(value, key, map)) return { key: key };
    }, true);
    return result && result.key;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.find.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.find.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.find` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  find: function find(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var result = iterate(map, function (value, key) {
      if (boundFunction(value, key, map)) return { value: value };
    }, true);
    return result && result.value;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.from.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.from.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var createCollectionFrom = __webpack_require__(/*! ../internals/collection-from */ "./node_modules/core-js/internals/collection-from.js");

// `Map.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
$({ target: 'Map', stat: true, forced: true }, {
  from: createCollectionFrom(MapHelpers.Map, MapHelpers.set, true)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.includes.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.includes.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var sameValueZero = __webpack_require__(/*! ../internals/same-value-zero */ "./node_modules/core-js/internals/same-value-zero.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.includes` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  includes: function includes(searchElement) {
    return iterate(aMap(this), function (value) {
      if (sameValueZero(value, searchElement)) return true;
    }, true) === true;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.key-by.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.key-by.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var Map = (__webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js").Map);

// `Map.keyBy` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', stat: true, forced: true }, {
  keyBy: function keyBy(iterable, keyDerivative) {
    var C = isCallable(this) ? this : Map;
    var newMap = new C();
    aCallable(keyDerivative);
    var setter = aCallable(newMap.set);
    iterate(iterable, function (element) {
      call(setter, newMap, keyDerivative(element), element);
    });
    return newMap;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.key-of.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.key-of.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.keyOf` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  keyOf: function keyOf(searchElement) {
    var result = iterate(aMap(this), function (value, key) {
      if (value === searchElement) return { key: key };
    }, true);
    return result && result.key;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.map-keys.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.map-keys.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

var Map = MapHelpers.Map;
var set = MapHelpers.set;

// `Map.prototype.mapKeys` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  mapKeys: function mapKeys(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new Map();
    iterate(map, function (value, key) {
      set(newMap, boundFunction(value, key, map), value);
    });
    return newMap;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.map-values.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.map-values.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

var Map = MapHelpers.Map;
var set = MapHelpers.set;

// `Map.prototype.mapValues` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  mapValues: function mapValues(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newMap = new Map();
    iterate(map, function (value, key) {
      set(newMap, key, boundFunction(value, key, map));
    });
    return newMap;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.merge.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.merge.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var set = (__webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js").set);

// `Map.prototype.merge` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, arity: 1, forced: true }, {
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  merge: function merge(iterable /* ...iterables */) {
    var map = aMap(this);
    var argumentsLength = arguments.length;
    var i = 0;
    while (i < argumentsLength) {
      iterate(arguments[i++], function (key, value) {
        set(map, key, value);
      }, { AS_ENTRIES: true });
    }
    return map;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.of.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.of.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");
var createCollectionOf = __webpack_require__(/*! ../internals/collection-of */ "./node_modules/core-js/internals/collection-of.js");

// `Map.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
$({ target: 'Map', stat: true, forced: true }, {
  of: createCollectionOf(MapHelpers.Map, MapHelpers.set, true)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.reduce.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.reduce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

var $TypeError = TypeError;

// `Map.prototype.reduce` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var map = aMap(this);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aCallable(callbackfn);
    iterate(map, function (value, key) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = callbackfn(accumulator, value, key, map);
      }
    });
    if (noInitial) throw new $TypeError('Reduce of empty map with no initial value');
    return accumulator;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.some.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.some.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var iterate = __webpack_require__(/*! ../internals/map-iterate */ "./node_modules/core-js/internals/map-iterate.js");

// `Map.prototype.some` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  some: function some(callbackfn /* , thisArg */) {
    var map = aMap(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate(map, function (value, key) {
      if (boundFunction(value, key, map)) return true;
    }, true) === true;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.update-or-insert.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.update-or-insert.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var upsert = __webpack_require__(/*! ../internals/map-upsert */ "./node_modules/core-js/internals/map-upsert.js");

// `Map.prototype.updateOrInsert` method (replaced by `Map.prototype.emplace`)
// https://github.com/thumbsupep/proposal-upsert
$({ target: 'Map', proto: true, real: true, name: 'upsert', forced: true }, {
  updateOrInsert: upsert
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.update.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.update.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var aMap = __webpack_require__(/*! ../internals/a-map */ "./node_modules/core-js/internals/a-map.js");
var MapHelpers = __webpack_require__(/*! ../internals/map-helpers */ "./node_modules/core-js/internals/map-helpers.js");

var $TypeError = TypeError;
var get = MapHelpers.get;
var has = MapHelpers.has;
var set = MapHelpers.set;

// `Map.prototype.update` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Map', proto: true, real: true, forced: true }, {
  update: function update(key, callback /* , thunk */) {
    var map = aMap(this);
    var length = arguments.length;
    aCallable(callback);
    var isPresentInMap = has(map, key);
    if (!isPresentInMap && length < 3) {
      throw new $TypeError('Updating absent value');
    }
    var value = isPresentInMap ? get(map, key) : aCallable(length > 2 ? arguments[2] : undefined)(key, map);
    set(map, key, callback(value, key, map));
    return map;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.map.upsert.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.map.upsert.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var upsert = __webpack_require__(/*! ../internals/map-upsert */ "./node_modules/core-js/internals/map-upsert.js");

// `Map.prototype.upsert` method (replaced by `Map.prototype.emplace`)
// https://github.com/thumbsupep/proposal-upsert
$({ target: 'Map', proto: true, real: true, forced: true }, {
  upsert: upsert
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.clamp.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.clamp.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

var min = Math.min;
var max = Math.max;

// `Math.clamp` method
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  clamp: function clamp(x, lower, upper) {
    return min(upper, max(lower, x));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.deg-per-rad.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.deg-per-rad.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.DEG_PER_RAD` constant
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
  DEG_PER_RAD: Math.PI / 180
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.degrees.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.degrees.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

var RAD_PER_DEG = 180 / Math.PI;

// `Math.degrees` method
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  degrees: function degrees(radians) {
    return radians * RAD_PER_DEG;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.fscale.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.fscale.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

var scale = __webpack_require__(/*! ../internals/math-scale */ "./node_modules/core-js/internals/math-scale.js");
var fround = __webpack_require__(/*! ../internals/math-fround */ "./node_modules/core-js/internals/math-fround.js");

// `Math.fscale` method
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  fscale: function fscale(x, inLow, inHigh, outLow, outHigh) {
    return fround(scale(x, inLow, inHigh, outLow, outHigh));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.iaddh.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.iaddh.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.iaddh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$({ target: 'Math', stat: true, forced: true }, {
  iaddh: function iaddh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 + (y1 >>> 0) + (($x0 & $y0 | ($x0 | $y0) & ~($x0 + $y0 >>> 0)) >>> 31) | 0;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.imulh.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.imulh.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.imulh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$({ target: 'Math', stat: true, forced: true }, {
  imulh: function imulh(u, v) {
    var UINT16 = 0xFFFF;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >> 16;
    var v1 = $v >> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >> 16);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.isubh.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.isubh.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.isubh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$({ target: 'Math', stat: true, forced: true }, {
  isubh: function isubh(x0, x1, y0, y1) {
    var $x0 = x0 >>> 0;
    var $x1 = x1 >>> 0;
    var $y0 = y0 >>> 0;
    return $x1 - (y1 >>> 0) - ((~$x0 & $y0 | ~($x0 ^ $y0) & $x0 - $y0 >>> 0) >>> 31) | 0;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.rad-per-deg.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.rad-per-deg.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.RAD_PER_DEG` constant
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, nonConfigurable: true, nonWritable: true }, {
  RAD_PER_DEG: 180 / Math.PI
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.radians.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.radians.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

var DEG_PER_RAD = Math.PI / 180;

// `Math.radians` method
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  radians: function radians(degrees) {
    return degrees * DEG_PER_RAD;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.scale.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.scale.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var scale = __webpack_require__(/*! ../internals/math-scale */ "./node_modules/core-js/internals/math-scale.js");

// `Math.scale` method
// https://rwaldron.github.io/proposal-math-extensions/
$({ target: 'Math', stat: true, forced: true }, {
  scale: scale
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.seeded-prng.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.seeded-prng.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var numberIsFinite = __webpack_require__(/*! ../internals/number-is-finite */ "./node_modules/core-js/internals/number-is-finite.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var SEEDED_RANDOM = 'Seeded Random';
var SEEDED_RANDOM_GENERATOR = SEEDED_RANDOM + ' Generator';
var SEED_TYPE_ERROR = 'Math.seededPRNG() argument should have a "seed" field with a finite value.';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SEEDED_RANDOM_GENERATOR);
var $TypeError = TypeError;

var $SeededRandomGenerator = createIteratorConstructor(function SeededRandomGenerator(seed) {
  setInternalState(this, {
    type: SEEDED_RANDOM_GENERATOR,
    seed: seed % 2147483647
  });
}, SEEDED_RANDOM, function next() {
  var state = getInternalState(this);
  var seed = state.seed = (state.seed * 1103515245 + 12345) % 2147483647;
  return createIterResultObject((seed & 1073741823) / 1073741823, false);
});

// `Math.seededPRNG` method
// https://github.com/tc39/proposal-seeded-random
// based on https://github.com/tc39/proposal-seeded-random/blob/78b8258835b57fc2100d076151ab506bc3202ae6/demo.html
$({ target: 'Math', stat: true, forced: true }, {
  seededPRNG: function seededPRNG(it) {
    var seed = anObject(it).seed;
    if (!numberIsFinite(seed)) throw new $TypeError(SEED_TYPE_ERROR);
    return new $SeededRandomGenerator(seed);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.signbit.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.signbit.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.signbit` method
// https://github.com/tc39/proposal-Math.signbit
$({ target: 'Math', stat: true, forced: true }, {
  signbit: function signbit(x) {
    var n = +x;
    // eslint-disable-next-line no-self-compare -- NaN check
    return n === n && n === 0 ? 1 / n === -Infinity : n < 0;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.math.umulh.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.math.umulh.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");

// `Math.umulh` method
// https://gist.github.com/BrendanEich/4294d5c212a6d2254703
// TODO: Remove from `core-js@4`
$({ target: 'Math', stat: true, forced: true }, {
  umulh: function umulh(u, v) {
    var UINT16 = 0xFFFF;
    var $u = +u;
    var $v = +v;
    var u0 = $u & UINT16;
    var v0 = $v & UINT16;
    var u1 = $u >>> 16;
    var v1 = $v >>> 16;
    var t = (u1 * v0 >>> 0) + (u0 * v0 >>> 16);
    return u1 * v1 + (t >>> 16) + ((u0 * v1 >>> 0) + (t & UINT16) >>> 16);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.number.from-string.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.number.from-string.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");

var INVALID_NUMBER_REPRESENTATION = 'Invalid number representation';
var INVALID_RADIX = 'Invalid radix';
var $RangeError = RangeError;
var $SyntaxError = SyntaxError;
var $TypeError = TypeError;
var $parseInt = parseInt;
var pow = Math.pow;
var valid = /^[\d.a-z]+$/;
var charAt = uncurryThis(''.charAt);
var exec = uncurryThis(valid.exec);
var numberToString = uncurryThis(1.0.toString);
var stringSlice = uncurryThis(''.slice);
var split = uncurryThis(''.split);

// `Number.fromString` method
// https://github.com/tc39/proposal-number-fromstring
$({ target: 'Number', stat: true, forced: true }, {
  fromString: function fromString(string, radix) {
    var sign = 1;
    if (typeof string != 'string') throw new $TypeError(INVALID_NUMBER_REPRESENTATION);
    if (!string.length) throw new $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    if (charAt(string, 0) === '-') {
      sign = -1;
      string = stringSlice(string, 1);
      if (!string.length) throw new $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    }
    var R = radix === undefined ? 10 : toIntegerOrInfinity(radix);
    if (R < 2 || R > 36) throw new $RangeError(INVALID_RADIX);
    if (!exec(valid, string)) throw new $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    var parts = split(string, '.');
    var mathNum = $parseInt(parts[0], R);
    if (parts.length > 1) mathNum += $parseInt(parts[1], R) / pow(R, parts[1].length);
    if (R === 10 && numberToString(mathNum, R) !== string) throw new $SyntaxError(INVALID_NUMBER_REPRESENTATION);
    return sign * mathNum;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.number.range.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.number.range.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var NumericRangeIterator = __webpack_require__(/*! ../internals/numeric-range-iterator */ "./node_modules/core-js/internals/numeric-range-iterator.js");

// `Number.range` method
// https://github.com/tc39/proposal-Number.range
// TODO: Remove from `core-js@4`
$({ target: 'Number', stat: true, forced: true }, {
  range: function range(start, end, option) {
    return new NumericRangeIterator(start, end, option, 'number', 0, 1);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.object.iterate-entries.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.object.iterate-entries.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ObjectIterator = __webpack_require__(/*! ../internals/object-iterator */ "./node_modules/core-js/internals/object-iterator.js");

// `Object.iterateEntries` method
// https://github.com/tc39/proposal-object-iteration
$({ target: 'Object', stat: true, forced: true }, {
  iterateEntries: function iterateEntries(object) {
    return new ObjectIterator(object, 'entries');
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.object.iterate-keys.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.object.iterate-keys.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ObjectIterator = __webpack_require__(/*! ../internals/object-iterator */ "./node_modules/core-js/internals/object-iterator.js");

// `Object.iterateKeys` method
// https://github.com/tc39/proposal-object-iteration
$({ target: 'Object', stat: true, forced: true }, {
  iterateKeys: function iterateKeys(object) {
    return new ObjectIterator(object, 'keys');
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.object.iterate-values.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.object.iterate-values.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ObjectIterator = __webpack_require__(/*! ../internals/object-iterator */ "./node_modules/core-js/internals/object-iterator.js");

// `Object.iterateValues` method
// https://github.com/tc39/proposal-object-iteration
$({ target: 'Object', stat: true, forced: true }, {
  iterateValues: function iterateValues(object) {
    return new ObjectIterator(object, 'values');
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.observable.constructor.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.observable.constructor.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// https://github.com/tc39/proposal-observable
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var DESCRIPTORS = __webpack_require__(/*! ../internals/descriptors */ "./node_modules/core-js/internals/descriptors.js");
var setSpecies = __webpack_require__(/*! ../internals/set-species */ "./node_modules/core-js/internals/set-species.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var anInstance = __webpack_require__(/*! ../internals/an-instance */ "./node_modules/core-js/internals/an-instance.js");
var isCallable = __webpack_require__(/*! ../internals/is-callable */ "./node_modules/core-js/internals/is-callable.js");
var isNullOrUndefined = __webpack_require__(/*! ../internals/is-null-or-undefined */ "./node_modules/core-js/internals/is-null-or-undefined.js");
var isObject = __webpack_require__(/*! ../internals/is-object */ "./node_modules/core-js/internals/is-object.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var defineBuiltIn = __webpack_require__(/*! ../internals/define-built-in */ "./node_modules/core-js/internals/define-built-in.js");
var defineBuiltIns = __webpack_require__(/*! ../internals/define-built-ins */ "./node_modules/core-js/internals/define-built-ins.js");
var defineBuiltInAccessor = __webpack_require__(/*! ../internals/define-built-in-accessor */ "./node_modules/core-js/internals/define-built-in-accessor.js");
var hostReportErrors = __webpack_require__(/*! ../internals/host-report-errors */ "./node_modules/core-js/internals/host-report-errors.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");

var $$OBSERVABLE = wellKnownSymbol('observable');
var OBSERVABLE = 'Observable';
var SUBSCRIPTION = 'Subscription';
var SUBSCRIPTION_OBSERVER = 'SubscriptionObserver';
var getterFor = InternalStateModule.getterFor;
var setInternalState = InternalStateModule.set;
var getObservableInternalState = getterFor(OBSERVABLE);
var getSubscriptionInternalState = getterFor(SUBSCRIPTION);
var getSubscriptionObserverInternalState = getterFor(SUBSCRIPTION_OBSERVER);

var SubscriptionState = function (observer) {
  this.observer = anObject(observer);
  this.cleanup = undefined;
  this.subscriptionObserver = undefined;
};

SubscriptionState.prototype = {
  type: SUBSCRIPTION,
  clean: function () {
    var cleanup = this.cleanup;
    if (cleanup) {
      this.cleanup = undefined;
      try {
        cleanup();
      } catch (error) {
        hostReportErrors(error);
      }
    }
  },
  close: function () {
    if (!DESCRIPTORS) {
      var subscription = this.facade;
      var subscriptionObserver = this.subscriptionObserver;
      subscription.closed = true;
      if (subscriptionObserver) subscriptionObserver.closed = true;
    } this.observer = undefined;
  },
  isClosed: function () {
    return this.observer === undefined;
  }
};

var Subscription = function (observer, subscriber) {
  var subscriptionState = setInternalState(this, new SubscriptionState(observer));
  var start;
  if (!DESCRIPTORS) this.closed = false;
  try {
    if (start = getMethod(observer, 'start')) call(start, observer, this);
  } catch (error) {
    hostReportErrors(error);
  }
  if (subscriptionState.isClosed()) return;
  var subscriptionObserver = subscriptionState.subscriptionObserver = new SubscriptionObserver(subscriptionState);
  try {
    var cleanup = subscriber(subscriptionObserver);
    var subscription = cleanup;
    if (!isNullOrUndefined(cleanup)) subscriptionState.cleanup = isCallable(cleanup.unsubscribe)
      ? function () { subscription.unsubscribe(); }
      : aCallable(cleanup);
  } catch (error) {
    subscriptionObserver.error(error);
    return;
  } if (subscriptionState.isClosed()) subscriptionState.clean();
};

Subscription.prototype = defineBuiltIns({}, {
  unsubscribe: function unsubscribe() {
    var subscriptionState = getSubscriptionInternalState(this);
    if (!subscriptionState.isClosed()) {
      subscriptionState.close();
      subscriptionState.clean();
    }
  }
});

if (DESCRIPTORS) defineBuiltInAccessor(Subscription.prototype, 'closed', {
  configurable: true,
  get: function closed() {
    return getSubscriptionInternalState(this).isClosed();
  }
});

var SubscriptionObserver = function (subscriptionState) {
  setInternalState(this, {
    type: SUBSCRIPTION_OBSERVER,
    subscriptionState: subscriptionState
  });
  if (!DESCRIPTORS) this.closed = false;
};

SubscriptionObserver.prototype = defineBuiltIns({}, {
  next: function next(value) {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      try {
        var nextMethod = getMethod(observer, 'next');
        if (nextMethod) call(nextMethod, observer, value);
      } catch (error) {
        hostReportErrors(error);
      }
    }
  },
  error: function error(value) {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      subscriptionState.close();
      try {
        var errorMethod = getMethod(observer, 'error');
        if (errorMethod) call(errorMethod, observer, value);
        else hostReportErrors(value);
      } catch (err) {
        hostReportErrors(err);
      } subscriptionState.clean();
    }
  },
  complete: function complete() {
    var subscriptionState = getSubscriptionObserverInternalState(this).subscriptionState;
    if (!subscriptionState.isClosed()) {
      var observer = subscriptionState.observer;
      subscriptionState.close();
      try {
        var completeMethod = getMethod(observer, 'complete');
        if (completeMethod) call(completeMethod, observer);
      } catch (error) {
        hostReportErrors(error);
      } subscriptionState.clean();
    }
  }
});

if (DESCRIPTORS) defineBuiltInAccessor(SubscriptionObserver.prototype, 'closed', {
  configurable: true,
  get: function closed() {
    return getSubscriptionObserverInternalState(this).subscriptionState.isClosed();
  }
});

var $Observable = function Observable(subscriber) {
  anInstance(this, ObservablePrototype);
  setInternalState(this, {
    type: OBSERVABLE,
    subscriber: aCallable(subscriber)
  });
};

var ObservablePrototype = $Observable.prototype;

defineBuiltIns(ObservablePrototype, {
  subscribe: function subscribe(observer) {
    var length = arguments.length;
    return new Subscription(isCallable(observer) ? {
      next: observer,
      error: length > 1 ? arguments[1] : undefined,
      complete: length > 2 ? arguments[2] : undefined
    } : isObject(observer) ? observer : {}, getObservableInternalState(this).subscriber);
  }
});

defineBuiltIn(ObservablePrototype, $$OBSERVABLE, function () { return this; });

$({ global: true, constructor: true, forced: true }, {
  Observable: $Observable
});

setSpecies(OBSERVABLE);


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.observable.from.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.observable.from.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");
var getIterator = __webpack_require__(/*! ../internals/get-iterator */ "./node_modules/core-js/internals/get-iterator.js");
var getMethod = __webpack_require__(/*! ../internals/get-method */ "./node_modules/core-js/internals/get-method.js");
var iterate = __webpack_require__(/*! ../internals/iterate */ "./node_modules/core-js/internals/iterate.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var $$OBSERVABLE = wellKnownSymbol('observable');

// `Observable.from` method
// https://github.com/tc39/proposal-observable
$({ target: 'Observable', stat: true, forced: true }, {
  from: function from(x) {
    var C = isConstructor(this) ? this : getBuiltIn('Observable');
    var observableMethod = getMethod(anObject(x), $$OBSERVABLE);
    if (observableMethod) {
      var observable = anObject(call(observableMethod, x));
      return observable.constructor === C ? observable : new C(function (observer) {
        return observable.subscribe(observer);
      });
    }
    var iterator = getIterator(x);
    return new C(function (observer) {
      iterate(iterator, function (it, stop) {
        observer.next(it);
        if (observer.closed) return stop();
      }, { IS_ITERATOR: true, INTERRUPTED: true });
      observer.complete();
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.observable.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.observable.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/esnext.observable.constructor */ "./node_modules/core-js/modules/esnext.observable.constructor.js");
__webpack_require__(/*! ../modules/esnext.observable.from */ "./node_modules/core-js/modules/esnext.observable.from.js");
__webpack_require__(/*! ../modules/esnext.observable.of */ "./node_modules/core-js/modules/esnext.observable.of.js");


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.observable.of.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.observable.of.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var getBuiltIn = __webpack_require__(/*! ../internals/get-built-in */ "./node_modules/core-js/internals/get-built-in.js");
var isConstructor = __webpack_require__(/*! ../internals/is-constructor */ "./node_modules/core-js/internals/is-constructor.js");

var Array = getBuiltIn('Array');

// `Observable.of` method
// https://github.com/tc39/proposal-observable
$({ target: 'Observable', stat: true, forced: true }, {
  of: function of() {
    var C = isConstructor(this) ? this : getBuiltIn('Observable');
    var length = arguments.length;
    var items = Array(length);
    var index = 0;
    while (index < length) items[index] = arguments[index++];
    return new C(function (observer) {
      for (var i = 0; i < length; i++) {
        observer.next(items[i]);
        if (observer.closed) return;
      } observer.complete();
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.promise.try.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.promise.try.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var newPromiseCapabilityModule = __webpack_require__(/*! ../internals/new-promise-capability */ "./node_modules/core-js/internals/new-promise-capability.js");
var perform = __webpack_require__(/*! ../internals/perform */ "./node_modules/core-js/internals/perform.js");

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
$({ target: 'Promise', stat: true, forced: true }, {
  'try': function (callbackfn) {
    var promiseCapability = newPromiseCapabilityModule.f(this);
    var result = perform(callbackfn);
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.define-metadata.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.define-metadata.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var toMetadataKey = ReflectMetadataModule.toKey;
var ordinaryDefineOwnMetadata = ReflectMetadataModule.set;

// `Reflect.defineMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  defineMetadata: function defineMetadata(metadataKey, metadataValue, target /* , targetKey */) {
    var targetKey = arguments.length < 4 ? undefined : toMetadataKey(arguments[3]);
    ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.delete-metadata.js":
/*!************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.delete-metadata.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var toMetadataKey = ReflectMetadataModule.toKey;
var getOrCreateMetadataMap = ReflectMetadataModule.getMap;
var store = ReflectMetadataModule.store;

// `Reflect.deleteMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  deleteMetadata: function deleteMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey(arguments[2]);
    var metadataMap = getOrCreateMetadataMap(anObject(target), targetKey, false);
    if (metadataMap === undefined || !metadataMap['delete'](metadataKey)) return false;
    if (metadataMap.size) return true;
    var targetMetadata = store.get(target);
    targetMetadata['delete'](targetKey);
    return !!targetMetadata.size || store['delete'](target);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.get-metadata-keys.js":
/*!**************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.get-metadata-keys.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");
var $arrayUniqueBy = __webpack_require__(/*! ../internals/array-unique-by */ "./node_modules/core-js/internals/array-unique-by.js");

var arrayUniqueBy = uncurryThis($arrayUniqueBy);
var concat = uncurryThis([].concat);
var ordinaryOwnMetadataKeys = ReflectMetadataModule.keys;
var toMetadataKey = ReflectMetadataModule.toKey;

var ordinaryMetadataKeys = function (O, P) {
  var oKeys = ordinaryOwnMetadataKeys(O, P);
  var parent = getPrototypeOf(O);
  if (parent === null) return oKeys;
  var pKeys = ordinaryMetadataKeys(parent, P);
  return pKeys.length ? oKeys.length ? arrayUniqueBy(concat(oKeys, pKeys)) : pKeys : oKeys;
};

// `Reflect.getMetadataKeys` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  getMetadataKeys: function getMetadataKeys(target /* , targetKey */) {
    var targetKey = arguments.length < 2 ? undefined : toMetadataKey(arguments[1]);
    return ordinaryMetadataKeys(anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.get-metadata.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.get-metadata.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");

var ordinaryHasOwnMetadata = ReflectMetadataModule.has;
var ordinaryGetOwnMetadata = ReflectMetadataModule.get;
var toMetadataKey = ReflectMetadataModule.toKey;

var ordinaryGetMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryGetMetadata(MetadataKey, parent, P) : undefined;
};

// `Reflect.getMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  getMetadata: function getMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey(arguments[2]);
    return ordinaryGetMetadata(metadataKey, anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.get-own-metadata-keys.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.get-own-metadata-keys.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var ordinaryOwnMetadataKeys = ReflectMetadataModule.keys;
var toMetadataKey = ReflectMetadataModule.toKey;

// `Reflect.getOwnMetadataKeys` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  getOwnMetadataKeys: function getOwnMetadataKeys(target /* , targetKey */) {
    var targetKey = arguments.length < 2 ? undefined : toMetadataKey(arguments[1]);
    return ordinaryOwnMetadataKeys(anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.get-own-metadata.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.get-own-metadata.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var ordinaryGetOwnMetadata = ReflectMetadataModule.get;
var toMetadataKey = ReflectMetadataModule.toKey;

// `Reflect.getOwnMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  getOwnMetadata: function getOwnMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey(arguments[2]);
    return ordinaryGetOwnMetadata(metadataKey, anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.has-metadata.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.has-metadata.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var getPrototypeOf = __webpack_require__(/*! ../internals/object-get-prototype-of */ "./node_modules/core-js/internals/object-get-prototype-of.js");

var ordinaryHasOwnMetadata = ReflectMetadataModule.has;
var toMetadataKey = ReflectMetadataModule.toKey;

var ordinaryHasMetadata = function (MetadataKey, O, P) {
  var hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
  if (hasOwn) return true;
  var parent = getPrototypeOf(O);
  return parent !== null ? ordinaryHasMetadata(MetadataKey, parent, P) : false;
};

// `Reflect.hasMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  hasMetadata: function hasMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey(arguments[2]);
    return ordinaryHasMetadata(metadataKey, anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.has-own-metadata.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.has-own-metadata.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var ordinaryHasOwnMetadata = ReflectMetadataModule.has;
var toMetadataKey = ReflectMetadataModule.toKey;

// `Reflect.hasOwnMetadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  hasOwnMetadata: function hasOwnMetadata(metadataKey, target /* , targetKey */) {
    var targetKey = arguments.length < 3 ? undefined : toMetadataKey(arguments[2]);
    return ordinaryHasOwnMetadata(metadataKey, anObject(target), targetKey);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.reflect.metadata.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.reflect.metadata.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var ReflectMetadataModule = __webpack_require__(/*! ../internals/reflect-metadata */ "./node_modules/core-js/internals/reflect-metadata.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

var toMetadataKey = ReflectMetadataModule.toKey;
var ordinaryDefineOwnMetadata = ReflectMetadataModule.set;

// `Reflect.metadata` method
// https://github.com/rbuckton/reflect-metadata
$({ target: 'Reflect', stat: true }, {
  metadata: function metadata(metadataKey, metadataValue) {
    return function decorator(target, key) {
      ordinaryDefineOwnMetadata(metadataKey, metadataValue, anObject(target), toMetadataKey(key));
    };
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.add-all.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.add-all.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var add = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").add);

// `Set.prototype.addAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  addAll: function addAll(/* ...elements */) {
    var set = aSet(this);
    for (var k = 0, len = arguments.length; k < len; k++) {
      add(set, arguments[k]);
    } return set;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.delete-all.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.delete-all.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var remove = (__webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js").remove);

// `Set.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  deleteAll: function deleteAll(/* ...elements */) {
    var collection = aSet(this);
    var allDeleted = true;
    var wasDeleted;
    for (var k = 0, len = arguments.length; k < len; k++) {
      wasDeleted = remove(collection, arguments[k]);
      allDeleted = allDeleted && wasDeleted;
    } return !!allDeleted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.difference.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.difference.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $difference = __webpack_require__(/*! ../internals/set-difference */ "./node_modules/core-js/internals/set-difference.js");

// `Set.prototype.difference` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  difference: function difference(other) {
    return call($difference, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.every.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.every.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

// `Set.prototype.every` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  every: function every(callbackfn /* , thisArg */) {
    var set = aSet(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate(set, function (value) {
      if (!boundFunction(value, value, set)) return false;
    }, true) !== false;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.filter.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.filter.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

var Set = SetHelpers.Set;
var add = SetHelpers.add;

// `Set.prototype.filter` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  filter: function filter(callbackfn /* , thisArg */) {
    var set = aSet(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newSet = new Set();
    iterate(set, function (value) {
      if (boundFunction(value, value, set)) add(newSet, value);
    });
    return newSet;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.find.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.find.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

// `Set.prototype.find` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  find: function find(callbackfn /* , thisArg */) {
    var set = aSet(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var result = iterate(set, function (value) {
      if (boundFunction(value, value, set)) return { value: value };
    }, true);
    return result && result.value;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.from.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.from.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var createCollectionFrom = __webpack_require__(/*! ../internals/collection-from */ "./node_modules/core-js/internals/collection-from.js");

// `Set.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.from
$({ target: 'Set', stat: true, forced: true }, {
  from: createCollectionFrom(SetHelpers.Set, SetHelpers.add, false)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.intersection.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.intersection.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $intersection = __webpack_require__(/*! ../internals/set-intersection */ "./node_modules/core-js/internals/set-intersection.js");

// `Set.prototype.intersection` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  intersection: function intersection(other) {
    return call($intersection, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.is-disjoint-from.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.is-disjoint-from.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $isDisjointFrom = __webpack_require__(/*! ../internals/set-is-disjoint-from */ "./node_modules/core-js/internals/set-is-disjoint-from.js");

// `Set.prototype.isDisjointFrom` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  isDisjointFrom: function isDisjointFrom(other) {
    return call($isDisjointFrom, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.is-subset-of.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.is-subset-of.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $isSubsetOf = __webpack_require__(/*! ../internals/set-is-subset-of */ "./node_modules/core-js/internals/set-is-subset-of.js");

// `Set.prototype.isSubsetOf` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  isSubsetOf: function isSubsetOf(other) {
    return call($isSubsetOf, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.is-superset-of.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.is-superset-of.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $isSupersetOf = __webpack_require__(/*! ../internals/set-is-superset-of */ "./node_modules/core-js/internals/set-is-superset-of.js");

// `Set.prototype.isSupersetOf` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  isSupersetOf: function isSupersetOf(other) {
    return call($isSupersetOf, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.join.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.join.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var uncurryThis = __webpack_require__(/*! ../internals/function-uncurry-this */ "./node_modules/core-js/internals/function-uncurry-this.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");

var arrayJoin = uncurryThis([].join);
var push = uncurryThis([].push);

// `Set.prototype.join` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  join: function join(separator) {
    var set = aSet(this);
    var sep = separator === undefined ? ',' : toString(separator);
    var array = [];
    iterate(set, function (value) {
      push(array, value);
    });
    return arrayJoin(array, sep);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.map.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.map.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

var Set = SetHelpers.Set;
var add = SetHelpers.add;

// `Set.prototype.map` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  map: function map(callbackfn /* , thisArg */) {
    var set = aSet(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    var newSet = new Set();
    iterate(set, function (value) {
      add(newSet, boundFunction(value, value, set));
    });
    return newSet;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.of.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.of.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var SetHelpers = __webpack_require__(/*! ../internals/set-helpers */ "./node_modules/core-js/internals/set-helpers.js");
var createCollectionOf = __webpack_require__(/*! ../internals/collection-of */ "./node_modules/core-js/internals/collection-of.js");

// `Set.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-set.of
$({ target: 'Set', stat: true, forced: true }, {
  of: createCollectionOf(SetHelpers.Set, SetHelpers.add, false)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.reduce.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.reduce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aCallable = __webpack_require__(/*! ../internals/a-callable */ "./node_modules/core-js/internals/a-callable.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

var $TypeError = TypeError;

// `Set.prototype.reduce` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var set = aSet(this);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aCallable(callbackfn);
    iterate(set, function (value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = callbackfn(accumulator, value, value, set);
      }
    });
    if (noInitial) throw new $TypeError('Reduce of empty set with no initial value');
    return accumulator;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.some.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.some.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var bind = __webpack_require__(/*! ../internals/function-bind-context */ "./node_modules/core-js/internals/function-bind-context.js");
var aSet = __webpack_require__(/*! ../internals/a-set */ "./node_modules/core-js/internals/a-set.js");
var iterate = __webpack_require__(/*! ../internals/set-iterate */ "./node_modules/core-js/internals/set-iterate.js");

// `Set.prototype.some` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'Set', proto: true, real: true, forced: true }, {
  some: function some(callbackfn /* , thisArg */) {
    var set = aSet(this);
    var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return iterate(set, function (value) {
      if (boundFunction(value, value, set)) return true;
    }, true) === true;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.symmetric-difference.js":
/*!*************************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.symmetric-difference.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $symmetricDifference = __webpack_require__(/*! ../internals/set-symmetric-difference */ "./node_modules/core-js/internals/set-symmetric-difference.js");

// `Set.prototype.symmetricDifference` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  symmetricDifference: function symmetricDifference(other) {
    return call($symmetricDifference, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.set.union.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.set.union.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var call = __webpack_require__(/*! ../internals/function-call */ "./node_modules/core-js/internals/function-call.js");
var toSetLike = __webpack_require__(/*! ../internals/to-set-like */ "./node_modules/core-js/internals/to-set-like.js");
var $union = __webpack_require__(/*! ../internals/set-union */ "./node_modules/core-js/internals/set-union.js");

// `Set.prototype.union` method
// https://github.com/tc39/proposal-set-methods
// TODO: Obsolete version, remove from `core-js@4`
$({ target: 'Set', proto: true, real: true, forced: true }, {
  union: function union(other) {
    return call($union, this, toSetLike(other));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.string.at.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.string.at.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var charAt = (__webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js").charAt);
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var toIntegerOrInfinity = __webpack_require__(/*! ../internals/to-integer-or-infinity */ "./node_modules/core-js/internals/to-integer-or-infinity.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");

// `String.prototype.at` method
// https://github.com/mathiasbynens/String.prototype.at
$({ target: 'String', proto: true, forced: true }, {
  at: function at(index) {
    var S = toString(requireObjectCoercible(this));
    var len = S.length;
    var relativeIndex = toIntegerOrInfinity(index);
    var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
    return (k < 0 || k >= len) ? undefined : charAt(S, k);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.string.code-points.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.string.code-points.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var createIteratorConstructor = __webpack_require__(/*! ../internals/iterator-create-constructor */ "./node_modules/core-js/internals/iterator-create-constructor.js");
var createIterResultObject = __webpack_require__(/*! ../internals/create-iter-result-object */ "./node_modules/core-js/internals/create-iter-result-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var toString = __webpack_require__(/*! ../internals/to-string */ "./node_modules/core-js/internals/to-string.js");
var InternalStateModule = __webpack_require__(/*! ../internals/internal-state */ "./node_modules/core-js/internals/internal-state.js");
var StringMultibyteModule = __webpack_require__(/*! ../internals/string-multibyte */ "./node_modules/core-js/internals/string-multibyte.js");

var codeAt = StringMultibyteModule.codeAt;
var charAt = StringMultibyteModule.charAt;
var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// TODO: unify with String#@@iterator
var $StringIterator = createIteratorConstructor(function StringIterator(string) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: string,
    index: 0
  });
}, 'String', function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return createIterResultObject(undefined, true);
  point = charAt(string, index);
  state.index += point.length;
  return createIterResultObject({ codePoint: codeAt(point, 0), position: index }, false);
});

// `String.prototype.codePoints` method
// https://github.com/tc39/proposal-string-prototype-codepoints
$({ target: 'String', proto: true, forced: true }, {
  codePoints: function codePoints() {
    return new $StringIterator(toString(requireObjectCoercible(this)));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.symbol.async-dispose.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.symbol.async-dispose.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "./node_modules/core-js/internals/well-known-symbol-define.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);

var Symbol = global.Symbol;

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-async-explicit-resource-management
defineWellKnownSymbol('asyncDispose');

if (Symbol) {
  var descriptor = getOwnPropertyDescriptor(Symbol, 'asyncDispose');
  // workaround of NodeJS 20.4 bug
  // https://github.com/nodejs/node/issues/48699
  // and incorrect descriptor from some transpilers and userland helpers
  if (descriptor.enumerable && descriptor.configurable && descriptor.writable) {
    defineProperty(Symbol, 'asyncDispose', { value: descriptor.value, enumerable: false, configurable: false, writable: false });
  }
}


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.symbol.dispose.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.symbol.dispose.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "./node_modules/core-js/internals/well-known-symbol-define.js");
var defineProperty = (__webpack_require__(/*! ../internals/object-define-property */ "./node_modules/core-js/internals/object-define-property.js").f);
var getOwnPropertyDescriptor = (__webpack_require__(/*! ../internals/object-get-own-property-descriptor */ "./node_modules/core-js/internals/object-get-own-property-descriptor.js").f);

var Symbol = global.Symbol;

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-explicit-resource-management
defineWellKnownSymbol('dispose');

if (Symbol) {
  var descriptor = getOwnPropertyDescriptor(Symbol, 'dispose');
  // workaround of NodeJS 20.4 bug
  // https://github.com/nodejs/node/issues/48699
  // and incorrect descriptor from some transpilers and userland helpers
  if (descriptor.enumerable && descriptor.configurable && descriptor.writable) {
    defineProperty(Symbol, 'dispose', { value: descriptor.value, enumerable: false, configurable: false, writable: false });
  }
}


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.symbol.observable.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.symbol.observable.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "./node_modules/core-js/internals/well-known-symbol-define.js");

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.symbol.pattern-match.js":
/*!*********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.symbol.pattern-match.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "./node_modules/core-js/internals/well-known-symbol-define.js");

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.symbol.replace-all.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.symbol.replace-all.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var defineWellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol-define */ "./node_modules/core-js/internals/well-known-symbol-define.js");

defineWellKnownSymbol('replaceAll');


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.typed-array.filter-out.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.typed-array.filter-out.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove from `core-js@4`
var ArrayBufferViewCore = __webpack_require__(/*! ../internals/array-buffer-view-core */ "./node_modules/core-js/internals/array-buffer-view-core.js");
var $filterReject = (__webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").filterReject);
var fromSpeciesAndList = __webpack_require__(/*! ../internals/typed-array-from-species-and-list */ "./node_modules/core-js/internals/typed-array-from-species-and-list.js");

var aTypedArray = ArrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod = ArrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filterOut` method
// https://github.com/tc39/proposal-array-filtering
exportTypedArrayMethod('filterOut', function filterOut(callbackfn /* , thisArg */) {
  var list = $filterReject(aTypedArray(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return fromSpeciesAndList(this, list);
}, true);


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-map.delete-all.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-map.delete-all.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aWeakMap = __webpack_require__(/*! ../internals/a-weak-map */ "./node_modules/core-js/internals/a-weak-map.js");
var remove = (__webpack_require__(/*! ../internals/weak-map-helpers */ "./node_modules/core-js/internals/weak-map-helpers.js").remove);

// `WeakMap.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  deleteAll: function deleteAll(/* ...elements */) {
    var collection = aWeakMap(this);
    var allDeleted = true;
    var wasDeleted;
    for (var k = 0, len = arguments.length; k < len; k++) {
      wasDeleted = remove(collection, arguments[k]);
      allDeleted = allDeleted && wasDeleted;
    } return !!allDeleted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-map.emplace.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-map.emplace.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aWeakMap = __webpack_require__(/*! ../internals/a-weak-map */ "./node_modules/core-js/internals/a-weak-map.js");
var WeakMapHelpers = __webpack_require__(/*! ../internals/weak-map-helpers */ "./node_modules/core-js/internals/weak-map-helpers.js");

var get = WeakMapHelpers.get;
var has = WeakMapHelpers.has;
var set = WeakMapHelpers.set;

// `WeakMap.prototype.emplace` method
// https://github.com/tc39/proposal-upsert
$({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  emplace: function emplace(key, handler) {
    var map = aWeakMap(this);
    var value, inserted;
    if (has(map, key)) {
      value = get(map, key);
      if ('update' in handler) {
        value = handler.update(value, key, map);
        set(map, key, value);
      } return value;
    }
    inserted = handler.insert(key, map);
    set(map, key, inserted);
    return inserted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-map.from.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-map.from.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var WeakMapHelpers = __webpack_require__(/*! ../internals/weak-map-helpers */ "./node_modules/core-js/internals/weak-map-helpers.js");
var createCollectionFrom = __webpack_require__(/*! ../internals/collection-from */ "./node_modules/core-js/internals/collection-from.js");

// `WeakMap.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.from
$({ target: 'WeakMap', stat: true, forced: true }, {
  from: createCollectionFrom(WeakMapHelpers.WeakMap, WeakMapHelpers.set, true)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-map.of.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-map.of.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var WeakMapHelpers = __webpack_require__(/*! ../internals/weak-map-helpers */ "./node_modules/core-js/internals/weak-map-helpers.js");
var createCollectionOf = __webpack_require__(/*! ../internals/collection-of */ "./node_modules/core-js/internals/collection-of.js");

// `WeakMap.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakmap.of
$({ target: 'WeakMap', stat: true, forced: true }, {
  of: createCollectionOf(WeakMapHelpers.WeakMap, WeakMapHelpers.set, true)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-map.upsert.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-map.upsert.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: remove from `core-js@4`
var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var upsert = __webpack_require__(/*! ../internals/map-upsert */ "./node_modules/core-js/internals/map-upsert.js");

// `WeakMap.prototype.upsert` method (replaced by `WeakMap.prototype.emplace`)
// https://github.com/tc39/proposal-upsert
$({ target: 'WeakMap', proto: true, real: true, forced: true }, {
  upsert: upsert
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-set.add-all.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-set.add-all.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aWeakSet = __webpack_require__(/*! ../internals/a-weak-set */ "./node_modules/core-js/internals/a-weak-set.js");
var add = (__webpack_require__(/*! ../internals/weak-set-helpers */ "./node_modules/core-js/internals/weak-set-helpers.js").add);

// `WeakSet.prototype.addAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  addAll: function addAll(/* ...elements */) {
    var set = aWeakSet(this);
    for (var k = 0, len = arguments.length; k < len; k++) {
      add(set, arguments[k]);
    } return set;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-set.delete-all.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-set.delete-all.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var aWeakSet = __webpack_require__(/*! ../internals/a-weak-set */ "./node_modules/core-js/internals/a-weak-set.js");
var remove = (__webpack_require__(/*! ../internals/weak-set-helpers */ "./node_modules/core-js/internals/weak-set-helpers.js").remove);

// `WeakSet.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
$({ target: 'WeakSet', proto: true, real: true, forced: true }, {
  deleteAll: function deleteAll(/* ...elements */) {
    var collection = aWeakSet(this);
    var allDeleted = true;
    var wasDeleted;
    for (var k = 0, len = arguments.length; k < len; k++) {
      wasDeleted = remove(collection, arguments[k]);
      allDeleted = allDeleted && wasDeleted;
    } return !!allDeleted;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-set.from.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-set.from.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var WeakSetHelpers = __webpack_require__(/*! ../internals/weak-set-helpers */ "./node_modules/core-js/internals/weak-set-helpers.js");
var createCollectionFrom = __webpack_require__(/*! ../internals/collection-from */ "./node_modules/core-js/internals/collection-from.js");

// `WeakSet.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.from
$({ target: 'WeakSet', stat: true, forced: true }, {
  from: createCollectionFrom(WeakSetHelpers.WeakSet, WeakSetHelpers.add, false)
});


/***/ }),

/***/ "./node_modules/core-js/modules/esnext.weak-set.of.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/esnext.weak-set.of.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var WeakSetHelpers = __webpack_require__(/*! ../internals/weak-set-helpers */ "./node_modules/core-js/internals/weak-set-helpers.js");
var createCollectionOf = __webpack_require__(/*! ../internals/collection-of */ "./node_modules/core-js/internals/collection-of.js");

// `WeakSet.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-weakset.of
$({ target: 'WeakSet', stat: true, forced: true }, {
  of: createCollectionOf(WeakSetHelpers.WeakSet, WeakSetHelpers.add, false)
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.clear-immediate.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/web.clear-immediate.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var clearImmediate = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js/internals/task.js").clear);

// `clearImmediate` method
// http://w3c.github.io/setImmediate/#si-clearImmediate
$({ global: true, bind: true, enumerable: true, forced: global.clearImmediate !== clearImmediate }, {
  clearImmediate: clearImmediate
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.immediate.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/web.immediate.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// TODO: Remove this module from `core-js@4` since it's split to modules listed below
__webpack_require__(/*! ../modules/web.clear-immediate */ "./node_modules/core-js/modules/web.clear-immediate.js");
__webpack_require__(/*! ../modules/web.set-immediate */ "./node_modules/core-js/modules/web.set-immediate.js");


/***/ }),

/***/ "./node_modules/core-js/modules/web.set-immediate.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/web.set-immediate.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var setTask = (__webpack_require__(/*! ../internals/task */ "./node_modules/core-js/internals/task.js").set);
var schedulersFix = __webpack_require__(/*! ../internals/schedulers-fix */ "./node_modules/core-js/internals/schedulers-fix.js");

// https://github.com/oven-sh/bun/issues/1633
var setImmediate = global.setImmediate ? schedulersFix(setTask, false) : setTask;

// `setImmediate` method
// http://w3c.github.io/setImmediate/#si-setImmediate
$({ global: true, bind: true, enumerable: true, forced: global.setImmediate !== setImmediate }, {
  setImmediate: setImmediate
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!*******************************************!*\
  !*** ./src/js/scripts.babel.generated.js ***!
  \*******************************************/


__webpack_require__(/*! core-js/modules/esnext.array.filter-out.js */ "./node_modules/core-js/modules/esnext.array.filter-out.js");
__webpack_require__(/*! core-js/modules/esnext.array.is-template-object.js */ "./node_modules/core-js/modules/esnext.array.is-template-object.js");
__webpack_require__(/*! core-js/modules/esnext.array.last-index.js */ "./node_modules/core-js/modules/esnext.array.last-index.js");
__webpack_require__(/*! core-js/modules/esnext.array.last-item.js */ "./node_modules/core-js/modules/esnext.array.last-item.js");
__webpack_require__(/*! core-js/modules/esnext.array.unique-by.js */ "./node_modules/core-js/modules/esnext.array.unique-by.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.constructor.js */ "./node_modules/core-js/modules/esnext.async-iterator.constructor.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.as-indexed-pairs.js */ "./node_modules/core-js/modules/esnext.async-iterator.as-indexed-pairs.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.drop.js */ "./node_modules/core-js/modules/esnext.async-iterator.drop.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.every.js */ "./node_modules/core-js/modules/esnext.async-iterator.every.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.filter.js */ "./node_modules/core-js/modules/esnext.async-iterator.filter.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.find.js */ "./node_modules/core-js/modules/esnext.async-iterator.find.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.flat-map.js */ "./node_modules/core-js/modules/esnext.async-iterator.flat-map.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.for-each.js */ "./node_modules/core-js/modules/esnext.async-iterator.for-each.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.from.js */ "./node_modules/core-js/modules/esnext.async-iterator.from.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.map.js */ "./node_modules/core-js/modules/esnext.async-iterator.map.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.reduce.js */ "./node_modules/core-js/modules/esnext.async-iterator.reduce.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.some.js */ "./node_modules/core-js/modules/esnext.async-iterator.some.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.take.js */ "./node_modules/core-js/modules/esnext.async-iterator.take.js");
__webpack_require__(/*! core-js/modules/esnext.async-iterator.to-array.js */ "./node_modules/core-js/modules/esnext.async-iterator.to-array.js");
__webpack_require__(/*! core-js/modules/esnext.bigint.range.js */ "./node_modules/core-js/modules/esnext.bigint.range.js");
__webpack_require__(/*! core-js/modules/esnext.composite-key.js */ "./node_modules/core-js/modules/esnext.composite-key.js");
__webpack_require__(/*! core-js/modules/esnext.composite-symbol.js */ "./node_modules/core-js/modules/esnext.composite-symbol.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.constructor.js */ "./node_modules/core-js/modules/esnext.iterator.constructor.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.as-indexed-pairs.js */ "./node_modules/core-js/modules/esnext.iterator.as-indexed-pairs.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.drop.js */ "./node_modules/core-js/modules/esnext.iterator.drop.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.every.js */ "./node_modules/core-js/modules/esnext.iterator.every.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.filter.js */ "./node_modules/core-js/modules/esnext.iterator.filter.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.find.js */ "./node_modules/core-js/modules/esnext.iterator.find.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.flat-map.js */ "./node_modules/core-js/modules/esnext.iterator.flat-map.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.for-each.js */ "./node_modules/core-js/modules/esnext.iterator.for-each.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.from.js */ "./node_modules/core-js/modules/esnext.iterator.from.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.map.js */ "./node_modules/core-js/modules/esnext.iterator.map.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.reduce.js */ "./node_modules/core-js/modules/esnext.iterator.reduce.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.some.js */ "./node_modules/core-js/modules/esnext.iterator.some.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.take.js */ "./node_modules/core-js/modules/esnext.iterator.take.js");
__webpack_require__(/*! core-js/modules/esnext.iterator.to-array.js */ "./node_modules/core-js/modules/esnext.iterator.to-array.js");
__webpack_require__(/*! core-js/modules/esnext.map.delete-all.js */ "./node_modules/core-js/modules/esnext.map.delete-all.js");
__webpack_require__(/*! core-js/modules/esnext.map.emplace.js */ "./node_modules/core-js/modules/esnext.map.emplace.js");
__webpack_require__(/*! core-js/modules/esnext.map.every.js */ "./node_modules/core-js/modules/esnext.map.every.js");
__webpack_require__(/*! core-js/modules/esnext.map.filter.js */ "./node_modules/core-js/modules/esnext.map.filter.js");
__webpack_require__(/*! core-js/modules/esnext.map.find.js */ "./node_modules/core-js/modules/esnext.map.find.js");
__webpack_require__(/*! core-js/modules/esnext.map.find-key.js */ "./node_modules/core-js/modules/esnext.map.find-key.js");
__webpack_require__(/*! core-js/modules/esnext.map.from.js */ "./node_modules/core-js/modules/esnext.map.from.js");
__webpack_require__(/*! core-js/modules/esnext.map.includes.js */ "./node_modules/core-js/modules/esnext.map.includes.js");
__webpack_require__(/*! core-js/modules/esnext.map.key-by.js */ "./node_modules/core-js/modules/esnext.map.key-by.js");
__webpack_require__(/*! core-js/modules/esnext.map.key-of.js */ "./node_modules/core-js/modules/esnext.map.key-of.js");
__webpack_require__(/*! core-js/modules/esnext.map.map-keys.js */ "./node_modules/core-js/modules/esnext.map.map-keys.js");
__webpack_require__(/*! core-js/modules/esnext.map.map-values.js */ "./node_modules/core-js/modules/esnext.map.map-values.js");
__webpack_require__(/*! core-js/modules/esnext.map.merge.js */ "./node_modules/core-js/modules/esnext.map.merge.js");
__webpack_require__(/*! core-js/modules/esnext.map.of.js */ "./node_modules/core-js/modules/esnext.map.of.js");
__webpack_require__(/*! core-js/modules/esnext.map.reduce.js */ "./node_modules/core-js/modules/esnext.map.reduce.js");
__webpack_require__(/*! core-js/modules/esnext.map.some.js */ "./node_modules/core-js/modules/esnext.map.some.js");
__webpack_require__(/*! core-js/modules/esnext.map.update.js */ "./node_modules/core-js/modules/esnext.map.update.js");
__webpack_require__(/*! core-js/modules/esnext.map.update-or-insert.js */ "./node_modules/core-js/modules/esnext.map.update-or-insert.js");
__webpack_require__(/*! core-js/modules/esnext.map.upsert.js */ "./node_modules/core-js/modules/esnext.map.upsert.js");
__webpack_require__(/*! core-js/modules/esnext.math.clamp.js */ "./node_modules/core-js/modules/esnext.math.clamp.js");
__webpack_require__(/*! core-js/modules/esnext.math.deg-per-rad.js */ "./node_modules/core-js/modules/esnext.math.deg-per-rad.js");
__webpack_require__(/*! core-js/modules/esnext.math.degrees.js */ "./node_modules/core-js/modules/esnext.math.degrees.js");
__webpack_require__(/*! core-js/modules/esnext.math.fscale.js */ "./node_modules/core-js/modules/esnext.math.fscale.js");
__webpack_require__(/*! core-js/modules/esnext.math.iaddh.js */ "./node_modules/core-js/modules/esnext.math.iaddh.js");
__webpack_require__(/*! core-js/modules/esnext.math.imulh.js */ "./node_modules/core-js/modules/esnext.math.imulh.js");
__webpack_require__(/*! core-js/modules/esnext.math.isubh.js */ "./node_modules/core-js/modules/esnext.math.isubh.js");
__webpack_require__(/*! core-js/modules/esnext.math.rad-per-deg.js */ "./node_modules/core-js/modules/esnext.math.rad-per-deg.js");
__webpack_require__(/*! core-js/modules/esnext.math.radians.js */ "./node_modules/core-js/modules/esnext.math.radians.js");
__webpack_require__(/*! core-js/modules/esnext.math.scale.js */ "./node_modules/core-js/modules/esnext.math.scale.js");
__webpack_require__(/*! core-js/modules/esnext.math.seeded-prng.js */ "./node_modules/core-js/modules/esnext.math.seeded-prng.js");
__webpack_require__(/*! core-js/modules/esnext.math.signbit.js */ "./node_modules/core-js/modules/esnext.math.signbit.js");
__webpack_require__(/*! core-js/modules/esnext.math.umulh.js */ "./node_modules/core-js/modules/esnext.math.umulh.js");
__webpack_require__(/*! core-js/modules/esnext.number.from-string.js */ "./node_modules/core-js/modules/esnext.number.from-string.js");
__webpack_require__(/*! core-js/modules/esnext.number.range.js */ "./node_modules/core-js/modules/esnext.number.range.js");
__webpack_require__(/*! core-js/modules/esnext.object.iterate-entries.js */ "./node_modules/core-js/modules/esnext.object.iterate-entries.js");
__webpack_require__(/*! core-js/modules/esnext.object.iterate-keys.js */ "./node_modules/core-js/modules/esnext.object.iterate-keys.js");
__webpack_require__(/*! core-js/modules/esnext.object.iterate-values.js */ "./node_modules/core-js/modules/esnext.object.iterate-values.js");
__webpack_require__(/*! core-js/modules/esnext.observable.js */ "./node_modules/core-js/modules/esnext.observable.js");
__webpack_require__(/*! core-js/modules/esnext.promise.try.js */ "./node_modules/core-js/modules/esnext.promise.try.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.define-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.define-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.delete-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.delete-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.get-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.get-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.get-metadata-keys.js */ "./node_modules/core-js/modules/esnext.reflect.get-metadata-keys.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.get-own-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.get-own-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.get-own-metadata-keys.js */ "./node_modules/core-js/modules/esnext.reflect.get-own-metadata-keys.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.has-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.has-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.has-own-metadata.js */ "./node_modules/core-js/modules/esnext.reflect.has-own-metadata.js");
__webpack_require__(/*! core-js/modules/esnext.reflect.metadata.js */ "./node_modules/core-js/modules/esnext.reflect.metadata.js");
__webpack_require__(/*! core-js/modules/esnext.set.add-all.js */ "./node_modules/core-js/modules/esnext.set.add-all.js");
__webpack_require__(/*! core-js/modules/esnext.set.delete-all.js */ "./node_modules/core-js/modules/esnext.set.delete-all.js");
__webpack_require__(/*! core-js/modules/esnext.set.difference.js */ "./node_modules/core-js/modules/esnext.set.difference.js");
__webpack_require__(/*! core-js/modules/esnext.set.every.js */ "./node_modules/core-js/modules/esnext.set.every.js");
__webpack_require__(/*! core-js/modules/esnext.set.filter.js */ "./node_modules/core-js/modules/esnext.set.filter.js");
__webpack_require__(/*! core-js/modules/esnext.set.find.js */ "./node_modules/core-js/modules/esnext.set.find.js");
__webpack_require__(/*! core-js/modules/esnext.set.from.js */ "./node_modules/core-js/modules/esnext.set.from.js");
__webpack_require__(/*! core-js/modules/esnext.set.intersection.js */ "./node_modules/core-js/modules/esnext.set.intersection.js");
__webpack_require__(/*! core-js/modules/esnext.set.is-disjoint-from.js */ "./node_modules/core-js/modules/esnext.set.is-disjoint-from.js");
__webpack_require__(/*! core-js/modules/esnext.set.is-subset-of.js */ "./node_modules/core-js/modules/esnext.set.is-subset-of.js");
__webpack_require__(/*! core-js/modules/esnext.set.is-superset-of.js */ "./node_modules/core-js/modules/esnext.set.is-superset-of.js");
__webpack_require__(/*! core-js/modules/esnext.set.join.js */ "./node_modules/core-js/modules/esnext.set.join.js");
__webpack_require__(/*! core-js/modules/esnext.set.map.js */ "./node_modules/core-js/modules/esnext.set.map.js");
__webpack_require__(/*! core-js/modules/esnext.set.of.js */ "./node_modules/core-js/modules/esnext.set.of.js");
__webpack_require__(/*! core-js/modules/esnext.set.reduce.js */ "./node_modules/core-js/modules/esnext.set.reduce.js");
__webpack_require__(/*! core-js/modules/esnext.set.some.js */ "./node_modules/core-js/modules/esnext.set.some.js");
__webpack_require__(/*! core-js/modules/esnext.set.symmetric-difference.js */ "./node_modules/core-js/modules/esnext.set.symmetric-difference.js");
__webpack_require__(/*! core-js/modules/esnext.set.union.js */ "./node_modules/core-js/modules/esnext.set.union.js");
__webpack_require__(/*! core-js/modules/esnext.string.at.js */ "./node_modules/core-js/modules/esnext.string.at.js");
__webpack_require__(/*! core-js/modules/esnext.string.code-points.js */ "./node_modules/core-js/modules/esnext.string.code-points.js");
__webpack_require__(/*! core-js/modules/esnext.symbol.async-dispose.js */ "./node_modules/core-js/modules/esnext.symbol.async-dispose.js");
__webpack_require__(/*! core-js/modules/esnext.symbol.dispose.js */ "./node_modules/core-js/modules/esnext.symbol.dispose.js");
__webpack_require__(/*! core-js/modules/esnext.symbol.observable.js */ "./node_modules/core-js/modules/esnext.symbol.observable.js");
__webpack_require__(/*! core-js/modules/esnext.symbol.pattern-match.js */ "./node_modules/core-js/modules/esnext.symbol.pattern-match.js");
__webpack_require__(/*! core-js/modules/esnext.symbol.replace-all.js */ "./node_modules/core-js/modules/esnext.symbol.replace-all.js");
__webpack_require__(/*! core-js/modules/esnext.typed-array.filter-out.js */ "./node_modules/core-js/modules/esnext.typed-array.filter-out.js");
__webpack_require__(/*! core-js/modules/esnext.weak-map.delete-all.js */ "./node_modules/core-js/modules/esnext.weak-map.delete-all.js");
__webpack_require__(/*! core-js/modules/esnext.weak-map.from.js */ "./node_modules/core-js/modules/esnext.weak-map.from.js");
__webpack_require__(/*! core-js/modules/esnext.weak-map.of.js */ "./node_modules/core-js/modules/esnext.weak-map.of.js");
__webpack_require__(/*! core-js/modules/esnext.weak-map.emplace.js */ "./node_modules/core-js/modules/esnext.weak-map.emplace.js");
__webpack_require__(/*! core-js/modules/esnext.weak-map.upsert.js */ "./node_modules/core-js/modules/esnext.weak-map.upsert.js");
__webpack_require__(/*! core-js/modules/esnext.weak-set.add-all.js */ "./node_modules/core-js/modules/esnext.weak-set.add-all.js");
__webpack_require__(/*! core-js/modules/esnext.weak-set.delete-all.js */ "./node_modules/core-js/modules/esnext.weak-set.delete-all.js");
__webpack_require__(/*! core-js/modules/esnext.weak-set.from.js */ "./node_modules/core-js/modules/esnext.weak-set.from.js");
__webpack_require__(/*! core-js/modules/esnext.weak-set.of.js */ "./node_modules/core-js/modules/esnext.weak-set.of.js");
__webpack_require__(/*! core-js/modules/web.immediate.js */ "./node_modules/core-js/modules/web.immediate.js");
var jsCookies = _interopRequireWildcard(__webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/src/js.cookie.js"));
var _frontend = __webpack_require__(/*! @ministryofjustice/frontend */ "./node_modules/@ministryofjustice/frontend/moj/all.bundle.js");
var _ga = _interopRequireDefault(__webpack_require__(/*! ../modules/ga */ "./src/modules/ga/index.js"));
var _autocomplete = _interopRequireDefault(__webpack_require__(/*! ../modules/autocomplete/autocomplete */ "./src/modules/autocomplete/autocomplete.js"));
var _cookieBanner = _interopRequireDefault(__webpack_require__(/*! ../modules/cookie-banner */ "./src/modules/cookie-banner/index.js"));
var _cookiePreference = _interopRequireDefault(__webpack_require__(/*! ../modules/cookie-preference */ "./src/modules/cookie-preference/index.js"));
var _modalTimeout = _interopRequireDefault(__webpack_require__(/*! ../modules/modal-timeout */ "./src/modules/modal-timeout/index.js"));
var _newWindowAnchors = _interopRequireDefault(__webpack_require__(/*! ../modules/new-window-anchors */ "./src/modules/new-window-anchors/index.js"));
var _postcodeLookup = _interopRequireDefault(__webpack_require__(/*! ../modules/postcode-lookup */ "./src/modules/postcode-lookup/index.js"));
var _govukOneLoginServiceHeader = _interopRequireDefault(__webpack_require__(/*! ../modules/govuk-one-login-service-header */ "./src/modules/govuk-one-login-service-header/index.js"));
var _msToMinutesAndSeconds = _interopRequireDefault(__webpack_require__(/*! ../modules/modal-timeout/utils/msToMinutesAndSeconds */ "./src/modules/modal-timeout/utils/msToMinutesAndSeconds/index.js"));
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
function _getRequireWildcardCache(e) {
  if ("function" != typeof WeakMap) return null;
  var r = new WeakMap(),
    t = new WeakMap();
  return (_getRequireWildcardCache = function (e) {
    return e ? t : r;
  })(e);
}
function _interopRequireWildcard(e, r) {
  if (!r && e && e.__esModule) return e;
  if (null === e || "object" != typeof e && "function" != typeof e) return {
    default: e
  };
  var t = _getRequireWildcardCache(r);
  if (t && t.has(e)) return t.get(e);
  var n = {
      __proto__: null
    },
    a = Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) {
    var i = a ? Object.getOwnPropertyDescriptor(e, u) : null;
    i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u];
  }
  return n.default = e, t && t.set(e, n), n;
}
// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies

// eslint-disable-next-line import/no-extraneous-dependencies

(() => {
  const autocomplete = (0, _autocomplete.default)(window);
  autocomplete.init('.govuk-select');
  const postcodeLookup = (0, _postcodeLookup.default)(window);
  postcodeLookup.init();
  const cookiePreference = (0, _cookiePreference.default)('_prefs', ['essential', 'analytics']);
  if (cookiePreference.get('analytics').value === '1') {
    const cicaGa = (0, _ga.default)(window);
    cicaGa.init();
  } else {
    window[`ga-disable-${window.CICA.ANALYTICS_TRACKING_ID}`] = true;
  }
  const cookieBanner = (0, _cookieBanner.default)(window, cookiePreference, {
    cookieBannerElement: '#cookie-banner',
    cookieBannerVisibleClass: 'cookie-banner--visible',
    cookieBannerButtonAcceptAll: '#cookie-banner-accept-all'
  });
  cookieBanner.show();
  (0, _govukOneLoginServiceHeader.default)(window);

  /* ****************************************** */
  /* ** MODAL + TIMEOUT IMPLEMENTATION START ** */
  /* ****************************************** */

  async function modalTimout() {
    const modalElements = window.document.querySelectorAll('[data-module~="govuk-modal"]');
    let sessionEndedModal;
    let errorModal;
    let sessionTimingOutModal;
    const eventHandlers = {};
    let documentVisible = true;
    let sessionData;
    function getSessionData() {
      return JSON.parse(jsCookies.get('sessionExpiry') || '{}');
    }
    async function refreshSessionAndModalTimeout() {
      const response = await fetch('/session/keep-alive');
      const responseJson = await response.json(); // Fetch doesn't parse the data by default like axios did
      sessionData = responseJson.data[0].attributes;
      sessionTimingOutModal.close();
      sessionTimingOutModal.refresh({
        startTime: sessionData.created
      });
    }
    function checkShouldOpenModal() {
      if (!sessionTimingOutModal.isOpen && documentVisible &&
      // session hasn't already ended. Avoids the modal opening
      // when a user blurs and focuses a tab after the session
      // has ended.
      Date.now() < sessionData.expires &&
      // session is nearing its end.
      sessionTimingOutModal.timer.timeRemaining < sessionData.duration / 6) {
        sessionTimingOutModal.open();
      }
    }
    if (modalElements.length) {
      sessionData = getSessionData();
      const sessionAlive = sessionData && sessionData.alive;

      // haven't hit `/apply` yet, or the application is completed
      // there is no session expiry cookie
      if (!sessionAlive || sessionAlive === 'timed-out') {
        return;
      }
      window.document.addEventListener('visibilitychange', () => {
        documentVisible = window.document.visibilityState === 'visible';
        if (documentVisible) {
          sessionData = getSessionData();
          checkShouldOpenModal();
        }
      });
      const TimeoutModal = (0, _modalTimeout.default)(window);
      sessionEndedModal = new TimeoutModal({
        element: '#govuk-modal-session-ended',
        closeElement: '.govuk-modal__close',
        onOpen: () => {
          window.gtag('event', 'open', {
            event_category: 'govuk-modal-session-ended',
            non_interaction: true
          });
        }
      });
      errorModal = new TimeoutModal({
        element: '#govuk-modal-session-resume-error',
        closeElement: '.govuk-modal__close',
        onOpen: () => {
          window.gtag('event', 'open', {
            event_category: '#govuk-modal-session-resume-error',
            non_interaction: true
          });
        }
      });
      sessionTimingOutModal = new TimeoutModal({
        element: '#govuk-modal-session-timing-out',
        resumeElement: '.govuk-modal__continue',
        // openIn: Math.floor((sessionData.duration * (1 / 4)) / 1000) * 1000,
        onBeforeOpen: () => {
          // if a user opens a new tab with another instance of `/apply` the
          // session will have been refreshed. Because of this the timeout modal
          // will open prematurely due to it working from a previously-set session
          // update date. check if the timers end time is less than the actual
          // session end time and calibrate the timeout to open the modal
          // accordingly.
          sessionData = getSessionData();
          const expectedEndTime = sessionTimingOutModal.timer.endTime;
          const actualEndTime = sessionData.expires;
          if (expectedEndTime < actualEndTime) {
            const now = Date.now();
            sessionTimingOutModal.close();
            sessionTimingOutModal.refresh({
              startTime: now,
              duration: sessionData.expires - now
            });
            return false;
          }
          return true;
        },
        onOpen: () => {
          window.gtag('event', 'open', {
            event_category: 'govuk-modal-session-timing-out',
            non_interaction: true
          });
          if (!eventHandlers.onOpenResumeElement) {
            const resumeElement = sessionTimingOutModal.config.element.querySelector('.govuk-modal__continue');
            eventHandlers.onOpenResumeElement = {
              element: resumeElement,
              handler: e => {
                e.preventDefault();
                refreshSessionAndModalTimeout().catch(() => {
                  errorModal.open();
                });
              }
            };
          }
          eventHandlers.onOpenResumeElement.element.addEventListener('click', eventHandlers.onOpenResumeElement.handler);
        },
        onClose: () => {
          eventHandlers.onOpenResumeElement.element.removeEventListener('click', eventHandlers.onOpenResumeElement.handler);
        },
        timer: {
          duration: sessionData.duration,
          startTime: new Date(sessionData.created) * 1,
          interval: 700,
          onTick: timeRemaining => {
            if (!documentVisible) {
              return;
            }
            // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
            // aria-live="assertive" is an attribute of the span that contains the time remaining.
            // Only update the DOM when the modal is actually visible. This will prevent screen
            // readers from announcing every single DOM update that happens in the "background".
            if (sessionTimingOutModal.isOpen) {
              sessionTimingOutModal.content(title => {
                const titleElement = title;
                const timeRemainingElement = titleElement.querySelector('.govuk-modal__time-remaining');
                timeRemainingElement.innerHTML = (0, _msToMinutesAndSeconds.default)(timeRemaining);
              });
            }
            checkShouldOpenModal();
          },
          onEnd: () => {
            sessionTimingOutModal.close();
            // create a new sessionExpiry cookie
            const cookieData = {
              alive: 'timed-out',
              created: Date.now(),
              duration: 0,
              expires: Date.now()
            };
            const cookieString = JSON.stringify(cookieData);
            // Set the cookie
            window.document.cookie = `${encodeURIComponent('sessionExpiry')}=${encodeURIComponent(cookieString)}; path=/`;
            sessionEndedModal.open();
          }
        }
      });
      const textAreaElements = window.document.querySelectorAll('.govuk-textarea');
      textAreaElements.forEach(element => {
        element.addEventListener('paste', () => {
          refreshSessionAndModalTimeout();
        }, false);
        element.addEventListener('input', () => {
          const now = new Date() * 1;
          // if there is less than half the session length left when a user
          // updates a textarea, then refresh the session.
          if (now > new Date(sessionData.expires) * 1 - sessionData.duration / 2) {
            refreshSessionAndModalTimeout();
          }
        }, false);
      });
    }
  }
  modalTimout();

  /* ****************************************** */
  /* ** MODAL + TIMEOUT IMPLEMENTATION END   ** */
  /* ****************************************** */

  (0, _newWindowAnchors.default)(window.document.querySelectorAll('[open-new-window]'));
  (0, _frontend.initAll)();
})();
})();

/******/ })()
;