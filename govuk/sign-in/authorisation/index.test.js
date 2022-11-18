'use strict';

const createAuthorisationService = require('./index');

describe('authorisation service', () => {
    it('should build a correctly formed URL for authorisation', () => {
        const authorisationService = createAuthorisationService();
        const host = 'http://www.this_is_a_host.com/';
        const expected =
            'http://www.this_is_a_host.com/?scope=openid&response_type=code&client_id=RSsuV9e2KzU9IgtvOJsyZIOVy8U&redirect_uri=https%3A%2F%2Fwww.gov.uk%2F&state=STATE&nonce=NONCE&vtr=%5BCl.Cm%5D';

        const actual = authorisationService.getAuthorisationURI(host);

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
            'http://www.this_is_a_host.com/?scope=closedid&response_type=chaos&client_id=iAmGuessable&redirect_uri=http%3A%2F%2Fwww.redirect.com&state=STATELESS&nonce=ECNON&vtr=%5Buntrusted%5D';

        const actual = authorisationService.getAuthorisationURI(host, options);

        expect(actual).toEqual(expected);
    });
});
