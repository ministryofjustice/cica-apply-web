const oid = require('openid-client');

function createIssuerService() {
    async function identify() {
        return await oid.Issuer.discover('https://oidc.integration.account.gov.uk/');
    }

    return Object.freeze({
        identify
    });
}

module.exports = createIssuerService;
