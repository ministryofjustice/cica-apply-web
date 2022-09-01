import Modal from '../../../components/cica/modal/modal';
import AccurateInterval from './utils/AccurateInterval';

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

        const modal = new Modal(element).init({
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
                const {duration, interval, onTick, onEnd, startTime} = config.timer;

                const timerDuration = setUpOptions.duration || duration;
                const timerStartTime = setUpOptions.startTime || startTime;

                const timer = new AccurateInterval({
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

export default createTimeoutModal;
