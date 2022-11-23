'use strict';

const oid = require('openid-client');

function createIssuerService() {
    async function identify() {
        return oid.Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);
    }

    async function getJwtKeysUri() {
        const issuer = await identify();
        return issuer.jwks_uri;
    }

    return Object.freeze({
        identify,
        getJwtKeysUri
    });
}

module.exports = createIssuerService;
