import jsCookies from '../../../node_modules/js-cookie/src/js.cookie';

function createCookiePreference(cookieName, allowedPreferences) {
    const cookieConfig = {
        path: '/',
        expires: 365,
        samesite: 'strict'
    };

    function getPreference(preferenceName) {
        const cookieValue = jsCookies.getJSON(cookieName) || {};
        return {
            name: preferenceName,
            value: cookieValue[preferenceName] || null
        };
    }

    function set(preferenceName, preferenceValue) {
        if (!allowedPreferences.includes(preferenceName)) {
            throw Error(
                `Unable to set preference "${preferenceName}" as it is not in the preference whitelist`
            );
        }

        let cookieValue = jsCookies.get(cookieName) || '{}';
        cookieValue = JSON.parse(cookieValue);

        cookieValue[preferenceName] = preferenceValue;
        jsCookies.set(cookieName, JSON.stringify(cookieValue), cookieConfig);
    }

    function get(preferenceName) {
        if (preferenceName) {
            return getPreference(preferenceName);
        }

        // else return true/false if the cookie exists.
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
        acceptAll
    });
}

export default createCookiePreference;
