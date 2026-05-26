import jsCookies from 'js-cookie';
import parseCookie from '../parseCookie';

function createCookiePreference(cookieName, allowedPreferences) {
    const cookieConfig = {
        path: '/',
        expires: 365,
        sameSite: 'Lax'
    };

    function get(preferenceName) {
        const rawCookie = jsCookies.get(cookieName);
        const cookieValue = parseCookie(rawCookie);
        return {
            name: preferenceName,
            value: cookieValue[preferenceName]
        };
    }

    function set(preferenceName, preferenceValue) {
        if (!allowedPreferences.includes(preferenceName)) {
            throw Error(
                `Unable to set preference "${preferenceName}" as it is not in the preference whitelist`
            );
        }

        const rawCookie = jsCookies.get(cookieName);
        const cookieValue = parseCookie(rawCookie);
        cookieValue[preferenceName] = preferenceValue;
        jsCookies.set(cookieName, JSON.stringify(cookieValue), cookieConfig);
    }

    function getCookie() {
        return jsCookies.get(cookieName);
    }

    function acceptAll() {
        allowedPreferences.forEach(cookiePreference => {
            set(cookiePreference, '1');
        });
    }

    return Object.freeze({
        set,
        get,
        getCookie,
        acceptAll
    });
}

export default createCookiePreference;
