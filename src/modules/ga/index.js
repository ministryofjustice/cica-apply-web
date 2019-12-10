import {guaTrackLinks} from './vendor/gua-anchor';

function createCicaGa(window) {
    guaTrackLinks('http://localhost:3000', window);
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

    function send(options) {
        const gtagOptions = Object.assign({}, defaultOptions, options);
        window.gtag(gtagOptions.type, gtagOptions.action, {
            event_category: gtagOptions.category,
            event_label: gtagOptions.label,
            value: gtagOptions.value,
            event_callback: gtagOptions.callback
        });
    }

    /* * ******************************************* * */
    /* * * TRACKING HANDLERS START                 * * */
    /* * ******************************************* * */

    function detailsElementHandler(element) {
        element.addEventListener(
            'click',
            () => {
                // the open attribute is added when the user reveals
                // the content of the details element.
                // click it from closed to open will result in
                // the open variable having a value of `null`.
                // checking for `null` will tell us that the element
                // is being opened (and not closed). We can then send
                // a GA event for the user opening the details element.
                const open = element.getAttribute('open');

                if (open === null) {
                    const detailsTagText = element.querySelector('.govuk-details__summary-text')
                        .innerText;
                    send({
                        action: 'open',
                        category: 'details-tag',
                        label: detailsTagText
                    });
                }
            },
            false
        );
    }

    function scrollToElementHandler(element) {
        const windowHeight =
            window.innerHeight ||
            window.document.documentElement.clientHeight ||
            window.document.body.clientHeight;
        let hasReachedElement = false;
        window.document.addEventListener(
            'scroll',
            () => {
                const elementBoundingRects = element.getBoundingClientRect();
                if (!hasReachedElement && elementBoundingRects.top < windowHeight) {
                    const eventAction = element.getAttribute('ga-event-action');
                    const eventCategory = element.getAttribute('ga-event-category');
                    const eventLabel = element.getAttribute('ga-event-label');
                    send({
                        action: eventAction,
                        category: eventCategory,
                        label: eventLabel
                    });
                    hasReachedElement = true;
                }
            },
            false
        );
    }

    /* * ******************************************* * */
    /* * * TRACKING HANDLERS END                   * * */
    /* * ******************************************* * */

    function setUpGAEventTracking() {
        const trackableElements = window.document.querySelectorAll('[data-module], .ga-event');
        // GOVUK modules, and custom events tracking.
        trackableElements.forEach(element => {
            if (element.classList.contains('ga-event--scrollto')) {
                scrollToElementHandler(element);
                return;
            }
            const dataModuleId = element.getAttribute('data-module');
            if (dataModuleId === 'govuk-details') {
                detailsElementHandler(element);
            }
        });
    }

    return Object.freeze({
        setUpGAEventTracking
    });
}

// eslint-disable-next-line import/prefer-default-export
export {createCicaGa};
