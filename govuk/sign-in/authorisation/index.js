'use strict';

function createAuthorisationService() {
    const defaults = {
        scope: 'openid',
        response_type: 'code',
        client_id: 'RSsuV9e2KzU9IgtvOJsyZIOVy8U',
        state: 'STATE',
        nonce: 'NONCE',
        vtr: '[Cl.Cm]'
    };
    function getAuthorisationURI({issuer, redirectUri, options = defaults}) {
        const opts = {
            scope: options.scope,
            response_type: options.response_type,
            client_id: options.client_id,
            redirect_uri: redirectUri,
            state: options.state,
            nonce: options.nonce,
            vtr: options.vtr
        };
        const searchParams = new URLSearchParams(opts);

        return `${issuer.metadata.authorization_endpoint}?${searchParams.toString()}`;
    }

    return Object.freeze({
        getAuthorisationURI
    });
}

module.exports = createAuthorisationService;
