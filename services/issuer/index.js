'use strict';

const oid = require('openid-client');

function createIssuerService() {
    async function identify() {
        const govukIssuer = await oid.Issuer.discover('https://oidc.integration.account.gov.uk/');
        return govukIssuer;
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
