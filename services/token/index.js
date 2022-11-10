'use strict';

function createTokenService() {
    function getIdToken() {
        return {
            sub: 'urn:fdc:gov.uk:2024:abc123thisisnotarealuserid',
            iss: 'https://oidc.integration.account.gov.uk',
            nonce: 'aad0aa969c156b2dfa685f885fac7083',
            aud: 'YOUR_CLIENT_ID',
            exp: 1489694196,
            iat: 1489694198
        };
    }

    function validateIdToken() {
        return true;
    }

    return Object.freeze({
        getIdToken,
        validateIdToken
    });
}

module.exports = createTokenService;
