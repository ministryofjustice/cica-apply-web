'use strict';

function createAuthorisationService() {
    const defaults = {
        scope: 'openid',
        response_type: 'code',
        client_id: 'RSsuV9e2KzU9IgtvOJsyZIOVy8U',
        redirect_uri: 'https://www.gov.uk/',
        state: 'STATE',
        nonce: 'NONCE',
        vtr: '[Cl.Cm]'
    };
    function getAuthorisationURI({issuer, options}) {
        const opts = {...defaults, ...options};
        const searchParams = new URLSearchParams(opts);
        return `${issuer.metadata.authorization_endpoint}?${searchParams.toString()}`;
    }

    return Object.freeze({
        getAuthorisationURI
    });
}

module.exports = createAuthorisationService;
