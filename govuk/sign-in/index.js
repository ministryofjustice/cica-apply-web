'use strict';

const createIssuerService = require('./issuer/index');
const createAuthorisationService = require('./authorisation/index');
const createTokenService = require('./token/index');

function signInService() {
    async function getServiceUrl(options) {
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        return authorisationService.getAuthorisationURI({issuer, options});
    }

    async function getUserIdToken(options) {
        const tokenService = createTokenService();
        return tokenService.getUserIdToken(options);
    }

    async function getLogoutUrl() {
        const issuerService = createIssuerService();
        const issuer = await issuerService.identify();
        return issuer.end_session_endpoint;
    }

    return Object.freeze({
        getServiceUrl,
        getUserIdToken,
        getLogoutUrl
    });
}

module.exports = signInService;
