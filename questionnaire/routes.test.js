/* eslint-disable global-require */

'use strict';

const request = require('supertest');
const fixtureQuestionnaire = require('./fixtures/questionnaire.json');
const getKeepAlive = require('../test/test-fixtures/res/get_keep_alive');

let app;

describe('/apply routes', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () => jest.fn(() => false));
            app = require('../app');
        });

        it('Should redirect to `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe('Found. Redirecting to /apply/start-or-resume');
        });

        describe('invalid page id', () => {
            beforeEach(() => {
                jest.resetModules();
                jest.restoreAllMocks();
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureQuestionnaire,
                        keepAlive: () => getKeepAlive
                    }))
                );
                jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                    jest.fn(() => false)
                );
                app = require('../app');
            });

            it('Should respond with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply/this-page-does-not-exist');
                expect(response.statusCode).toBe(404);
            });
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
            );
            app = require('../app');
        });

        it('Should redirect to `/apply/resume/:questionnaireId` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
            );
        });

        // eslint-disable-next-line jest/no-commented-out-tests
        // it('Should redirect to `<lastpageinprogress>` page', async () => {
        //     const currentAgent = request.agent(app);
        //     const response = await currentAgent.get('/apply');
        //     const redirectionResponse = await currentAgent.get(response.headers.location);
        //     expect(redirectionResponse.res.text).toBe(
        //         'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
        //     );
        // });

        describe('invalid page id', () => {
            beforeEach(() => {
                jest.resetModules();
                jest.restoreAllMocks();
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureQuestionnaire,
                        keepAlive: () => getKeepAlive
                    }))
                );
                jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                    jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
                );
                app = require('../app');
            });

            it('Should respond with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply/this-page-does-not-exist');
                expect(response.statusCode).toBe(404);
            });
        });
    });

    /* eslint-disable jest/no-commented-out-tests */
    // describe('Hitting /apply/start', () => {
    //     describe('Uninstantiated questionnaire', () => {
    //         it('Should create a questionnaire and add the id to the session', () => {

    //         });
    //     });
    //     describe('Instantiated questionnaire', () => {
    //         it('Should create a questionnaire and add the id to the session', () => {

    //         });
    //     });
    //     describe('Unauthenticated', () => {
    //         it('Should create a questionnaire and add the id to the session', () => {

    //         });
    //     });
    //     describe('Authenticated', () => {
    //         it('Should create a questionnaire and add the id to the session', () => {

    //         });
    //     });
    // });
    /* eslint-enable jest/no-commented-out-tests */
});

describe('Hitting /apply', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () => jest.fn(() => false));
            app = require('../app');
        });

        it('Should redirect to `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe('Found. Redirecting to /apply/start-or-resume');
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
            );
            app = require('../app');
        });

        it('Should redirect to `/apply/resume/:questionnaireId` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
            );
        });
    });
});

describe('Hitting /apply/start-or-resume', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () => jest.fn(() => false));
            app = require('../app');
        });

        it('Should render the `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start-or-resume');
            expect(response.res.text).toContain('What would you like to do?');
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
            );
            app = require('../app');
        });

        it('Should redirect to `/apply/resume/:questionnaireId` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start-or-resume');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
            );
        });
    });
});

describe('Hitting /apply/start', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () => jest.fn(() => false));
            app = require('../app');
        });

        it('Should redirect to `/apply/<initialSection>`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start');
            expect(response.res.text).toContain(
                'Found. Redirecting to /apply/applicant-fatal-claim'
            );
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureQuestionnaire,
                    keepAlive: () => getKeepAlive
                }))
            );
            jest.doMock('./utils/isQuestionnaireInstantiated/index.js', () =>
                jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250')
            );
            app = require('../app');
        });

        it('Should redirect to `/apply/<initialSection>`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start');
            expect(response.res.text).toContain(
                'Found. Redirecting to /apply/applicant-fatal-claim'
            );
        });
    });
});

// uninstantiated questionnaire:
// hitting `/apply` should redirect to `/apply/start-or-resume`.
// hitting `/apply/blahblahblha` should redirect to `404`.

// instantiated questionnaire:
// hitting `/apply` should redirect to `/apply/resume/:questionnaireId`.
// hitting `/apply/blahblahblha` should redirect to `404`.

// unauthenticated:
// hitting `/account/dashboard` should redirect to `/account/sign-in`.
// hitting `/account/signed-in` should redirect to `/account/sign-in`.
// hitting `/account/sign-in` should redirect to One Login.

// authenticated:
// hitting `/account/dashboard` should render dashboard.
// hitting `/account/sign-in` should redirect dashboard.
// hitting `/account/sign-out` should unauthenticate.
// hitting `/account/sign-out` should redirect to ????.
