'use strict';

// const request = require('../../../questionnaire/request-service')();

function createTokenService() {
    async function getUserIdToken(options) {
        /* const opts = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                grant_type: 'authorization_code',
                code: options.code,
                redirect_uri: options.redirect_uri,
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: {/!* JWT token goes here *!/ }
            }
        };

        return request.post('https://oidc.integration.account.gov.uk/token', opts); */
        console.log(options);

        return 'I am a token';
    }

    return Object.freeze({
        getUserIdToken
    });
}

module.exports = createTokenService;
