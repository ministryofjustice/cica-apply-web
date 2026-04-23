'use strict';

const createQuestionnaireService = require('../questionnaire/questionnaire-service');

function createDashboardService(ownerId) {
    const questionnaireService = createQuestionnaireService({ownerId});
    async function getFlatQuestionnaireMetadataByUserId() {
        const metadataCollection = await questionnaireService.getAllQuestionnairesMetadata();
        return (metadataCollection.body.data || []).map(metadatum => {
            return {
                questionnaireId: metadatum.attributes['questionnaire-id'],
                created: metadatum.attributes.created,
                modified: metadatum.attributes.modified,
                expires: metadatum.attributes.expires,
                externalId: metadatum.attributes?.['external-id'],
                type: metadatum.attributes['template-type']
            };
        });
    }

    async function getFlatTemplateMetadataByUserId() {
        const metadataCollection = await questionnaireService.getAllTemplatesMetadata();
        return (metadataCollection.body.data || []).map(metadatum => {
            return {
                questionnaireId: metadatum.id,
                personalisation: metadatum.attributes.personalisation,
                caseReferenceNumber: metadatum.attributes.caseReferenceNumber,
                read: metadatum.attributes.read
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
        const allTemplatesMetadata = await getFlatTemplateMetadataByUserId();
        const allQuestionnairesMetadata = await getFlatQuestionnaireMetadataByUserId();

        const dataSet = allQuestionnairesMetadata
            .filter(({type}) => type !== 'apply-for-compensation')
            .reduce((acc, currentQuestionnaire) => {
                const currentTemplateMetadata = allTemplatesMetadata.find(
                    metadatum => metadatum.questionnaireId === currentQuestionnaire.questionnaireId
                );
                const caseReferenceNumber = currentTemplateMetadata?.caseReferenceNumber;
                const actionToDo =
                    (currentTemplateMetadata.read !== true &&
                        currentQuestionnaire.type !== 'stub') ||
                    !!acc[caseReferenceNumber]?.actionToDo;

                const firstName = currentTemplateMetadata?.personalisation['first-name'];
                const lastName = currentTemplateMetadata?.personalisation['last-name'];
                if (caseReferenceNumber !== null) {
                    acc[caseReferenceNumber] = {
                        analyticsId: currentQuestionnaire.analyticsId,
                        actionToDo,
                        firstName,
                        lastName
                    };
                }
                return acc;
            }, {});
        const rows = [];
        Object.keys(dataSet).forEach(caseReferenceNumber => {
            const resumeLink = dataSet[caseReferenceNumber].analyticsId
                ? `/account/dashboard/manage/${caseReferenceNumber.replace('\\', '-')}?a_id=${
                      dataSet[caseReferenceNumber].analyticsId
                  }`
                : `/account/dashboard/manage/${caseReferenceNumber.replace('\\', '-')}`;
            const notificationBadge = dataSet[caseReferenceNumber].actionToDo
                ? ' <span class="moj-notification-badge"><span aria-hidden="true">1</span><span class="govuk-visually-hidden">(1)</span></span>'
                : '';
            rows.push([
                {
                    text: `${dataSet[caseReferenceNumber].firstName} ${dataSet[caseReferenceNumber].lastName}`,
                    classes: 'govuk-table__cell__overflow'
                },
                {
                    text: `${caseReferenceNumber}`
                },
                {
                    html: `<a href="${resumeLink}" class="govuk-link">View application<span class='govuk-visually-hidden'>View action for case ${caseReferenceNumber}</span></a>${notificationBadge}`
                }
            ]);
        });
        return rows;
    }
    return Object.freeze({
        getApplicationData,
        getActionData
    });
}

module.exports = createDashboardService;
