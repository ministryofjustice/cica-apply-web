'use strict';

const request = require('supertest');

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');

const getCurrentSection = require('./test-fixtures/res/get_current_section_valid');
const getSectionValid = require('./test-fixtures/res/get_schema_valid');
const getSectionHtmlValid = require('./test-fixtures/transformations/resolved html/p-some-section');

const summaryHtml = '<!DOCTYPE html><html><head><title></title></head><body>Summary</body></html>';

let app;

describe('Download route service endpoint', () => {
    describe('Cica-web /apply/download-summary route', () => {
        describe('/apply/download-summary', () => {
            describe('GET', () => {
                describe('200', () => {
                    beforeAll(() => {
                        const prefixedSection = 'p-applicant-enter-your-name';
                        const initial = 'p-applicant-declaration';
                        jest.resetModules();
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => getSectionValid,
                                createQuestionnaire: () => createQuestionnaire,
                                getCurrentSection: () => getCurrentSection
                            }))
                        );
                        jest.doMock('../questionnaire/form-helper', () => ({
                            addPrefix: () => prefixedSection,
                            getSectionHtml: () => getSectionHtmlValid,
                            removeSectionIdPrefix: () => initial,
                            getSectionContext: () => undefined
                        }));
                        jest.doMock('../questionnaire/download-helper', () => ({
                            getSummaryHtml: () => summaryHtml
                        }));

                        Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });

                    it('Should respond with a success status', async () => {
                        const currentAgent = request.agent(app);
                        return currentAgent.get('/apply/').then(() =>
                            currentAgent
                                .get('/apply/download-summary')
                                .set(
                                    'Cookie',
                                    'cicaSession=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                                )
                                .then(response => {
                                    expect(response.statusCode).toBe(200);
                                    expect(response.res.text).toBe(summaryHtml);
                                })
                        );
                    });
                });
                describe('404', () => {
                    beforeAll(() => {
                        const prefixedSection = 'p-applicant-enter-your-name';
                        const initial = 'p-applicant-declaration';
                        jest.resetModules();
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => getSectionValid,
                                createQuestionnaire: () => createQuestionnaire,
                                getCurrentSection: () => getCurrentSection
                            }))
                        );
                        jest.doMock('../questionnaire/form-helper', () => ({
                            addPrefix: () => prefixedSection,
                            getSectionHtml: () => getSectionHtmlValid,
                            removeSectionIdPrefix: () => initial,
                            getSectionContext: () => undefined
                        }));
                        jest.doMock('../questionnaire/download-helper', () => ({
                            getSummaryHtml: () => {
                                throw new Error();
                            }
                        }));

                        Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });

                    it('Should fail gracefully', async () => {
                        const currentAgent = request.agent(app);
                        return currentAgent.get('/apply/').then(() => {
                            currentAgent
                                .get('/apply/download-summary')
                                .set(
                                    'Cookie',
                                    'cicaSession=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                                )
                                .then(response => {
                                    expect(response.statusCode).toBe(404);
                                });
                        });
                    });
                });
            });
        });
    });
});
