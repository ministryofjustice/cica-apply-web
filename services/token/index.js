'use strict';

const {uuid} = require('uuidv4');

const createJwtService = require('../jwt');
const {post} = require('../request');
// const createIssuerService = require('../issuer');
const {getSignedInURI} = require('../../account/utils/getActionURIs');
const config = require('../../config');

function createTokenService() {
    async function getTokenData(authorisationCode) {
        if (!authorisationCode) {
            throw Error('Authorisation code is required');
        }

        const jwtService = createJwtService();
        const opts = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                grant_type: 'authorization_code',
                code: authorisationCode,
                redirect_uri: getSignedInURI(),
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: jwtService.generateJWT({
                    aud: 'https://oidc.integration.account.gov.uk/token',
                    iss: config.clientId, // client id.
                    sub: config.clientId,
                    exp: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
                    jti: uuid(),
                    iat: Date.now()
                })
            }
        };

        const response = await post('https://oidc.integration.account.gov.uk/token', opts);
        return response.body;
    }

    async function getIdToken(authorisationCode) {
        const response = await getTokenData(authorisationCode);
        const tokenData = JSON.parse(response);
        return tokenData.id_token;
    }

    async function validateIdToken(idToken) {
        const jwtService = createJwtService();
        // const issuerService = createIssuerService();
        // const issuer = await issuerService.identify();
        // remove milliseconds precision to match the token precision.
        // const now = parseInt(`${Date.now()}`.slice(0, -3), 10);

        const decodedToken = jwtService.decodeJWT(idToken);

        // // https://docs.sign-in.service.gov.uk/integrate-with-integration-environment/integrate-with-code-flow/#validate-your-id-token
        // if (decodedToken.iss !== issuer.issuer) {
        //     throw Error('issuer mismatch!');
        // }

        // if (decodedToken.aud !== config.clientId) {
        //     throw Error('client ID mismatch!');
        // }

        // // TODO: https://docs.sign-in.service.gov.uk/integrate-with-integration-environment/integrate-with-code-flow/#validate-your-id-token
        // // jwtService.verifyJWT(tokenData.id_token);
        // // You must validate the signature according to the JSON Web Signature Specification. You must first validate that the JWT alg header matches what was returned from the jwks_uri. Then you can use the value of the JWT alg header parameter to validate the ID token. Your application must use the keys provided by the discovery endpoint.

        // if (decodedToken.exp <= now) {
        //     throw Error('token has expired!');
        // }

        // if (decodedToken.nonce !== config.nonce) {
        //     throw Error('nonce mismatch!');
        // }

        // if (!(decodedToken.iat <= now && now <= decodedToken.exp)) {
        //     throw Error('outwith token issued date and token expiry date!');
        // }

        return decodedToken;
    }

    return Object.freeze({
        getTokenData,
        getIdToken,
        validateIdToken
    });
}

module.exports = createTokenService;
