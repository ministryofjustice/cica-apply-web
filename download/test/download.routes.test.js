'use strict';

const request = require('supertest');

const createQuestionnaire = require('../../test/test-fixtures/res/get_questionnaire.json');
const getSectionValid = require('../../test/test-fixtures/res/get_schema_valid');

const summaryHtml = '<!DOCTYPE html><html><head><title></title></head><body>Summary</body></html>';

let app;

describe('Download route service endpoint', () => {
    describe('Cica-web /download/application-summary route', () => {
        describe('/download/application-summary', () => {
            describe('GET', () => {
                describe('200', () => {
                    beforeAll(() => {
                        const initial = 'p-applicant-declaration';
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => getSectionValid,
                                createQuestionnaire: () => createQuestionnaire
                            }))
                        );
                        jest.doMock('../../questionnaire/form-helper', () => ({
                            removeSectionIdPrefix: () => initial
                        }));
                        jest.doMock('../download-helper', () => ({
                            getSummaryHtml: () => summaryHtml
                        }));

                        Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
                        // eslint-disable-next-line global-require
                        app = require('../../app');
                    });

                    it('Should respond with a success status', async () => {
                        const currentAgent = request.agent(app);
                        return currentAgent.get('/apply/').then(() =>
                            currentAgent
                                .get('/download/application-summary')
                                .set(
                                    'Cookie',
                                    'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                                )
                                .then(response => {
                                    expect(response.statusCode).toBe(200);
                                    expect(response.res.text).toBe(summaryHtml);
                                })
                        );
                    });
                });
                describe('404', () => {
                    it('Should fail gracefully if the download helper throws an error', async () => {
                        const initial = 'p-applicant-declaration';
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                createQuestionnaire: () => createQuestionnaire
                            }))
                        );
                        jest.doMock('../../questionnaire/form-helper', () => ({
                            removeSectionIdPrefix: () => initial
                        }));

                        // eslint-disable-next-line global-require
                        app = require('../../app');
                        jest.doMock('../download-helper', () => ({
                            getSummaryHtml: () => {
                                throw new Error();
                            }
                        }));
                        const currentAgent = request.agent(app);
                        return currentAgent.get('/apply/').then(() => {
                            currentAgent
                                .get('/download/application-summary')
                                .set(
                                    'Cookie',
                                    'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                                )
                                .then(response => {
                                    expect(response.statusCode).toBe(404);
                                });
                        });
                    });
                });

                describe('Session Cookie not present', () => {
                    beforeAll(() => {
                        const initial = 'applicant-declaration';
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                createQuestionnaire: () => createQuestionnaire
                            }))
                        );
                        jest.doMock('../../questionnaire/form-helper', () => ({
                            removeSectionIdPrefix: () => initial
                        }));
                        // eslint-disable-next-line global-require
                        app = require('../../app');
                    });

                    it('Should redirect the user to the inital page if the application-summary page is selected without a session', () =>
                        request
                            .agent(app)
                            .get('/download/application-summary')
                            .then(response => {
                                expect(response.res.text).toBe(
                                    'Found. Redirecting to /apply/applicant-declaration'
                                );
                            }));
                });
            });
        });
    });
});
