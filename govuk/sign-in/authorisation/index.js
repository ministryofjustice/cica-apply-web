'use strict';

const url = require('../utils/url');

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

    function getAuthorisationURI(host, urlSearch = {}) {
        const opts = {...defaults, ...urlSearch};
        return url.build(host, {
            search: opts
        });
    }

    return Object.freeze({
        getAuthorisationURI
    });
}

module.exports = createAuthorisationService;
