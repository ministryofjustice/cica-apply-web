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
    describe('/account/signed-in', () => {
        describe('GET', () => {
            /* describe('302', () => {
                beforeEach(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getUserIdToken: () => 'A Token'
                        }))
                    );
                    jest.doMock('../questionnaire/form-helper', () =>
                        jest.fn(() => ({
                            removeSectionIdPrefix: () => 'A section name'
                        }))
                    );
                    jest.doMock('../questionnaire/questionnaire-service', () => () =>
                        jest.fn(() => ({
                            getCurrentSection: () => {
                                body: {
                                    data: [
                                        {
                                            attributes: {
                                                sectionId: 'Current section'
                                            }
                                        }
                                    ]
                                }
                            }
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });
                it('Should set the session cookie', async () => {
                    let cookiePresent = false;
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/signed-in');
                    const cookies = response.header['set-cookie'];
                    cookies.forEach(cookie => {
                        console.log(cookie);
                        cookiePresent = cookie.startsWith('session=') ? true : cookiePresent;
                    });
                    expect(cookiePresent).toBe(true);

                });
                it('Should respond with a redirect status', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/signed-in');
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe('Found. Redirecting to a Section name');
                });
            }); */
            describe('404', () => {
                beforeAll(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getUserIdToken: () => {
                                throw new Error();
                            }
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should fail gracefully if the SignIn service throws an error', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/signed-in');
                    expect(response.statusCode).toBe(404);
                });
            });
            describe('500', () => {
                beforeAll(() => {
                    jest.resetModules();
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should fail gracefully if the govuk service throws an error', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get(
                        '/account/signed-in?error=an_error&error_description=An_error_description'
                    );
                    expect(response.statusCode).toBe(500);
                });
            });
        });
    });
    describe('/account/sign-out', () => {
        describe('GET', () => {
            describe('302', () => {
                beforeAll(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getLogoutUrl: () => 'A_VALID_URL'
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should respond with a redirect status', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/sign-out');
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe('Found. Redirecting to A_VALID_URL');
                });
            });
            describe('404', () => {
                beforeAll(() => {
                    jest.resetModules();
                    jest.doMock('../govuk/sign-in/index', () =>
                        jest.fn(() => ({
                            getLogoutUrl: () => {
                                throw new Error();
                            }
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });

                it('Should fail gracefully if the SignIn service throws an error', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.get('/account/sign-out');
                    expect(response.statusCode).toBe(404);
                });
            });
        });
    });
});
