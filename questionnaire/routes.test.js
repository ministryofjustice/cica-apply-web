/* eslint-disable global-require */

'use strict';

const request = require('supertest');
const createQuestionnaire = require('../test/test-fixtures/res/get_questionnaire.json');
const getKeepAlive = require('../test/test-fixtures/res/get_keep_alive');

let app;

describe('/apply routes', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.restoreAllMocks();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => createQuestionnaire,
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
                    createQuestionnaire: () => createQuestionnaire,
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
