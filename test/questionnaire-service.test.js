'use strict';

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');
const getValidSection = require('./test-fixtures/res/get_schema_valid');
const getValidPreviousSection = require('./test-fixtures/res/get_previous_valid');
const getValidSubmission = require('./test-fixtures/res/get_submission_not_started');
const postValidSubmission = require('./test-fixtures/res/post_valid_submission');

const validPostResponse = {valid: true};

describe('Questionnaire service', () => {
    describe('createQuestionnaire', () => {
        it('Should create a new questionnaire', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    post: () => createQuestionnaire
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.createQuestionnaire();

            expect(response).toEqual(createQuestionnaire);
        });
    });
    describe('getSection', () => {
        it('Should get a section', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidSection
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.getSection(
                'questionnaire-id',
                'p-some-section'
            );

            expect(response).toEqual(getValidSection);
        });
    });
    describe('postSection', () => {
        it('Should post a sections answers', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    post: () => validPostResponse
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.postSection(
                'questionnaire-id',
                'p-some-section',
                {answer: true}
            );

            expect(response).toEqual(validPostResponse);
        });
    });
    describe('getPrevious', () => {
        it('Should get a previous section', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidPreviousSection
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.getPrevious(
                'questionnaire-id',
                'p-some-section'
            );

            expect(response).toEqual(getValidPreviousSection);
        });
    });
    describe('getCurrentSection', () => {
        it('Should get the current section', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidSection
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.getCurrentSection('questionnaire-id');

            expect(response).toEqual(getValidSection);
        });
    });
    describe('getSubmission', () => {
        it('Should get a submission status', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidSubmission
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.getSubmission('questionnaire-id');

            expect(response).toEqual(getValidSubmission);
        });
    });
    describe('postSubmission', () => {
        it('Should post a submission', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    post: () => postValidSubmission
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.postSubmission('questionnaire-id');

            expect(response).toEqual(postValidSubmission);
        });
    });
});
