'use strict';

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');
const getValidSection = require('./test-fixtures/res/get_schema_valid');
const getValidPreviousSection = require('./test-fixtures/res/get_previous_valid_sectionId');
const getValidSubmission = require('./test-fixtures/res/get_submission_not_started');
const getValidCompletedSubmission = require('./test-fixtures/res/get_submission_valid');
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
    describe('timeout', () => {
        jest.useFakeTimers();
        it('waits a defined number of millisecond before returning', () => {
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            questionnaireService.timeout(1000);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
        });
    });
    describe('getSubmissionStatus', () => {
        it('Returns the status if completed is true', async () => {
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidCompletedSubmission
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const expected = {
                caseReferenceNumber: null,
                questionnaireId: '2c3c6ecd-aa68-4a00-8093-300cae6cbfcb',
                status: 'COMPLETE',
                submitted: true
            };
            const response = await questionnaireService.getSubmissionStatus(
                'questionnaire-id',
                Date.now()
            );

            expect(expected).toEqual(response);
        });
        /*  it('Returns continues to check for 15 seconds', async () => {
            jest.useFakeTimers();
            jest.doMock('../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getValidSubmission
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            await questionnaireService.getSubmissionStatus(
                'questionnaire-id',
                Date.now()
            );

            expect(setTimeout).toHaveBeenCalledTimes(15);
        });
        it('Should return a 504 error if it is called with a time older than 15 seconds ago.', async () => {
            jest.resetModules();
            // eslint-disable-next-line global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();
            const response = await questionnaireService.getSubmissionStatus(
                'questionnaire-id',
                Date.now() - 16000
            );

            expect(response).toThrow('The upstream server took too long to respond');
        }); */
    });
});
