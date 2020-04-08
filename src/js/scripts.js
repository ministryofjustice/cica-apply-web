/* global ANALYTICS_TRACKING_ID */
import createCicaGa from '../modules/ga';
import {createAutocomplete} from '../modules/autocomplete/autocomplete';
import createCookieBanner from '../modules/cookie-banner';
import createCookiePreference from '../modules/cookie-preference';

(() => {
    const cookiePreference = createCookiePreference('_prefs', ['essential', 'analytics']);
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
})();
