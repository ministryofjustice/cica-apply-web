'use strict';

const {v4: uuidv4} = require('uuid');

const createJwtService = require('../jwt');
const {post} = require('../../../questionnaire/request-service')();
const createIssuerService = require('../issuer');
const {getSignedInURI} = require('../../../account/utils/getActionURIs');
const getTokenHeader = require('./utils/getTokenHeader');

function createTokenService() {
    async function getTokenData(authorisationCode) {
        if (!authorisationCode) {
            throw Error('Authorisation code is required');
        }
        const issuerService = createIssuerService();
        const jwtService = createJwtService();
        const issuer = await issuerService.identify();
        const opts = {
            url: issuer.token_endpoint,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                grant_type: 'authorization_code',
                code: authorisationCode,
                redirect_uri: getSignedInURI(),
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: jwtService.generateJWT({
                    aud: issuer.token_endpoint,
                    iss: process.env.CW_GOVUK_CLIENT_ID,
                    sub: process.env.CW_GOVUK_CLIENT_ID,
                    exp: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
                    jti: uuidv4(),
                    iat: Date.now()
                })
            }
        };

        const response = await post(opts);
        return response.body;
    }

    async function validateIdToken(idToken, nonce) {
        const issuerService = createIssuerService();
        const issuer = await issuerService.identify(); // TODO: pass in issuer in function signature.

        const jwtService = createJwtService();
        return jwtService.verifyJWT(idToken, {
            algorithms: issuer.id_token_signing_alg_values_supported,
            audience: process.env.CW_GOVUK_CLIENT_ID,
            issuer: issuer.issuer,
            nonce
        });
    }

    async function getIdToken(options) {
        const response = await getTokenData(options.authorisationCode);
        return validateIdToken(response.id_token, options.expectedNonce);
    }

    return Object.freeze({
        getTokenData,
        getIdToken,
        validateIdToken,
        getTokenHeader
    });
}

module.exports = createTokenService;
