'use strict';

const oid = require('openid-client');

function createIssuerService() {
    async function identify() {
        return oid.Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);
    }

    return Object.freeze({
        identify
    });
}

module.exports = createIssuerService;
