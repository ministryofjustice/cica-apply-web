'use strict';

const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const createIssuerService = require('../issuer');
const getTokenHeader = require('../token/utils/getTokenHeader');

function createJwtService() {
    function generateJWT(tokenContents, privateKey = process.env.CW_GOVUK_PRIVATE_KEY) {
        return jwt.sign(tokenContents, privateKey, {algorithm: 'RS256'});
    }

    function decodeJWT(token) {
        return jwt.decode(token);
    }

    async function verifyJWT(token, options) {
        const issuerService = createIssuerService();
        const jwksUri = await issuerService.getJwtKeysUri();
        const client = jwksClient({
            jwksUri,
            requestHeaders: {
                'user-agent': 'cica-web'
            }
        });
        const tokenHeader = getTokenHeader(token);
        const signingKey = await client.getSigningKey(tokenHeader.kid);
        return jwt.verify(token, signingKey.publicKey || signingKey.rsaPublicKey, options);
    }

    return Object.freeze({
        generateJWT,
        decodeJWT,
        verifyJWT
    });
}

module.exports = createJwtService;
