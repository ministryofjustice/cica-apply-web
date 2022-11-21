'use strict';

const {uuid} = require('uuidv4');

const createIssuerService = require('./issuer/index');
const createAuthorisationService = require('./authorisation/index');
const createTokenService = require('./token/index');
const createJwtService = require('../../utils/jwt/index');

function signInService() {
    async function getServiceUrl(options) {
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        return authorisationService.getAuthorisationURI({issuer, options});
    }

    async function getUserId(code, redirectUri, nonce) {
        const tokenService = createTokenService();
        const jwtService = createJwtService();
        const issuerService = createIssuerService();
        const issuer = await issuerService.identify();
        const options = {
            code,
            redirectUri,
            tokenUrl: issuer.token_endpoint,
            assertion: jwtService.generateJWT({
                aud: issuer.token_endpoint,
                iss: process.env.CW_GOVUK_CLIENT_ID, // clientId.
                sub: process.env.CW_GOVUK_CLIENT_ID, // clientId
                exp: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
                jti: uuid(),
                iat: Date.now()
            })
        };
        const userIdObject = await tokenService.getUserIdToken(options);
        return jwtService.verifyJTW(issuer, userIdObject.body.id_token, nonce).sub;
    }

    return Object.freeze({
        getServiceUrl,
        getUserId
    });
}

module.exports = signInService;
