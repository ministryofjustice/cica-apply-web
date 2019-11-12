'use strict';

/* eslint-disable */
(function cicaScope(window, document, undefined) {

    /* ******************************************** **/
    /* ** POLYFILLS START                         * **/
    /* ******************************************** **/

    // for legacy versions of IE.
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]);
        }
    };

    // old IE support.
    function addEventListener(element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false);
        } else if (window.attachEvent) {
            window.attachEvent(eventType, handler);
        }
    }

    function hasClass(elem, classToCheck) {
        return (' ' + elem.className + ' ').indexOf(' ' + classToCheck + ' ') > -1;
    }

    if (typeof Object.assign != 'function') {
            // Must be writable: true, enumerable: false, configurable: true.
            Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }
        
                var to = Object(target);
        
                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];
        
                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
        });
    }

    /* ******************************************** **/
    /* ** POLYFILLS END                           * **/
    /* ******************************************** **/

    function CicaGa() {

        // https://developers.google.com/analytics/devguides/collection/gtagjs/events
        // gtag('event', <action>, {
        //     'event_category': <category>,
        //     'event_label': <label>,
        //     'value': <value>
        // });
        var defaultOptions = {
            type: 'event', // <String>
            action: 'click', // <String>
            category: 'category', // <String>
            label: undefined, // <String>
            value: undefined // non-negative <Integer>
        };

        this.send = function(options) {
            var gtagOptions = Object.assign({}, defaultOptions, options);
            gtag(gtagOptions.type, gtagOptions.action, {
                'event_category': gtagOptions.category,
                'event_label': gtagOptions.label,
                'value': gtagOptions.value
            });
        }

    }

    /* ******************************************** **/
    /* ** TRACKING HANDLERS START                 * **/
    /* ******************************************** **/

    function detailsElement(element) {
        addEventListener(element, 'click', function() {
            // the open attribute is added when the user reveals
            // the content of the details element.
            // click it from closed to open will result in
            // the open variable having a value of `null`.
            // checking for `null` will tell us that the element
            // is being opened (and not closed). We can then send
            // a GA event for the user opening the details element.
            var open = element.getAttribute('open');

            if (open === null) {
                var detailsTagText = element.querySelector('.govuk-details__summary-text').innerText;
                var _ = new CicaGa();
                _.send({
                    action: 'open',
                    category: 'details-tag',
                    label: detailsTagText
                });
            }
        });
    }

    function scrollToElement(element) {
        var windowHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
        var hasReachedBottom = false;
        addEventListener(document, 'scroll', function() {
            var elementBoundingRects = element.getBoundingClientRect();
            if (!hasReachedBottom && elementBoundingRects.top < windowHeight) {
                var eventAction = element.getAttribute('ga-event-action');
                var eventCategory = element.getAttribute('ga-event-category');
                var eventLabel = element.getAttribute('ga-event-label');
                var _ = new CicaGa();
                _.send({
                    action: eventAction,
                    category: eventCategory,
                    label: eventLabel
                });
                hasReachedBottom = true;
            }
        });
    }

    /* ******************************************** **/
    /* ** TRACKING HANDLERS END                   * **/
    /* ******************************************** **/

    function setUpGAEventTracking() {
        var trackableElements = document.querySelectorAll('[data-module], .ga-event');
        forEach(trackableElements, function (index, element) {

            if (hasClass(element, 'ga-event--scrollto')) {
                scrollToElement(element);
                return;
            }

            var dataModuleId = element.getAttribute('data-module');
            if (dataModuleId === 'govuk-details') {
                detailsElement(element);
            }
        });
    }

    setUpGAEventTracking();

}(window, document));
