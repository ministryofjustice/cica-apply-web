/* eslint-disable global-require */

'use strict';

const fixtureMetaResponse = require('./fixtures/questionnaire_meta-filter-user-id.json');
const fixturSectionSAnswersResponse = require('./fixtures/questionnaire_sections_answers.json');

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
});

describe('Dashboard service', () => {
    describe('Given the owner has SOME inflight applications', () => {
        beforeAll(() => {
            jest.doMock('../questionnaire/questionnaire-service', () => () => ({
                getAllQuestionnairesMetadata: jest.fn(() => {
                    return fixtureMetaResponse;
                }),
                getSectionAnswers: jest.fn(() => {
                    return fixturSectionSAnswersResponse;
                })
            }));
        });
        it('Should get dashboard template data', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getTemplateData('my-test-user-id');
            expect(result).toEqual([
                [
                    {
                        classes: 'govuk-table__cell__overflow',
                        text: 'Foo Bar'
                    },
                    {
                        attributes: {
                            'data-sort-value': 1674536706000
                        },
                        text: '24 January 2023'
                    },
                    {
                        html:
                            '<a href="/apply/resume/285cb104-0c15-4a9c-9840-cb1007f098fb" class="govuk-link">Continue<span class=\'govuk-visually-hidden\'> Continue application for Foo Bar</span></a>'
                    }
                ]
            ]);
        });
    });
    describe('Given the owner has NO inflight applications', () => {
        beforeAll(() => {
            jest.doMock('../questionnaire/questionnaire-service', () => () => ({
                getAllQuestionnairesMetadata: jest.fn(() => {
                    return {
                        body: {}
                    };
                }),
                getSectionAnswers: jest.fn(() => {
                    return {
                        body: {}
                    };
                })
            }));
        });
        it('Should return and empty array', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getTemplateData('my-test-user-id');
            expect(result).toEqual([]);
        });
    });
});
