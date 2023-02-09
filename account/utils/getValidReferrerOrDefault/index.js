'use strict';

const {getDashboardURI} = require('../getActionURIs');

function getValidReferrerOrDefault(requestReferrer, defaultReferrer = getDashboardURI()) {
    return /^\/apply\/[a-z0-9-]{1,80}$/.test(requestReferrer) ? requestReferrer : defaultReferrer;
}
module.exports = getValidReferrerOrDefault;
