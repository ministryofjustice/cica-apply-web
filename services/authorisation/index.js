'use strict';

const {getSignedInURI} = require('../../account/utils/getActionURIs');
const config = require('../../config');

function createAuthorisationService() {
    function getAuthorisationURI(issuer, referrerUri) {
        const opts = {
            scope: ['openid'],
            response_type: 'code',
            client_id: config.clientId,
            redirect_uri: getSignedInURI(), // 1 of multiple that have been previously registered.
            state: referrerUri,
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
