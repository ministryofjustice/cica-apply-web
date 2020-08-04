import * as jsCookies from 'js-cookie';

function createCookiePreference(cookieName, allowedPreferences) {
    const cookieConfig = {
        path: '/',
        expires: 365,
        samesite: 'lax'
    };

    function get(preferenceName) {
        const cookieValue = jsCookies.getJSON(cookieName) || {};
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

        const cookieValue = jsCookies.getJSON(cookieName) || {};
        cookieValue[preferenceName] = preferenceValue;
        jsCookies.set(cookieName, cookieValue, cookieConfig);
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
