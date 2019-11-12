'use strict';

/* eslint-disable */
(function cicaScope(window, document, undefined) {

    // for legacy versions of IE.
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]);
        }
    };

    function addEventListener(element, eventType, handler) {
        if (window.addEventListener) {
            element.addEventListener(eventType, handler, false);
        } else if (window.attachEvent) {
            window.attachEvent(eventType, handler);
        }
    }

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

    function setUpGAEventTracking() {
        var trackableElements = document.querySelectorAll('[data-module]');
        forEach(trackableElements, function (index, element) {
            var dataModuleId = element.getAttribute('data-module');
            if (dataModuleId === 'govuk-details') {
                detailsElement(element);
            }
        });
    }

    setUpGAEventTracking();

}(window, document));
