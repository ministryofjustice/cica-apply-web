'use strict';

const service = require('./request-service')();

function questionnaireService(options = {}) {
    function createQuestionnaire() {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/questionnaires`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'Dcs-Api-Version': '2023-05-17'
            },
            json: {
                data: {
                    type: 'questionnaires',
                    attributes: {
                        templateName: 'sexual-assault',
                        owner: {
                            id: options.ownerId,
                            isAuthenticated: options.isAuthenticated
                        }
                    }
                }
            }
        };
        return service.post(opts);
    }

    function getSection(questionnaireId, section) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/progress-entries?filter[sectionId]=${section}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return service.get(opts);
    }

    function postSection(questionnaireId, section, body) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/sections/${section}/answers`,
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
        return service.post(opts);
    }

    function getPrevious(questionnaireId, sectionId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/progress-entries?page[before]=${sectionId}`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return service.get(opts);
    }

    function getCurrentSection(currentQuestionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${currentQuestionnaireId}/progress-entries?filter[position]=current`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
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
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId,
                'Dcs-Api-Version': '2023-05-17'
            }
        };
        return service.get(opts);
    }

    function keepAlive(questionnaireId) {
        const opts = {
            url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/session/keep-alive`,
            headers: {
                Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
                'On-Behalf-Of': options.ownerId
            }
        };
        return service.get(opts);
    }

    async function getAllQuestionnairesMetadata() {
        // const opts = {
        //     url: `${process.env.CW_DCS_URL}/api/questionnaires/metadata`,
        //     headers: {
        //         Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
        //         'On-Behalf-Of': options.ownerId,
        //         'Dcs-Api-Version': '2023-05-17'
        //     }
        // };
        // return service.get(opts);

        return {
            body: {
                data: [
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': 'some-questionnaire-id',
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    },
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': 'some-questionnaire-id',
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    },
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': 'some-questionnaire-id',
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    },
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': 'some-questionnaire-id',
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    },
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': 'some-questionnaire-id',
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    }
                ]
            }
        };
    }

    async function getQuestionnaireMetadata(questionnaireId) {
        // const opts = {
        //     url: `${process.env.CW_DCS_URL}/api/questionnaires/${questionnaireId}/metadata`,
        //     headers: {
        //         Authorization: `Bearer ${process.env.CW_DCS_JWT}`,
        //         'On-Behalf-Of': options.ownerId,
        //         'Dcs-Api-Version': '2023-05-17'
        //     }
        // };
        // return service.get(opts);
        return {
            body: {
                data: [
                    {
                        type: 'metadata',
                        id: 'some-id',
                        attributes: {
                            'questionnaire-id': questionnaireId,
                            'questionnaire-document-version': '1.2.3',
                            created: Date.now() * 1,
                            modified: Date.now() * 1,
                            'submission-status': 'NOT_STARTED',
                            'owner-id': options.ownerId,
                            expires: new Date(
                                new Date(
                                    new Date(Date.now() * 1).setUTCDate(
                                        new Date(Date.now() * 1).getUTCDate() + 31
                                    )
                                ).setUTCHours(0, 0, 0, 0)
                            ).toISOString()
                        }
                    }
                ]
            }
        };
    }
    async function getSectionAnswers(questionnaireId, sectionId) {
        // const opts = {
        //     url: `${process.env.CW_DCS_URL}/api/v1/questionnaires/${questionnaireId}/sections/${sectionId}/answers`,
        //     headers: {
        //         Authorization: `Bearer ${process.env.CW_DCS_JWT}`
        //     }
        // };
        // return service.get(opts);
        return {
            data: {
                type: 'answers',
                id: 'p-applicant-enter-your-name',
                attributes: {
                    'q-applicant-title': 'Mr',
                    'q-applicant-first-name': 'Adrian',
                    'q-applicant-last-name': 'Roworth'
                }
            }
        };
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
