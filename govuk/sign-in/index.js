'use strict';

const createIssuerService = require('./issuer/index');
const createAuthorisationService = require('./authorisation/index');

function signInService() {
    async function getServiceUrl(redirectUri) {
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        return authorisationService.getAuthorisationURI(issuer, redirectUri);
    }

    return Object.freeze({
        getServiceUrl
    });
}

module.exports = signInService;
