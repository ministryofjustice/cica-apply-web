// eslint-disable-next-line import/no-extraneous-dependencies
import 'core-js';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'regenerator-runtime/runtime';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as jsCookies from 'js-cookie';
import {initAll} from '@ministryofjustice/frontend';

import createCicaGa from '../modules/ga';
import createAutocomplete from '../modules/autocomplete/autocomplete';
import createCookieBanner from '../modules/cookie-banner';
import createCookiePreference from '../modules/cookie-preference';
import createTimeoutModal from '../modules/modal-timeout';
import createNewWindowAnchors from '../modules/new-window-anchors';
import createPostcodeLookup from '../modules/postcode-lookup';
import createCrossServiceHeader from '../modules/govuk-one-login-service-header';

import msToMinutesAndSeconds from '../modules/modal-timeout/utils/msToMinutesAndSeconds';

(() => {
    const autocomplete = createAutocomplete(window);
    autocomplete.init('.govuk-select');
    const postcodeLookup = createPostcodeLookup(window);
    postcodeLookup.init();

    const cookiePreference = createCookiePreference('_prefs', ['essential', 'analytics']);
    if (cookiePreference.get('analytics').value === '1') {
        const cicaGa = createCicaGa(window);
        cicaGa.init();
    } else {
        window[`ga-disable-${window.CICA.ANALYTICS_TRACKING_ID}`] = true;
    }

    const cookieBanner = createCookieBanner(window, cookiePreference, {
        cookieBannerElement: '#cookie-banner',
        cookieBannerVisibleClass: 'cookie-banner--visible',
        cookieBannerButtonAcceptAll: '#cookie-banner-accept-all'
    });
    cookieBanner.show();
    createCrossServiceHeader(window);

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
            if (
                !sessionTimingOutModal.isOpen &&
                documentVisible &&
                // session hasn't already ended. Avoids the modal opening
                // when a user blurs and focuses a tab after the session
                // has ended.
                Date.now() < sessionData.expires &&
                // session is nearing its end.
                sessionTimingOutModal.timer.timeRemaining < sessionData.duration / 6
            ) {
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

            const TimeoutModal = createTimeoutModal(window);

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
                        const resumeElement = sessionTimingOutModal.config.element.querySelector(
                            '.govuk-modal__continue'
                        );
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

                    eventHandlers.onOpenResumeElement.element.addEventListener(
                        'click',
                        eventHandlers.onOpenResumeElement.handler
                    );
                },
                onClose: () => {
                    eventHandlers.onOpenResumeElement.element.removeEventListener(
                        'click',
                        eventHandlers.onOpenResumeElement.handler
                    );
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
                                const timeRemainingElement = titleElement.querySelector(
                                    '.govuk-modal__time-remaining'
                                );
                                timeRemainingElement.innerHTML = msToMinutesAndSeconds(
                                    timeRemaining
                                );
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
                        window.document.cookie = `${encodeURIComponent(
                            'sessionExpiry'
                        )}=${encodeURIComponent(cookieString)}; path=/`;

                        sessionEndedModal.open();
                    }
                }
            });

            const textAreaElements = window.document.querySelectorAll('.govuk-textarea');
            textAreaElements.forEach(element => {
                element.addEventListener(
                    'paste',
                    () => {
                        refreshSessionAndModalTimeout();
                    },
                    false
                );
                element.addEventListener(
                    'input',
                    () => {
                        const now = new Date() * 1;
                        // if there is less than half the session length left when a user
                        // updates a textarea, then refresh the session.
                        if (now > new Date(sessionData.expires) * 1 - sessionData.duration / 2) {
                            refreshSessionAndModalTimeout();
                        }
                    },
                    false
                );
            });
        }
    }
    modalTimout();

    /* ****************************************** */
    /* ** MODAL + TIMEOUT IMPLEMENTATION END   ** */
    /* ****************************************** */

    createNewWindowAnchors(window.document.querySelectorAll('[open-new-window]'));
    initAll();
})();
