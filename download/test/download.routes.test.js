/* eslint-disable global-require */

'use strict';

const request = require('supertest');

const fixtureQuestionnaire = require('../../questionnaire/fixtures/questionnaire.json');
const fixtureProgressEntryOrdinal1 = require('../../questionnaire/fixtures/fixtureProgressEntryOrdinal1.json');
const fixtureProgressEntryOrdinal2 = require('../../questionnaire/fixtures/fixtureProgressEntryOrdinal2.json');
const fixture404 = require('../../questionnaire/fixtures/fixture404.json');
const getKeepAlive = require('../../test/test-fixtures/res/get_keep_alive.json');

const summaryHtml = '<!DOCTYPE html><html><head><title></title></head><body>Summary</body></html>';

let app;

const mocks = {
    '../../questionnaire/questionnaire-service': () => {
        return jest.fn(() => ({
            createQuestionnaire: () => fixtureQuestionnaire,
            keepAlive: () => getKeepAlive,
            getSection: (questionnaireId, sectionId) => {
                if (sectionId === 'p-applicant-fatal-claim') {
                    return fixtureProgressEntryOrdinal1;
                }
                if (sectionId === 'p--was-the-crime-reported-to-police') {
                    return fixtureProgressEntryOrdinal2;
                }
                return fixture404;
            },
            getPrevious: () => fixtureProgressEntryOrdinal1,
            postSection: () => {
                return {
                    statusCode: 201
                };
            }
        }));
    },
    '../../questionnaire/utils/isQuestionnaireInstantiated': () =>
        jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250'),
    '../download-helper': () => ({
        getSummaryHtml: () => summaryHtml
    })
};

function setUpCommonMocks(additionalMocks = {}) {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    const combinedMocks = {...mocks, ...additionalMocks};
    Object.keys(combinedMocks).forEach(path => {
        jest.unmock(path);
        if (combinedMocks[path] !== '__UNMOCK__') {
            jest.doMock(path, combinedMocks[path]);
        }
    });
    app = require('../../app');
}

describe('Download', () => {
    describe('Application summary', () => {
        describe('Instantiated questionnaire', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should render an application summary', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/download/application-summary');
                expect(response.statusCode).toBe(200);
                expect(response.res.text).toBe(summaryHtml);
            });
        });

        describe('Unistantiated questionnaire', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../../questionnaire/utils/isQuestionnaireInstantiated': () =>
                        jest.fn(() => false)
                });
            });

            it('Should render an application summary', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/download/application-summary');
                expect(response.statusCode).toBe(302);
                expect(response.res.text).toBe('Found. Redirecting to /apply');
            });
        });

        describe('Error', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../download-helper': () => ({
                        getSummaryHtml: () => {
                            throw new Error();
                        }
                    })
                });
            });

            it('Should fail gracefully', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/download/application-summary');
                expect(response.statusCode).toBe(404);
            });
        });
    });
});
