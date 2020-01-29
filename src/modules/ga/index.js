import guaTrackLinks from './vendor/gua-anchor';
import debounce from '../../../node_modules/debounce';

function createCicaGa(window) {
    // eslint-disable-next-line no-undef
    guaTrackLinks(SERVICE_URL, window);
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

    function scrollThresholdHandler() {
        const {body} = window.document;
        const html = window.document.documentElement;
        const documentHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const scrollDepthTargets = [10, 25, 50, 75, 90, 100];
        window.document.addEventListener(
            'scroll',
            debounce(() => {
                if (!scrollDepthTargets.length) {
                    return;
                }
                const currentScrollTop = window.document.documentElement.scrollTop;
                let documentScrollPosition = Math.floor((currentScrollTop / documentHeight) * 100);
                // add on the equivalent percentage for an entire screen length
                // because we are measuring from the bottom, not the top.
                documentScrollPosition += Math.floor((window.screen.height / documentHeight) * 100);
                scrollDepthTargets.forEach((target, index) => {
                    if (documentScrollPosition >= target) {
                        send({
                            category: 'scrolling',
                            action: `${target}%`,
                            label: window.location.href
                        });
                        scrollDepthTargets.splice(index, 1);
                    }
                });
            }, 100),
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
            if (element.classList.contains('ga-event--scrollthreshold')) {
                scrollThresholdHandler();
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

export default createCicaGa;
