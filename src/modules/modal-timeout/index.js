import {get} from '../../../node_modules/axios/dist/axios.min';
import Modal from '../../../components/cica/modal/modal';
import CustomEvent from '../../../node_modules/custom-event';
import {ms, s, m} from '../../../node_modules/time-convert';

function createTimeoutModal(window) {
    // We need to clear the timeouts when an application is resumed. This is
    // due the same element being used each time the "session timing out" modal
    // appears. If we don't clear the timeouts, then there will be as many updates
    // per second as as many modals there has been. i.e. if you are seeing the
    // "session timing out" modal for the 3rd time, there will be 3 timeouts every
    // second that will update the DOM.
    // this is a cache of all timeouts that is cleared when needed.
    let timeoutsArray = [];
    let modal;

    function msToMinutesAndSeconds(duration) {
        const result = ms.to(m, s)(duration);
        const minutes = result[0];
        const seconds = result[1];
        let minutesText = '';
        let secondsText = '';
        let conjunctionText = '';
        if (minutes) {
            minutesText = minutes === 1 ? `${minutes} minute` : `${minutes} minutes`;
        }
        if (seconds) {
            secondsText = seconds === 1 ? `${seconds} second` : `${seconds} seconds`;
        }
        if (minutes && seconds) {
            conjunctionText = ' and ';
        }
        return `${minutesText}${conjunctionText}${secondsText}`;
    }

    function updateTimeRemainingText(el, timeRemaining, interval, dialogBox) {
        const element = el;
        element.innerHTML = msToMinutesAndSeconds(timeRemaining);

        window.clearTimeout(timeoutsArray.pop()); // remove last item in the array as it has done its job.
        const newTimeRemaining = Math.round((timeRemaining - interval) / interval) * interval;
        // if there is an repeating interval, and if the time remaining
        // still has a value that can be reduced by `interval` then
        // update things.
        if (interval && timeRemaining >= interval) {
            const timeout = setTimeout(
                updateTimeRemainingText,
                interval,
                el,
                newTimeRemaining,
                interval,
                dialogBox
            );
            timeoutsArray.push(timeout);
            return;
        }

        const event = new CustomEvent('TIMED_OUT');
        dialogBox.dispatchEvent(event);
    }

    function resumeClickHandler(settings) {
        // get a valid html response - this will go to our custom 404 page.
        get('/')
            .then(() => {
                settings.dialogBoxResumeCTA.removeEventListener('click', resumeClickHandler);
                timeoutsArray.forEach(x => {
                    window.clearTimeout(x);
                });
                timeoutsArray = [];
                modal.close();
                // eslint-disable-next-line no-use-before-define
                setUpModal({
                    dialogBox: settings.dialogBox,
                    modalOptions: settings.modalOptions,
                    showIn: settings.showIn,
                    closed: settings.closed,
                    dialogBoxResumeCTA: settings.dialogBoxResumeCTA,
                    onTimeout: settings.onTimeout
                });
            })
            .catch(() => {
                const event = new CustomEvent('MODAL_ERROR_RESUME_FAILURE');
                settings.dialogBox.dispatchEvent(event);
            });
    }

    function setUpModal(settings) {
        modal = new Modal(settings.dialogBox).init(settings.modalOptions);

        settings.dialogBox.addEventListener('TIMED_OUT', () => {
            modal.close();
        });

        const timeRemainingElements = settings.dialogBox.querySelectorAll(
            '.govuk-modal__time-remaining'
        );

        timeRemainingElements.forEach(el => {
            updateTimeRemainingText(el, window.CICA.SESSION_DURATION, 1000, settings.dialogBox);
        });

        if (settings.dialogBoxResumeCTA) {
            // close dialogue on 'resume application'.
            settings.dialogBoxResumeCTA.addEventListener('click', () => {
                resumeClickHandler(settings);
            });
        }

        if (settings.showIn) {
            if (Array.isArray(settings.showIn)) {
                settings.showIn.forEach(timeUntil => {
                    if (!Number.isNaN(timeUntil)) {
                        const timeout = window.setTimeout(modal.open, timeUntil);
                        timeoutsArray.push(timeout);
                    }
                });
            }
        } else if (settings.closed) {
            modal.close();
        } else {
            modal.open();
        }
    }

    function init(options) {
        const dialogBox = window.document.querySelector(options.element);
        if (!dialogBox) {
            return;
        }
        const dialogBoxResumeCTA = dialogBox.querySelector(options.resumeElement);
        const modalOptions = {};
        if (dialogBoxResumeCTA) {
            modalOptions.focusElement = dialogBoxResumeCTA;
        }

        modalOptions.content = options.content;
        modalOptions.triggerElement = window.document.querySelector(options.triggerElement);
        modalOptions.closeElement = window.document.querySelector(options.closeElement);
        modalOptions.onOpen = options.onOpen;
        modalOptions.onClose = options.onClose;

        setUpModal({
            dialogBox,
            modalOptions,
            showIn: options.showIn,
            closed: options.closed,
            dialogBoxResumeCTA,
            onTimeout: options.onTimeout
        });
    }

    return Object.freeze({
        init
    });
}

export default createTimeoutModal;
