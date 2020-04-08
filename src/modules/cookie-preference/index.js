import jsCookies from '../../../node_modules/js-cookie/src/js.cookie';

function createCookiePreference(cookieName, allowedPreferences) {
    const cookieConfig = {
        path: '/',
        expires: 365,
        samesite: 'strict'
    };

    function getDistinctValues(value) {
        const valueTable = [];
        return value
            .split(',')
            .filter(x => x !== '') // removes empty array element caused by the trailing comma.
            .reduce((acc, item) => {
                let accumulator = acc;
                accumulator += '';
                const splitItem = item.split('=');
                if (!valueTable.includes(splitItem[0])) {
                    accumulator += `${splitItem[0]}=${splitItem[1]},`;
                    valueTable.push(splitItem[0]);
                }
                return accumulator;
            }, '');
    }

    function getPreference(preferenceName) {
        const cookieValue = jsCookies.get(cookieName);
        let cookiePreferenceTable = {};
        if (cookieValue) {
            cookiePreferenceTable = window
                .atob(cookieValue)
                .split(',')
                .reduce((acc, item) => {
                    const splitItem = item.split('=');
                    // eslint-disable-next-line prefer-destructuring
                    acc[splitItem[0]] = splitItem[1];
                    return acc;
                }, {});
        }

        return {
            name: preferenceName,
            value: cookiePreferenceTable[preferenceName] || null
        };
    }

    function set(preferenceName, preferenceValue) {
        if (!allowedPreferences.includes(preferenceName)) {
            throw Error(
                `Unable to set preference "${preferenceName}" as it is not in the preference whitelist`
            );
        }
        let currentCookieValue = jsCookies.get(cookieName);

        if (currentCookieValue) {
            currentCookieValue = window.atob(currentCookieValue);
            const newCookieValue = getDistinctValues(
                // add the new one to the front so it is retained after
                // `getDistinctValues` all other preferences with the same name.
                `${preferenceName}=${preferenceValue},${currentCookieValue},`
            );
            jsCookies.set(cookieName, window.btoa(newCookieValue), cookieConfig);
            return;
        }

        jsCookies.set(
            cookieName,
            window.btoa(`${preferenceName}=${preferenceValue},`),
            cookieConfig
        );
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
