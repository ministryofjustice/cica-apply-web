'use strict';

const {getDashboardURI} = require('../getActionURIs');

function isValidPathName(pathname) {
    return /^\/apply\/[a-z0-9-]{1,80}$/.test(pathname);
}

function getValidReferrerOrDefault(requestReferrer, defaultReferrer = getDashboardURI(true)) {
    let referrerPathName;
    try {
        // `/apply/<sectionname>`.
        if (isValidPathName(requestReferrer)) {
            return requestReferrer;
        }
        // will be thrown and cought below if not a string representation of a URL.
        // e.g. `thisisnotaurl`, `/secret/url`.
        referrerPathName = new URL(requestReferrer).pathname;

        // not `/apply/<sectionname>`.
        if (!isValidPathName(referrerPathName)) {
            throw new Error('Invalid referrer pathname');
        }
    } catch {
        referrerPathName = defaultReferrer;
    }

    return referrerPathName;
}
module.exports = getValidReferrerOrDefault;
