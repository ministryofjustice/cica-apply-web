'use strict';

const moment = require('moment-timezone');
const {get} = require('../questionnaire/request-service')(); // TODO Move this to its own dir!

function createDashboardService() {
    async function getQuestionnaireMetadataCollectionByUserId(userId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/metadata?filter[user-id]=${userId}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-behalf-of': userId
            }
        };
        return get(opts);
    }

    async function getSectionAnswersByQuestionnaireId({
        questionnaireId,
        sectionId = 'p-applicant-enter-your-name',
        userId
    }) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/sections/${sectionId}/answers`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-behalf-of': userId
            }
        };
        return get(opts);
    }

    async function getFlatQuestionnaireMetadataByUserId(userId) {
        const metadataCollection = await getQuestionnaireMetadataCollectionByUserId(userId);
        return metadataCollection.body.data.map(metadatum => {
            return {
                questionnaireId: metadatum.attributes['questionnaire-id'],
                expires: metadatum.attributes.expires
            };
        });
    }

    async function getTemplateData(userId) {
        const dataset = [];
        // eslint-disable-next-line no-restricted-syntax
        for await (const flatMetadata of await getFlatQuestionnaireMetadataByUserId(userId)) {
            const answers = await getSectionAnswersByQuestionnaireId({
                questionnaireId: flatMetadata.questionnaireId,
                userId
            });
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
            acc.push([
                {
                    text: `${questionnaireData.answers['q-applicant-first-name']} ${questionnaireData.answers['q-applicant-last-name']}`,
                    classes: 'govuk-table__cell__overflow'
                },
                {
                    text: moment(questionnaireData.expires)
                        .tz('Europe/London')
                        .format('DD/MM/YYYY'),
                    attributes: {
                        'data-sort-value': new Date(questionnaireData.expires).getTime()
                    }
                },
                {
                    html: `<a href="/apply/resume/${questionnaireData.questionnaireId}" class="govuk-link">Continue<span class='govuk-visually-hidden'> Continue application for ${questionnaireData.answers['q-applicant-first-name']} ${questionnaireData.answers['q-applicant-last-name']}</span></a>`
                }
            ]);
            return acc;
        }, []);

        return templateData;
    }

    return Object.freeze({
        getTemplateData,
        getQuestionnaireMetadataCollectionByUserId
    });
}

module.exports = createDashboardService;
