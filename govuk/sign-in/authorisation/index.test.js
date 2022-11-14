'use strict';

const createAuthorisationService = require('./index');

describe('authorisation service', () => {
    it('should build a correctly formed URL for authorisation', () => {
        const authorisationService = createAuthorisationService();
        const issuer = {
            metadata: {
                authorization_endpoint: 'http://www.this_is_a_host.com/'
            }
        };
        const redirectUri = 'http://www.redirect.com';
        const expected =
            'http://www.this_is_a_host.com/?scope=openid&response_type=code&client_id=RSsuV9e2KzU9IgtvOJsyZIOVy8U&redirect_uri=http%3A%2F%2Fwww.redirect.com&state=STATE&nonce=NONCE&vtr=%5BCl.Cm%5D';

        const actual = authorisationService.getAuthorisationURI(issuer, redirectUri);

        expect(actual).toEqual(expected);
    });
});
