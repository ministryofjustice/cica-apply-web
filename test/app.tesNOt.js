'use strict';

const request = require('supertest');

let app;

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');
const getCurrentSection = require('./test-fixtures/res/get_current_section_valid');
const getSectionHtmlValid = require('./test-fixtures/transformations/resolved html/p-some-section');
const getProgressEntries = require('./test-fixtures/res/progress_entry_example');

const err = Error(`Bad CSRF Token`);
err.name = 'HTTPError';
err.code = 'EBADCSRFTOKEN';
err.statusCode = 500;
err.error = '500 Internal Server Error';

describe('App.js use functions', () => {
    describe('CSRF error handling', () => {
        beforeAll(() => {
            const prefixedSection = 'p-applicant-enter-your-name';
            const section = 'applicant-enter-your-name';
            const processedAnswer = {'q-applicant-title': 'Mr'};
            jest.resetModules();
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    postSection: () => getProgressEntries,
                    createQuestionnaire: () => createQuestionnaire,
                    getCurrentSection: () => getCurrentSection
                }))
            );
            jest.doMock('../questionnaire/form-helper', () => ({
                addPrefix: () => prefixedSection,
                getSectionHtmlWithErrors: () => getSectionHtmlValid,
                removeSectionIdPrefix: () => section,
                processRequest: () => processedAnswer,
                getNextSection: () => section
            }));
            // eslint-disable-next-line global-require
            app = require('../app');

            /** *********************************************************
             * Disable the middleware here to generate the bad token error
             * ********************************************************** */

            // replaceCsrfMiddlwareForTest(app);
        });

        it('Should throw a 403 with a bad token error', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply/');
            const response = await currentAgent.post('/apply/applicant-enter-your-name');

            expect(response.statusCode).toBe(403);
            expect(response.res.text.replace(/\s+/g, '')).toContain(
                '<h1 class="govuk-heading-xl">The service is currently unavailable</h1>'.replace(
                    /\s+/g,
                    ''
                )
            );
        });
    });
});
