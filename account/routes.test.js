'use strict';

const request = require('supertest');

let app;

describe('Account route service endpoint', () => {
    describe('/account/sign-in', () => {
        describe('GET', () => {
            describe('302', () => {
                beforeAll(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getServiceUrl: () => 'A_VALID_URL'
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should respond with a redirect status', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/sign-in');
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe('Found. Redirecting to A_VALID_URL');
                });
            });
            describe('404', () => {
                beforeAll(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getServiceUrl: () => {
                                throw new Error();
                            }
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should fail gracefully if the SignIn service throws an error', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/sign-in');
                    expect(response.statusCode).toBe(404);
                });
            });
        });
    });
});
