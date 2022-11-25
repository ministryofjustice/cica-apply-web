'use strict';

const createIssuerService = require('./issuer/index');
const createAuthorisationService = require('./authorisation/index');
const createTokenService = require('./token/index');

function signInService() {
    async function getAuthorisationURI(options) {
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        return authorisationService.getAuthorisationURI(
            issuer.metadata.authorization_endpoint,
            options
        );
    }

    async function getIdToken(options) {
        const tokenService = createTokenService();
        return tokenService.getIdToken(options);
    }

    return Object.freeze({
        getAuthorisationURI,
        getIdToken
    });
}

module.exports = signInService;
