'use strict';

const createAuthorisationService = require('./index');

describe('authorisation service', () => {
    it('should build a correctly formed URL for authorisation', () => {
        const authorisationService = createAuthorisationService();
        const host = 'http://www.this_is_a_host.com/';
        const opts = {
            redirect_uri: 'https://www.gov.uk/',
            state: 'STATE',
            nonce: 'NONCE'
        };
        const expected = `http://www.this_is_a_host.com/?scope=openid&response_type=code&client_id=${process.env.CW_GOVUK_CLIENT_ID}&vtr=%5BCl.Cm%5D&redirect_uri=https%3A%2F%2Fwww.gov.uk%2F&state=STATE&nonce=NONCE`;

        const actual = authorisationService.getAuthorisationURI(host, opts);

        expect(actual).toEqual(expected);
    });

    it('should overwrite default values with the "options" specified', () => {
        const authorisationService = createAuthorisationService();
        const host = 'http://www.this_is_a_host.com/';
        const options = {
            scope: 'closedid',
            response_type: 'chaos',
            client_id: 'iAmGuessable',
            redirect_uri: 'http://www.redirect.com',
            state: 'STATELESS',
            nonce: 'ECNON',
            vtr: '[untrusted]'
        };
        const expected =
            'http://www.this_is_a_host.com/?scope=closedid&response_type=chaos&client_id=iAmGuessable&vtr=%5Buntrusted%5D&redirect_uri=http%3A%2F%2Fwww.redirect.com&state=STATELESS&nonce=ECNON';

        const actual = authorisationService.getAuthorisationURI(host, options);

        expect(actual).toEqual(expected);
    });
});
