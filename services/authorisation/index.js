'use strict';

function createAuthorisationService() {
    function getAuthorisationURI(issuer) {
        const opts = {
            scope: ['openid'],
            response_type: 'code',
            client_id: 'RSsuV9e2KzU9IgtvOJsyZIOVy8U',
            redirect_uri: 'http://127.0.0.1:6987/loggedIn', // 1 of multiple that have been previously registered.
            state: 'STATE',
            nonce: 'NONCE',
            vtr: '[Cl.Cm]'
        };
        const url = `${issuer.metadata.authorization_endpoint}?scope=${opts.scope.join(
            ' '
        )}&response_type=${opts.response_type}&client_id=${opts.client_id}&redirect_uri=${
            opts.redirect_uri
        }&nonce=${opts.nonce}&state=${opts.state}&vtr=${opts.vtr}`;

        return url;
    }

    return Object.freeze({
        getAuthorisationURI
    });
}

module.exports = createAuthorisationService;
