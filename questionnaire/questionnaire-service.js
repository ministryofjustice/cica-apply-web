'use strict';

const createRequestService = require('./request-service');

const {get, post} = createRequestService();

function questionnaireService(options = {}) {
    function createQuestionnaire() {
        const defaultTemplateValues = {
            templateName: 'sexual-assault',
            templateVersion: undefined
        };
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            },
            json: {
                data: {
                    type: 'questionnaires',
                    attributes: {
                        templateName:
                            options.featureFlags?.templateName ||
                            defaultTemplateValues.templateName,
                        owner: {
                            id: options.ownerId,
                            isAuthenticated: options.isAuthenticated
                        },
                        origin: {
                            channel: options.origin
                        },
                        external: {
                            id: options.externalId
                        },
                        templateVersion:
                            options.featureFlags?.templateVersion ||
                            defaultTemplateValues.templateVersion
                    }
                }
            }
        };
        return post(opts);
    }

    function getSection(questionnaireId, section) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/progress-entries?filter[sectionId]=${section}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    function postSection(questionnaireId, section, body) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/sections/${section}/answers`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            },
            json: {
                data: {
                    type: 'answers',
                    attributes: body
                }
            }
        };
        return post(opts);
    }

    function getPrevious(questionnaireId, sectionId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/progress-entries?page[before]=${sectionId}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    function getCurrentSection(currentQuestionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${currentQuestionnaireId}/progress-entries?filter[position]=current`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    function getSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    function postSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            },
            json: {
                data: {
                    type: 'submissions',
                    attributes: {
                        questionnaireId
                    }
                }
            }
        };
        return post(opts);
    }

    function timeout(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    async function getSubmissionStatus(questionnaireId, startingDate) {
        const result = await getSubmission(questionnaireId);

        // dcs down...
        if (
            !result ||
            !result.body ||
            !result.body.data ||
            !result.body.data.attributes ||
            (result.body.errors && result.body.errors[0].status === 404)
        ) {
            const err = Error(`The service is currently unavailable`);
            err.name = 'DCSUnavailable';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }

        const {submitted} = result.body.data.attributes;
        if (submitted) {
            return result.body.data.attributes;
        }
        // return the resource regardless.
        // https://www.hobo-web.co.uk/your-website-design-should-load-in-4-seconds/
        if (Date.now() - startingDate >= 6000) {
            return result.body.data.attributes;
        }

        // check again.
        await timeout(1000);
        return getSubmissionStatus(questionnaireId, startingDate);
    }

    function getFirstSection(currentQuestionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${currentQuestionnaireId}/progress-entries?filter[position]=first`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    function keepAlive(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/session/keep-alive`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    async function getAllQuestionnairesMetadata() {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/metadata`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    async function getQuestionnaireMetadata(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/metadata`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }
    async function getSectionAnswers(questionnaireId, sectionId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/sections/${sectionId}/answers`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return get(opts);
    }

    return Object.freeze({
        createQuestionnaire,
        getSection,
        postSection,
        getPrevious,
        getCurrentSection,
        getSubmission,
        postSubmission,
        timeout,
        getSubmissionStatus,
        getFirstSection,
        keepAlive,
        getAllQuestionnairesMetadata,
        getQuestionnaireMetadata,
        getSectionAnswers
    });
}

module.exports = questionnaireService;
