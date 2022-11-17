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

    return Object.freeze({
        getServiceUrl,
        getUserIdToken
    });
}

module.exports = signInService;
