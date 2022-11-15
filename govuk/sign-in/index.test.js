'use strict';

describe('Sign In service', () => {
    beforeAll(() => {
        jest.resetModules();
        jest.doMock('./issuer/index', () =>
            jest.fn(() => ({
                identify: () => 'issuer identified'
            }))
        );
        jest.doMock('./authorisation/index', () =>
            jest.fn(() => ({
                getAuthorisationURI: () => 'A_VALID_URL'
            }))
        );
    });

    it('Should identify the govuk service and construct the url necessary to sign in', async () => {
        // eslint-disable-next-line global-require
        const createSignInService = require('./index');
        const signInService = createSignInService();
        const actual = await signInService.getServiceUrl();

        expect(actual).toEqual('A_VALID_URL');
    });
});
