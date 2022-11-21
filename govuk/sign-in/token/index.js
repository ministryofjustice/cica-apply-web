'use strict';

const request = require('../../../questionnaire/request-service')();

function createTokenService() {
    async function getUserIdToken(options) {
        const opts = {
            url: options.tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                grant_type: 'authorization_code',
                code: options.code,
                redirect_uri: options.redirectUri,
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: options.assertion
            }
        };
        return request.post(opts);
    }

    return Object.freeze({
        getUserIdToken
    });
}

module.exports = createTokenService;
