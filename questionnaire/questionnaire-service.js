'use strict';

const service = require('./request-service')();

function questionnaireService() {
    function createQuestionnaire() {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            },
            body: {
                data: {
                    type: 'questionnaires',
                    attributes: {
                        templateName: 'sexual-assault'
                    }
                }
            }
        };
        return service.post(opts);
    }

    function getSection(questionnaireId, section) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/${questionnaireId}/sections/${section}`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function postSection(questionnaireId, section, body) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/${questionnaireId}/sections/${section}/answers`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            },
            body: {
                data: [
                    {
                        type: 'answers',
                        attributes: body
                    }
                ]
            }
        };
        return service.post(opts);
    }

    function getPrevious(questionnaireId, section) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/${questionnaireId}/sections/${section}/previous`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function getCurrentSection(currentQuestionnaireId) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/progress-entries`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            },
            query: {
                questionnaireId: currentQuestionnaireId
            }
        };
        return service.get(opts);
    }

    function getSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            }
        };
        return service.get(opts);
    }

    function postSubmission(questionnaireId) {
        const opts = {
            url: `${process.env.DATA_CAPTURE_SERVICE}/questionnaires/${questionnaireId}/submissions`,
            headers: {
                Authorization: `Bearer ${process.env.DCS_JWT}`
            },
            body: {
                data: [
                    {
                        type: 'submissions',
                        attributes: {
                            questionnaireId
                        }
                    }
                ]
            }
        };
        return service.post(opts);
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getSubmissionStatus(questionnaireId, startingDate) {
        if (Date.now() - startingDate >= 15000) {
            const err = Error(`The upstream server took too long to respond`);
            err.name = 'HTTPError';
            err.statusCode = 504;
            err.error = '504 Gateway Timeout';
            throw err;
        }
        const result = await getSubmission(questionnaireId);
        const {submitted} = result.data.attributes;

        if (submitted) {
            return {submitted: true};
        }

        // check again.
        await timeout(1000);
        return getSubmissionStatus(questionnaireId, startingDate);
    }

    return Object.freeze({
        createQuestionnaire,
        getSection,
        postSection,
        getPrevious,
        getCurrentSection,
        getSubmissionStatus,
        postSubmission,
        getSubmission
    });
}

module.exports = questionnaireService;
