// eslint-disable-next-line import/no-extraneous-dependencies
import 'core-js';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'regenerator-runtime/runtime';

import createCicaGa from '../modules/ga';
import createAutocomplete from '../modules/autocomplete/autocomplete';
import createCookieBanner from '../modules/cookie-banner';
import createCookiePreference from '../modules/cookie-preference';
import createTimeoutModal from '../modules/modal-timeout';
import createNewWindowAnchors from '../modules/new-window-anchors';
import createLiveChat from '../modules/live-chat';

(() => {
    const cookiePreference = createCookiePreference('_prefs', ['essential', 'analytics']);
    if (cookiePreference.get('analytics').value === '1') {
        const cicaGa = createCicaGa(window);
        cicaGa.setUpGAEventTracking();
    } else {
        window[`ga-disable-${window.CICA.ANALYTICS_TRACKING_ID}`] = true;
    }

    const autocomplete = createAutocomplete(window);
    autocomplete.init('.govuk-select');

    const cookieBanner = createCookieBanner(window, cookiePreference, {
        cookieBannerElement: '#cookie-banner',
        cookieBannerVisibleClass: 'cookie-banner--visible',
        cookieBannerButtonAcceptAll: '#cookie-banner-accept-all'
    });
    cookieBanner.show();
    const pathName = window.location.pathname;

    if (pathName.startsWith('/apply')) {
        const sessionTimeoutModalElement = window.document.querySelector(
            '#govuk-modal-session-timing-out'
        );
        sessionTimeoutModalElement.addEventListener('TIMED_OUT', () => {
            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-session-ended',
                resumeElement: '.govuk-modal__continue'
            });
        });
        sessionTimeoutModalElement.addEventListener('MODAL_ERROR_RESUME_FAILURE', () => {
            const timeoutEndedModal = createTimeoutModal(window);
            timeoutEndedModal.init({
                element: '#govuk-modal-session-resume-error',
                closeElement: '.govuk-modal__close'
            });
        });

        const timeoutModal = createTimeoutModal(window);
        timeoutModal.init({
            element: '#govuk-modal-session-timing-out',
            resumeElement: '.govuk-modal__continue',
            showIn: [
                // show a modal at two-thirds, and fourteen-fifteenths of the session
                // length (rounded down to the nearest 1000).
                // e.g. a session length of 15 minutes results in a modal being
                // shown at 10 minutes, and 14 minutes.
                Math.floor((window.CICA.SESSION_DURATION * (2 / 3)) / 1000) * 1000,
                Math.floor((window.CICA.SESSION_DURATION * (14 / 15)) / 1000) * 1000
            ]
        });
    }

    createNewWindowAnchors(window.document.querySelectorAll('[open-new-window]'));
    createLiveChat(window.document.querySelector('#chat-iframe'));
})();
