'use strict';

const request = require('supertest');

const fixtureTemplate = require('../../test/test-fixtures/aar/template.json');
const fixtureProgressEntryTemplateSectionInitial = require('../../test/test-fixtures/aar/progress-entry-template-section-initial.json');

const summaryHtml = '<!DOCTYPE html><html><head><title></title></head><body>Summary</body></html>';

let app;

describe('Download route service endpoint', () => {
    describe('Cica-web /download/application-summary route', () => {
        describe('/download/application-summary', () => {
            describe('GET', () => {
                describe('200', () => {
                    beforeEach(() => {
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => fixtureProgressEntryTemplateSectionInitial,
                                createQuestionnaire: () => fixtureTemplate
                            }))
                        );
                        jest.doMock('../download-helper', () => ({
                            getSummaryHtml: () => summaryHtml
                        }));

                        Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
                        // eslint-disable-next-line global-require
                        app = require('../../app');
                    });

                    it('Should respond with a success status', async () => {
                        const currentAgent = request.agent(app);
                        await currentAgent.get('/apply/');
                        const response = await currentAgent.get('/download/application-summary');
                        expect(response.statusCode).toBe(200);
                        expect(response.res.text).toBe(summaryHtml);
                    });
                });
                describe('404', () => {
                    beforeEach(() => {
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => fixtureProgressEntryTemplateSectionInitial,
                                createQuestionnaire: () => fixtureTemplate
                            }))
                        );
                        jest.doMock('../download-helper', () => ({
                            getSummaryHtml: () => {
                                throw new Error();
                            }
                        }));

                        // eslint-disable-next-line global-require
                        app = require('../../app');
                    });
                    it('Should fail gracefully if the download helper throws an error', async () => {
                        const currentAgent = request.agent(app);
                        await currentAgent.get('/apply/');
                        const response = await currentAgent.get('/download/application-summary');
                        expect(response.statusCode).toBe(404);
                    });
                });

                describe('Questionnaire not instantiated', () => {
                    beforeEach(() => {
                        jest.resetModules();
                        jest.doMock('../../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                getSection: () => fixtureProgressEntryTemplateSectionInitial,
                                createQuestionnaire: () => fixtureTemplate
                            }))
                        );
                        jest.doMock('../download-helper', () => ({
                            getSummaryHtml: () => summaryHtml
                        }));
                        jest.doMock('../../questionnaire/utils/isQuestionnaireInstantiated', () =>
                            jest.fn(() => false)
                        );
                        // eslint-disable-next-line global-require
                        app = require('../../app');
                    });

                    it('Should load the skeleton of an application summary', async () => {
                        const currentAgent = request.agent(app);
                        await currentAgent.get('/apply/');
                        const response = await currentAgent.get('/download/application-summary');
                        expect(response.statusCode).toBe(200);
                        expect(response.res.text).toBe(summaryHtml);
                    });
                });
            });
        });
    });
});
