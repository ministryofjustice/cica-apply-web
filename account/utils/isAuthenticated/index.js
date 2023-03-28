'use strict';

function isAuthenticated(req) {
    return !!(req?.oidc.isAuthenticated() || req?.isAuthenticated);
}

module.exports = isAuthenticated;
