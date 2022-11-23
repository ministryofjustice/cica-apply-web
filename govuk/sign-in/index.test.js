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
                    getUserIdToken: () => 'A Token'
                }))
            );
        });

        it('Should return the userId token', async () => {
            // eslint-disable-next-line global-require
            const createSignInService = require('./index');
            const signInService = createSignInService();
            const actual = await signInService.getUserIdToken({});

            expect(actual).toEqual('A Token');
        });
    });

    describe('Get logout URL', () => {
        beforeAll(() => {
            jest.resetModules();
            jest.doMock('./issuer/index', () =>
                jest.fn(() => ({
                    identify: () => {
                        return {
                            end_session_endpoint: 'http://a-log-out-endpoint.com'
                        };
                    }
                }))
            );
        });
        it('Should return the logout URL', async () => {
            // eslint-disable-next-line global-require
            const createSignInService = require('./index');
            const signInService = createSignInService();
            const actual = await signInService.getLogoutUrl();

            expect(actual).toEqual('http://a-log-out-endpoint.com');
        });
    });
});
