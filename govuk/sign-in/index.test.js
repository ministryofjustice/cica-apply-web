'use strict';

describe('Sign In service', () => {
    describe('Get Service Url', () => {
        beforeAll(() => {
            jest.resetModules();
            jest.doMock('./issuer/index', () =>
                jest.fn(() => ({
                    identify: () => {
                        return {
                            metadata: {
                                authorization_endpoint: 'blah'
                            }
                        };
                    }
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
            const actual = await signInService.getAuthorisationURI();

            expect(actual).toEqual('A_VALID_URL');
        });
    });

    describe('Get UserId Token', () => {
        beforeAll(() => {
            jest.resetModules();
            jest.doMock('./token/index', () =>
                jest.fn(() => ({
                    getIdToken: () => 'A Token'
                }))
            );
        });

        it('Should return the userId token', async () => {
            // eslint-disable-next-line global-require
            const createSignInService = require('./index');
            const signInService = createSignInService();
            const actual = await signInService.getIdToken({});

            expect(actual).toEqual('A Token');
        });
    });
});
