'use strict';

const service = require('./request-service')();

function questionnaireService() {
    function getSection(questionnaireId, section) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/progress-entries?filter[sectionId]=${section}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function postSection(questionnaireId, section, body) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/sections/${section}/answers`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            },
            json: {
                data: {
                    type: 'answers',
                    attributes: body
                }
            }
        };
        return service.post(opts);
    }

    async function createQuestionnaire(options) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            },
            json: {
                data: {
                    type: 'questionnaires',
                    attributes: {
                        templateName: 'sexual-assault'
                    }
                }
            }
        };
        const response = await service.post(opts);

        if (options?.userId) {
            const data = {'user-id': options.userId};
            await postSection(response.body.data.attributes.id, 'user', data);
        }

        return response;
    }

    function getPrevious(questionnaireId, sectionId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/progress-entries?page[before]=${sectionId}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function getCurrentSection(currentQuestionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${currentQuestionnaireId}/progress-entries?filter[position]=current`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function getSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function postSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
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
        return service.post(opts);
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
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${currentQuestionnaireId}/progress-entries?filter[position]=first`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function keepAlive(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/session/keep-alive`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`
            }
        };
        return service.get(opts);
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
        keepAlive
    });
}

module.exports = questionnaireService;
