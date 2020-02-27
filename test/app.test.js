'use strict';

const request = require('supertest');
const csrf = require('csurf');

let app;

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');

function replaceCsrfMiddlwareForTest(expressApp) {
    // TODO: find a better way to do this
    // because I cannot alter the contents of the variable that
    // is passed in to the `app.use()` method within the app.js,
    // I need to butcher the stack from the outside so that the
    // csrf stuff is altered after initialisation. If the csrf
    // stuff was extracted out its own middleware then we could
    // just that js file instead.
    // eslint-disable-next-line no-underscore-dangle
    const middlewareStack = expressApp._router.stack;
    let csrfMiddlewareStackIndex = -1;
    let newCsrfMiddlewareStackItem = [];
    let newCsrfMiddlewareStackIndex = -1;
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            csrfMiddlewareStackIndex = index;
        }
    });
    if (csrfMiddlewareStackIndex > -1) {
        // eslint-disable-next-line no-underscore-dangle
        expressApp._router.stack.splice(csrfMiddlewareStackIndex, 1);
    }

    const csrfProtection = csrf({
        cookie: false,
        sessionKey: 'cicaSession',
        ignoreMethods: ['GET', 'POST']
    });
    expressApp.use(csrfProtection);

    // look for the new csrf middleware. it should be the last item.
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            // get a copy of the new middleware.
            newCsrfMiddlewareStackItem = layer;
            newCsrfMiddlewareStackIndex = index;
            // remove it from the stack.
            // eslint-disable-next-line no-underscore-dangle
            expressApp._router.stack.splice(newCsrfMiddlewareStackIndex, 1);
        }
    });
    // eslint-disable-next-line no-underscore-dangle
    expressApp._router.stack.splice(csrfMiddlewareStackIndex, 0, newCsrfMiddlewareStackItem);
}

describe('App.js use functions', () => {
    describe('CSRF error handling', () => {
        beforeAll(() => {
            const prefixedSection = 'p-applicant-enter-your-name';
            const section = 'applicant-enter-your-name';
            const processedAnswer = {'q-applicant-title': 'Mr'};
            const err = Error(`Bad CSRF Token`);
            err.name = 'EBADCSRFTOKEN';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            jest.resetModules();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    postSection: () => {
                        throw err;
                    },
                    createQuestionnaire: () => createQuestionnaire
                }))
            );
            jest.doMock('../questionnaire/form-helper', () => ({
                addPrefix: () => prefixedSection,
                removeSectionIdPrefix: () => section,
                processRequest: () => processedAnswer
            }));
            // eslint-disable-next-line global-require
            app = require('../app');
        });

        it('Should throw a 403 with a bad token error', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply/');
            const response = await currentAgent.post('/apply/applicant-enter-your-name');

            expect(response.statusCode).toBe(403);
            expect(response.res.text.replace(/\s+/g, '')).toContain(
                '<h1 class="govuk-heading-xl">Your application has timed out</h1>'.replace(
                    /\s+/g,
                    ''
                )
            );
        });
    });
    describe('DCS error handling', () => {
        beforeAll(() => {
            const err = Error(`The service is currently unavailable`);
            err.name = 'DCSUnavailable';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            const section = 'applicant-enter-your-name';
            jest.resetModules();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => createQuestionnaire,
                    postSubmission: () => true,
                    getSubmissionStatus: () => {
                        throw err;
                    }
                }))
            );
            jest.doMock('../questionnaire/form-helper', () => ({
                removeSectionIdPrefix: () => section
            }));
            // eslint-disable-next-line global-require
            app = require('../app');

            replaceCsrfMiddlwareForTest(app);
        });

        it('Should throw a 500 with a DCS unavailable error', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply/');
            const response = await currentAgent.post('/apply/submission/confirm');

            expect(response.statusCode).toBe(500);
            expect(response.res.text.replace(/\s+/g, '')).toContain(
                'Contact us after 2 days if you have not got an email from us.'.replace(/\s+/g, '')
            );
        });
    });
    describe('Reference number error handling', () => {
        beforeAll(() => {
            const err = Error(`Unable to retrieve questionnaire submission status`);
            err.name = 'CRNNotRetrieved';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            const section = 'applicant-enter-your-name';
            jest.resetModules();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => createQuestionnaire,
                    postSubmission: () => {
                        throw err;
                    }
                }))
            );
            jest.doMock('../questionnaire/form-helper', () => ({
                removeSectionIdPrefix: () => section
            }));
            // eslint-disable-next-line global-require
            app = require('../app');

            replaceCsrfMiddlwareForTest(app);
        });

        it('Should throw a 500 with a message bus down error', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply/');
            const response = await currentAgent.post('/apply/submission/confirm');

            expect(response.statusCode).toBe(500);
            expect(response.res.text.replace(/\s+/g, '')).toContain(
                'Contact us after 30 minutes if you have not got an email from us.'.replace(
                    /\s+/g,
                    ''
                )
            );
        });
    });
});
