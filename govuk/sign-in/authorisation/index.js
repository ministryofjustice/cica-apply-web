'use strict';

function createAuthorisationService() {
    function getAuthorisationURI(issuer, redirectUri) {
        const opts = {
            scope: ['openid'],
            response_type: 'code',
            client_id: 'RSsuV9e2KzU9IgtvOJsyZIOVy8U',
            redirect_uri: redirectUri,
            state: 'STATE',
            nonce: 'NONCE',
            vtr: '[Cl.Cm]'
        };
        const searchParams = new URLSearchParams(opts);

        return `${issuer.metadata.authorization_endpoint}?${searchParams.toString()}`;
    }

    return Object.freeze({
        getAuthorisationURI
    });
}

module.exports = createAuthorisationService;
