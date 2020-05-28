# GOVUK Modal

## Options

## triggerElement [`Optional`]
Type: `HTMLElement`

When this element is clicked the `.open()` method is called

## focusElement [`Optional`]
Type: `HTMLElement`

Element that will be initially focus on when the dialog opens

## content [`Optional`]
Type: `Object`

Contains the data to populate the modal.

The object contains the following properties:

* title - `String ` - Modal title. Can be a String, or HTML string
* content - `String ` - Modal content. Can be a String, or HTML string

## onOpen [`Optional`]
Type: `Function`

A function definition that will be executed each time the modal is opened

## onClose [`Optional`]
Type: `Function`

A function definition that will be executed each time the modal is closed

## Methods

## init - `ModelElement<HTMLElement>`

ModelElement - `Required`

Initialises the modal instance.

## open

Call this method to open the modal and make it visible. If you have defined an `onOpen` callback, it will be executed after this method

## close

Call this method to close the modal and make it invisible. If you have defined an `onClose` callback, it will be executed after this method

## content - `content<Object>`

content - `Required`

Updates the content of the modal instance.

The `content` parameter contains the following properties:
* title - `String ` - Modal title. Can be a String, or HTML string
* content - `String ` - Modal content. Can be a String, or HTML string

## Usage

```js
import createTimeoutModal from '../modules/modal-timeout';

const modalElement = document.querySelector('#myModal');
const modalOptions = {
    triggerElement: document.querySelector('#someElement'),
    focusElement: document.querySelector('#someOtherElement'),
    content: {
        title: 'My Modal Title',
        content: '<p>This is my modal contents</p><p>It is very nice!</p>',
    },
    onOpen: () => {
        console.log('modal opened!');
    }),
    onClose: : () => {
        console.log('modal closed!!');
    })
};
const modal = createTimeoutModal(window);
timeoutEndedModal.init(modalOption);
```