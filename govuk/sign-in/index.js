'use strict';

const createIssuerService = require('./issuer/index');
const createAuthorisationService = require('./authorisation/index');
const createTokenService = require('./token/index');

function signInService() {
    async function getServiceUrl(redirectUri) {
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        return authorisationService.getAuthorisationURI({issuer, redirectUri});
    }

    async function getUserIdToken(authToken) {
        const tokenService = createTokenService();
        return tokenService.getUserIdToken(authToken);
    }

    return Object.freeze({
        getServiceUrl,
        getUserIdToken
    });
}

module.exports = signInService;
