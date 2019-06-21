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

    return Object.freeze({
        createQuestionnaire,
        getSection,
        postSection,
        getPrevious,
        getCurrentSection
    });
}

module.exports = questionnaireService;
