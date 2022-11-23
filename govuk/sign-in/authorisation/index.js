'use strict';

const url = require('../utils/url');

function createAuthorisationService() {
    const defaults = {
        scope: 'openid',
        response_type: 'code',
        client_id: process.env.CW_GOVUK_CLIENT_ID,
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
