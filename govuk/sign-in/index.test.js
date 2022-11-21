'use strict';

describe('Sign In service', () => {
    describe('Get Service Url', () => {
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

    describe('Get UserId Token', () => {
        beforeAll(() => {
            jest.resetModules();
            jest.doMock('./token/index', () =>
                jest.fn(() => ({
                    getUserIdToken: () => {
                        return {
                            body: {
                                id_token: 'A token'
                            }
                        };
                    }
                }))
            );
            jest.doMock('../../utils/jwt/index', () =>
                jest.fn(() => ({
                    generateJWT: () => 'A signed Token',
                    verifyJTW: () => {
                        return {
                            sub: 'A Token'
                        };
                    }
                }))
            );
            jest.doMock('./issuer/index', () =>
                jest.fn(() => ({
                    identify: () => {
                        return {token_endpoint: 'http://token-endpoint.com'};
                    }
                }))
            );
        });

        it('Should return the userId token', async () => {
            // eslint-disable-next-line global-require
            const createSignInService = require('./index');
            const signInService = createSignInService();
            const actual = await signInService.getUserId({});

            expect(actual).toEqual('A Token');
        });
    });
});
