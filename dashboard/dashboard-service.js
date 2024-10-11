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
                externalId: metadatum.attributes?.['external-id'],
                type: metadatum.attributes['template-type']
            };
        });
    }

    async function getApplicationData() {
        const dataset = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const flatMetadata of await getFlatQuestionnaireMetadataByUserId()) {
            if (flatMetadata.type === 'apply-for-compensation') {
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
        }
        const templateData = dataset.reduce((acc, questionnaireData) => {
            const resumeLink = questionnaireData.externalId
                ? `/apply/resume/${questionnaireData.questionnaireId}?external_id=${questionnaireData.externalId}`
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

    async function getActionData() {
        const dataset = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const flatMetadata of await getFlatQuestionnaireMetadataByUserId()) {
            if (flatMetadata.type !== 'apply-for-compensation') {
                const submissionData = await questionnaireService.getSubmission(
                    flatMetadata.questionnaireId
                );
                dataset.push({
                    ...flatMetadata,
                    data: {
                        caseReferenceNumber: '',
                        ...submissionData.body?.data?.attributes
                    }
                });
            }
        }
        const templateData = dataset.reduce((acc, questionnaireData) => {
            const resumeLink = questionnaireData.analyticsId
                ? `/apply/resume/${questionnaireData.questionnaireId}?a_id=${questionnaireData.analyticsId}`
                : `/apply/resume/${questionnaireData.questionnaireId}`;
            acc.push([
                {
                    text: `${questionnaireData.data.caseReferenceNumber}`,
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
                    html: `<a href="${resumeLink}" class="govuk-link">View decision<span class='govuk-visually-hidden'> View decision for case ${questionnaireData.data.caseReferenceNumber}</span></a>`
                }
            ]);
            return acc;
        }, []);

        return templateData;
    }
    return Object.freeze({
        getApplicationData,
        getActionData
    });
}

module.exports = createDashboardService;
