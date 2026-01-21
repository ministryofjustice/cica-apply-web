/* eslint-disable global-require */

'use strict';

const fixtureMetaResponse = require('./fixtures/questionnaire_meta-filter-user-id.json');
const fixtureSectionSAnswersResponse = require('./fixtures/questionnaire_sections_answers.json');
const fixtureSubmissionResponse = require('./fixtures/questionnaire_submissions_response.json');
const fixtureTemplateMetaResponse = require('./fixtures/questionnaire_templates_metadata.json');

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
                    return fixtureSectionSAnswersResponse;
                }),
                getSubmission: jest.fn(questionnaireId => {
                    return fixtureSubmissionResponse[questionnaireId];
                }),
                getAllTemplatesMetadata: jest.fn(() => {
                    return fixtureTemplateMetaResponse;
                })
            }));
        });
        it('Should get dashboard template data', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getApplicationData('my-test-user-id');
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
        it('Should get dashboard action template data grouped by CRN', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getActionData();
            expect(result.length).toBe(2);
            expect(result).toEqual([
                [
                    {
                        classes: 'govuk-table__cell__overflow',
                        text: 'test testcase'
                    },
                    {
                        text: '88\\888888'
                    },
                    {
                        html:
                            '<a href="/account/dashboard/manage/88-888888" class="govuk-link">View<span class=\'govuk-visually-hidden\'>View action for case 88\\888888</span></a>'
                    }
                ],
                [
                    {
                        classes: 'govuk-table__cell__overflow',
                        text: 'other testcase'
                    },
                    {
                        text: '99\\999999'
                    },
                    {
                        html:
                            '<a href="/account/dashboard/manage/99-999999" class="govuk-link">View<span class=\'govuk-visually-hidden\'>View action for case 99\\999999</span></a> <span class="moj-notification-badge"><span aria-hidden="true">1</span><span class="govuk-visually-hidden">(1)</span></span>'
                    }
                ]
            ]);
        });
    });
    describe('Given the owner has NO inflight or submitted applications', () => {
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
                }),
                getAllTemplatesMetadata: jest.fn(() => {
                    return {
                        body: {}
                    };
                })
            }));
        });
        it('Should return an empty array of in flight applications', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getApplicationData('my-test-user-id');
            expect(result).toEqual([]);
        });
        it('Should return an empty array of submitted applications', async () => {
            const createDashboardService = require('./dashboard-service');
            const dashboardService = createDashboardService();
            const result = await dashboardService.getActionData('my-test-user-id');
            expect(result).toEqual([]);
        });
    });
});
