# GOVUK Modal

## Options

## triggerElement [`Optional`]
Type: `HTMLElement`

When this element is clicked the `.open()` method is called

## focusElement [`Optional`]
Type: `HTMLElement`

Element that will be initially focused on when the dialog opens

## content [`Optional`]
Type: `Object`

Contains the data to populate the modal.

The object contains the following properties:

* title - `String ` - Modal title. Can be a String, or HTML string
* body - `String ` - Modal content. Can be a String, or HTML string

## onOpen [`Optional`]
Type: `Function`

A function that will be executed each time the modal is opened

## onBeforeOpen [`Optional`]
Type: `Function`

A function that will be executed immediately before the modal is opened

## onClose [`Optional`]
Type: `Function`

A function that will be executed each time the modal is closed

## Methods

## init - `ModelElement<HTMLElement>`

ModelElement - `Required`

Initialises the modal instance.

## open

Call this method to open the modal and make it visible. If you have defined an `onOpen` callback, it will be executed after this method

## close

Call this method to close the modal and make it invisible. If you have defined an `onClose` callback, it will be executed after this method

## content - `updater<Function>`

updater - `Required`

Updates the content of the title and body elements.

The `content` parameter is a callack function with the following parameters:
* title - `HTMLElement` - Modal title element.
* body - `HTMLElement ` - Modal body element.

## Usage

```js
import createTimeoutModal from '../modules/modal-timeout';

const modalElement = document.querySelector('#myModal');
const modalOptions = {
    triggerElement: document.querySelector('#someElement'),
    focusElement: document.querySelector('#someOtherElement'),
    content: (title, body) => {
        title.innerHTML = 'My new title';
        body.innerHTML = '<p>My new body html</p>';
    },
    onOpen: () => {
        console.log('modal opened!');
    },
    onBeforeOpen: () => {
        console.log('not opened yet!');
    },
    onClose: : () => {
        console.log('modal closed!!');
    }
};
const modal = createTimeoutModal(window);
timeoutEndedModal.init(modalOption);
```