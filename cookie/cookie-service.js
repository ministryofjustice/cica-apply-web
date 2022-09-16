'use strict';

function createCookieService({req, res, cookieName}) {
    function getCookieJson() {
        return JSON.parse(req.cookies[cookieName] || '{}');
    }

    function isSet(property) {
        if (property) {
            return !!getCookieJson()[property];
        }
        return false;
    }

    function isExpired() {
        if (!isSet('expires')) {
            return true;
        }
        return new Date(getCookieJson().expires) < new Date();
    }

    function set(propertyName, propertyValue) {
        let newProperties = {};
        if (typeof propertyName === 'object') {
            newProperties = propertyName;
        } else {
            newProperties = {[propertyName]: propertyValue};
        }

        res.cookie(
            cookieName,
            JSON.stringify({
                ...getCookieJson(),
                ...newProperties
            })
        );
    }

    function get(property) {
        const cookie = getCookieJson();
        if (property) {
            return cookie[property];
        }
        return cookie;
    }

    return Object.freeze({
        isSet,
        isExpired,
        get,
        set
    });
}

module.exports = createCookieService;
