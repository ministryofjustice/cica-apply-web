/* global ANALYTICS_TRACKING_ID */
import createCicaGa from '../modules/ga';
import {createAutocomplete} from '../modules/autocomplete/autocomplete';
import createCookieBanner from '../modules/cookie-banner';
import createCookiePreference from '../modules/cookie-preference';

(() => {
    const cookiePreference = createCookiePreference('cicaPreference');
    if (cookiePreference.get('analytics').value === '1') {
        const cicaGa = createCicaGa(window);
        cicaGa.setUpGAEventTracking();
    } else {
        window[`ga-disable-${ANALYTICS_TRACKING_ID}`] = true;
    }

    const autocomplete = createAutocomplete(window);
    autocomplete.init('.govuk-select');

    const cookieBanner = createCookieBanner(window, cookiePreference);
    cookieBanner.show();

    const formCookiePreference = window.document.querySelector('#cookie-preferences');
    if (formCookiePreference) {
        const preferencesElements = formCookiePreference.querySelectorAll(
            '[data-cookie-preference]'
        );
        // check/select the radio button that corresponds to the current cookie settings.
        preferencesElements.forEach(element => {
            if (
                element.value ===
                cookiePreference.get(element.getAttribute('data-cookie-preference')).value
            ) {
                // eslint-disable-next-line no-param-reassign
                element.checked = true;
            }
        });
        formCookiePreference.addEventListener('submit', e => {
            const preferencesElementsSelected = formCookiePreference.querySelectorAll(
                '[data-cookie-preference]:checked'
            );
            // always needs to be set regardless.
            cookiePreference.set('essential', 1);
            preferencesElementsSelected.forEach(element => {
                cookiePreference.set(element.getAttribute('data-cookie-preference'), element.value);
            });
            e.preventDefault();
            return false;
        });
    }
})();
