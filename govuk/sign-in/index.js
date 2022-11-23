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

    async function getLogoutUrl() {
        const issuerService = createIssuerService();
        const issuer = await issuerService.identify();
        return issuer.end_session_endpoint;
    }

    return Object.freeze({
        getAuthorisationURI,
        getIdToken,
        getLogoutUrl
    });
}

module.exports = signInService;
