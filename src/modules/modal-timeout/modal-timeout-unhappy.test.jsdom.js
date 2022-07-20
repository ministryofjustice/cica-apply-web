/* globals document */
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

// emulate a 404 for the session refresh attempt.
jest.mock('axios', () => {
    return {
        get: () => {
            return Promise.reject(new Error('something went wrong'));
        }
    };
});

describe('Timeout Modal', () => {
    describe('unhappy paths', () => {
        it('should throw error when unable to refresh session', async () => {
            let failure = 'no';
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
            const modalElement = document.body.querySelector('#govuk-modal-test-3');
            modalElement.addEventListener('MODAL_ERROR_RESUME_FAILURE', () => {
                failure = '123456';
            });
            // click resume button.
            document.querySelector('.govuk-modal__continue').click();
            // emulate a delay.
            await new Promise(resolve => {
                setTimeout(resolve, 1200);
            });
            expect(failure).toEqual('123456');
        });
    });
});
