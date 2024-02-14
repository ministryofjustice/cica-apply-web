'use strict';

const createQuestionnaireService = require('../questionnaire/questionnaire-service');

function createDashboardService(ownerId) {
    const questionnaireService = createQuestionnaireService({ownerId});
    async function getFlatQuestionnaireMetadataByUserId() {
        const metadataCollection = await questionnaireService.getAllQuestionnairesMetadata();
        return (metadataCollection.body.data || []).map(metadatum => {
            return {
                questionnaireId: metadatum.attributes['questionnaire-id'],
                expires: metadatum.attributes.expires,
                analyticsId: metadatum.attributes?.['analytics-id']
            };
        });
    }

    async function getTemplateData() {
        const dataset = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const flatMetadata of await getFlatQuestionnaireMetadataByUserId()) {
            const answers = await questionnaireService.getSectionAnswers(
                flatMetadata.questionnaireId,
                'p-applicant-enter-your-name'
            );
            dataset.push({
                ...flatMetadata,
                answers: {
                    'q-applicant-title': '',
                    'q-applicant-first-name': '',
                    'q-applicant-last-name': '',
                    ...answers.body?.data?.attributes
                }
            });
        }
        const templateData = dataset.reduce((acc, questionnaireData) => {
            const resumeLink = questionnaireData.analyticsId
                ? `/apply/resume/${questionnaireData.questionnaireId}?a_id=${questionnaireData.analyticsId}`
                : `/apply/resume/${questionnaireData.questionnaireId}`;
            acc.push([
                {
                    text: `${questionnaireData.answers['q-applicant-first-name']} ${questionnaireData.answers['q-applicant-last-name']}`,
                    classes: 'govuk-table__cell__overflow'
                },
                {
                    text: new Date(questionnaireData.expires).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        timeZone: 'Europe/London'
                    }),
                    attributes: {
                        'data-sort-value': new Date(questionnaireData.expires).getTime()
                    }
                },
                {
                    html: `<a href="${resumeLink}" class="govuk-link">Continue<span class='govuk-visually-hidden'> Continue application for ${questionnaireData.answers['q-applicant-first-name']} ${questionnaireData.answers['q-applicant-last-name']}</span></a>`
                }
            ]);
            return acc;
        }, []);

        return templateData;
    }

    return Object.freeze({
        getTemplateData
    });
}

module.exports = createDashboardService;
