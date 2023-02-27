/* eslint-disable global-require */

'use strict';

const fixtureMetaResponse = require('./fixtures/questionnaire_meta-filter-user-id.json');
const fixturSectionSAnswersResponse = require('./fixtures/questionnaire_sections_answers.json');

describe('Dashboard service', () => {
    beforeAll(() => {
        jest.doMock('../questionnaire/request-service', () =>
            jest.fn(() => ({
                get: options => {
                    if (
                        options.url ===
                        `${process.env.CW_DCS_URL}/api/v1/questionnaires/metadata?filter[user-id]=my-test-user-id`
                    ) {
                        return fixtureMetaResponse;
                    }

                    if (
                        /[a-z:/.0-9]{0,50}\/api\/v1\/questionnaires\/[0-9a-f-]{36}\/sections\/[a-z-]{1,30}\/answers/.test(
                            options.url
                        )
                    ) {
                        return fixturSectionSAnswersResponse;
                    }

                    return {};
                }
            }))
        );
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
                    text: '24/01/2023'
                },
                {
                    html:
                        '<a href="/apply/resume/285cb104-0c15-4a9c-9840-cb1007f098fb">Continue<span class=\'govuk-visually-hidden\'> Continue application for Foo Bar</span></a>'
                }
            ]
        ]);
    });
});
