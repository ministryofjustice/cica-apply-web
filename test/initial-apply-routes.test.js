'use strict';

const request = require('supertest');

const fixtureTemplate = require('./test-fixtures/aar/template.json');
const fixtureProgressEntryTemplateSectionInitial = require('./test-fixtures/aar/progress-entry-template-section-initial.json');
const fixtureSessionKeepAlive = require('./test-fixtures/aar/session-keepalive.json');

let app;

function resetMocks() {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.unmock('../questionnaire/questionnaire-service');
    jest.unmock('../questionnaire/utils/isQuestionnaireInstantiated');
}

function getCsrfTokenFromResponse(input) {
    return input.match(/<input(?:.*?)name="_csrf"(?:.*)value="([^"]+).*>/)[1];
}

describe('/apply', () => {
    describe('GET /apply', () => {
        describe('questionnaireId not in session', () => {
            beforeAll(() => {
                resetMocks();
                // eslint-disable-next-line global-require
                app = require('../app');
            });
            it('Should render the "new or existing" question page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply');
                expect(response.statusCode).toBe(200);
                expect(response.res.text).toMatch(/(What would you like to do\?)/);
            });
        });
        describe('questionnaireId in session', () => {
            beforeAll(() => {
                resetMocks();
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        getFirstSection: () => fixtureProgressEntryTemplateSectionInitial,
                        keepAlive: () => fixtureSessionKeepAlive
                    }))
                );
                jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                    jest.fn(() => true)
                );
                // eslint-disable-next-line global-require
                app = require('../app');
            });
            it('Should render the first section of the template', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply');
                expect(response.res.text).toBe(
                    'Found. Redirecting to /apply/applicant-fatal-claim'
                );
            });
        });
    });
    describe('POST /apply', () => {
        describe('No start-type parameter', () => {
            beforeAll(() => {
                resetMocks();
                // eslint-disable-next-line global-require
                app = require('../app');
            });
            it('Should render page with an error', async () => {
                const currentAgent = request.agent(app);
                const getResponse = await currentAgent.get('/apply');
                const currentCsrfToken = getCsrfTokenFromResponse(getResponse.res.text);
                const response = await currentAgent.post('/apply').send({
                    _csrf: currentCsrfToken
                });
                expect(response.res.text).toMatch(/(Select what you would like to do)/);
            });
        });
        describe('Invalid start-type parameter', () => {
            beforeAll(() => {
                resetMocks();
                // eslint-disable-next-line global-require
                app = require('../app');
            });
            it('Should render page with an error', async () => {
                const currentAgent = request.agent(app);
                const getResponse = await currentAgent.get('/apply');
                const currentCsrfToken = getCsrfTokenFromResponse(getResponse.res.text);
                const response = await currentAgent.post('/apply').send({
                    'start-type': 'foo',
                    _csrf: currentCsrfToken
                });
                expect(response.res.text).toMatch(/(Select what you would like to do)/);
            });
        });
        describe('Valid start-type parameter', () => {
            describe('start-type: "existing"', () => {
                beforeAll(() => {
                    resetMocks();
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });
                it('Should redirect to log in action', async () => {
                    const currentAgent = request.agent(app);
                    const getResponse = await currentAgent.get('/apply');
                    const currentCsrfToken = getCsrfTokenFromResponse(getResponse.res.text);
                    const response = await currentAgent.post('/apply').send({
                        'start-type': 'existing',
                        _csrf: currentCsrfToken
                    });
                    expect(response.res.text).toBe('Found. Redirecting to /account/sign-in');
                });
            });
            describe('start-type: "new"', () => {
                beforeAll(() => {
                    resetMocks();
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            createQuestionnaire: () => fixtureTemplate,
                            keepAlive: () => fixtureSessionKeepAlive
                        }))
                    );
                    // eslint-disable-next-line global-require
                    app = require('../app');
                });
                it('Should redirect to /apply', async () => {
                    const currentAgent = request.agent(app);
                    const getResponse = await currentAgent.get('/apply');
                    const currentCsrfToken = getCsrfTokenFromResponse(getResponse.res.text);
                    const response = await currentAgent.post('/apply').send({
                        'start-type': 'new',
                        _csrf: currentCsrfToken
                    });
                    expect(response.res.text).toBe(
                        'Found. Redirecting to /apply/applicant-fatal-claim'
                    );
                });
            });
        });
    });
});
