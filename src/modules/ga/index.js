import * as jsCookies from 'js-cookie';
import guaTrackLinks from './vendor/gua-anchor';

function createCicaGa(window) {
    // eslint-disable-next-line no-undef
    guaTrackLinks(window.CICA.SERVICE_URL, window);
    // https://developers.google.com/analytics/devguides/collection/gtagjs/events
    // gtag('event', <action>, {
    //     'event_category': <category>,
    //     'event_label': <label>,
    //     'value': <value>
    // });
    const defaultOptions = {
        type: 'event', // <String>
        action: 'click', // <String>
        category: 'category', // <String>
        label: undefined, // <String>
        value: undefined // non-negative <Integer>
    };

    const cookieConfig = {
        // no `expires` property means the cookie will die alongside the session.
        path: '/apply/', // only set it during the application
        samesite: 'lax'
    };

    function send(options) {
        const gtagOptions = {...defaultOptions, ...options};
        window.gtag(gtagOptions.type, gtagOptions.action, {
            event_category: gtagOptions.category,
            event_label: gtagOptions.label,
            value: gtagOptions.value,
            event_callback: gtagOptions.callback,
            non_interaction: gtagOptions.nonInteraction
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
            const detailsTagText =
                detailsTextElement.innerText || detailsTextElement.innerHTML.trim();
            send({
                action: 'open',
                category: 'details-tag',
                label: detailsTagText
            });
        }
    }

    function click(element, options) {
        element.addEventListener(
            'click',
            () => {
                send({
                    action: 'click',
                    category: options.category,
                    label: options.label
                });
            },
            false
        );
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
            const errorElements = window.document.querySelectorAll(
                '.govuk-error-summary__list li a'
            );
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

    function recordJourneyDuration() {
        const cookieValue = jsCookies.getJSON('client') || {};

        if (!cookieValue.journeyStartTime) {
            cookieValue.journeyStartTime = new Date().getTime();
            jsCookies.set('client', cookieValue, cookieConfig);
            return;
        }
        if (window.location.pathname === '/apply/confirmation') {
            const now = new Date().getTime();
            const {journeyStartTime} = cookieValue;
            const differenceInSeconds = Math.floor((now - journeyStartTime) / 1000);
            send({
                category: 'application',
                action: 'duration',
                label: differenceInSeconds,
                nonInteraction: true
            });
            // reset value.
            cookieValue.journeyStartTime = undefined;
            jsCookies.set('client', cookieValue, cookieConfig);
        }
    }

    /* * ******************************************* * */
    /* * * TRACKING HANDLERS END                   * * */
    /* * ******************************************* * */

    function init() {
        const trackableElements = window.document.querySelectorAll(
            '[data-module], .ga-event, .govuk-input, .govuk-textarea'
        );
        // GOVUK modules, and custom events tracking.
        trackableElements.forEach(element => {
            if (element.classList.contains('ga-event--click')) {
                click(element, {
                    label:
                        element.getAttribute('data-tracking-label') ||
                        element.pathname ||
                        (element.innerText && element.innerText.trim()) ||
                        (element.innerHTML && element.innerHTML.trim()),
                    category: element.getAttribute('data-tracking-category') || element.tagName
                });
                return;
            }

            if (
                element.classList.contains('govuk-textarea') ||
                element.classList.contains('govuk-input')
            ) {
                element.addEventListener(
                    'paste',
                    e => {
                        paste(element, e);
                    },
                    false
                );
                return;
            }

            const dataModuleId = element.getAttribute('data-module');
            if (dataModuleId === 'govuk-details') {
                element.addEventListener(
                    'click',
                    () => {
                        detailsElement(element);
                    },
                    false
                );
            }
        });

        window.addEventListener(
            'beforeunload',
            () => {
                charCount();
            },
            false
        );

        validationError();
        recordJourneyDuration();
    }

    return Object.freeze({
        init
    });
}

export default createCicaGa;
