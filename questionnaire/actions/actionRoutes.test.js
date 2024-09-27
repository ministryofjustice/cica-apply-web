/* eslint-disable global-require */

'use strict';

const request = require('supertest');
const fixtureQuestionnaire = require('../fixtures/actions/questionnaire.json');
const fixtureProgressEntryOrdinal1 = require('../fixtures/actions/fixtureProgressEntryOrdinal1.json');
const fixtureProgressEntryOrdinal2 = require('../fixtures/actions/fixtureProgressEntryOrdinal2.json');
const fixtureProgressEntryUrlNotNull = require('../fixtures/actions/fixtureProgressEntryUrlNotNull.json');
const fixture404 = require('../fixtures/fixture404.json');
const getKeepAlive = require('../../test/test-fixtures/res/get_keep_alive');

let app;

function getCsrfTokenFromResponse(input) {
    return input.match(/<input(?:.*?)name="_csrf"(?:.*)value="([^"]+).*>/)[1];
}

const defaultMocks = {
    '../questionnaire-service': () => {
        return jest.fn(() => ({
            createQuestionnaire: () => fixtureQuestionnaire,
            keepAlive: () => getKeepAlive,
            getSection: (questionnaireId, sectionId) => {
                if (sectionId === 'p-request-review') {
                    return fixtureProgressEntryOrdinal1;
                }
                if (sectionId === 'p-decision-letter') {
                    return fixtureProgressEntryOrdinal2;
                }
                return fixture404;
            },
            getCurrentSection: () => fixtureProgressEntryOrdinal2,
            getPrevious: () => fixtureProgressEntryOrdinal1,
            postSection: () => {
                return {
                    statusCode: 201
                };
            },
            postSubmission: () => undefined,
            getSubmissionStatus: () => ({status: 'FAILED'})
        }));
    },
    '../utils/isQuestionnaireInstantiated': () => jest.fn(() => true),
    '../utils/getQuestionnaireIdInSession': () =>
        jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250'),
    '../../account/account-service': () => {
        return jest.fn(() => ({
            getOwnerId: () => '123ownerid',
            isAuthenticated: () => false
        }));
    },
    '../utils/getOwnerOrigin': () => jest.fn(() => 'web')
};
let currentMocks = {};

function setUpCommonMocks(additionalMocks = {}) {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    const combinedMocks = {...defaultMocks, ...additionalMocks};

    Object.keys(currentMocks).forEach(path => {
        jest.unmock(path);
    });

    Object.keys(combinedMocks).forEach(path => {
        jest.unmock(path);
        if (combinedMocks[path] !== '__UNMOCK__') {
            jest.doMock(path, combinedMocks[path]);
        }
    });
    currentMocks = {...combinedMocks};
    app = require('../../app');
}

describe('Hitting /actions', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should respond with page not found error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/actions');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should respond with page not found error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/actions');
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /actions/:action', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should respond with error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/actions/decisionletter');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('Instantiated questionnaire with valid session and a valid session expiry cookie', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should respond with page not found error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/actions/decisionletter');
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /actions/:action/this-page-does-not-exist', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should respond with error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/actions/decisionletter/this-page-does-not-exist'
            );
            expect(response.statusCode).toBe(404);
        });
    });
    describe('Instantiated questionnaire with valid session and a valid session expiry cookie', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should respond with page not found error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/actions/decisionletter/this-page-does-not-exist'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /actions/:action/resume/:questionnaireId', () => {
    describe('Uninstantiated questionnaire', () => {
        describe('No questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                    '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
                });
            });

            it('Should respond with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/actions/decisionletter/resume/');
                expect(response.statusCode).toBe(404);
            });
        });

        describe('Malformed questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                    '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
                });
            });

            it('Should redirect to 404 page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/thisisnotavalidquestionnaireid'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter'
                );
            });
        });

        describe('Invalid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                    '../utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
                });
            });

            it('Should redirect to 404 page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter'
                );
            });
        });
    });
    describe('Instantiated questionnaire', () => {
        describe('No questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should respond with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/actions/decisionletter/resume/');
                expect(response.statusCode).toBe(404);
            });
        });

        describe('Malformed questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to 404 page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/thisisnotavalidquestionnaireid'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter'
                );
            });
        });

        describe('Invalid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to 404 page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter'
                );
            });
        });
        describe('Valid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to `current` section', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter/decision-letter'
                );
            });
        });

        describe('Insufficient privileges', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire-service': () => {
                        return jest.fn(() => ({
                            keepAlive: () => getKeepAlive,
                            getCurrentSection: questionnaireId => ({
                                body: {
                                    errors: [
                                        {
                                            status: 404,
                                            title: '404 Not Found',
                                            detail: `Questionnaire "${questionnaireId}" not found`
                                        }
                                    ]
                                }
                            })
                        }));
                    }
                });
            });

            it('Should redirect to 404 page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/actions/decisionletter/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /actions/decisionletter'
                );
            });
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getCurrentSection: () => {
                            throw new Error('Something went wrong!');
                        }
                    }));
                }
            });
        });
        it('Should respond with error page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/actions/decisionletter/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /actions/:action/:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it('Should render a section', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/actions/decisionletter/request-review');
        expect(response.res.text).toContain('request a review');
    });

    describe('Post', () => {
        describe('Submission', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../form-helper.js': jest.fn(() => ({
                        getSectionContext: () => 'submission',
                        addPrefix: section => `p-${section}`,
                        processRequest: requestBody => requestBody
                    }))
                });
            });
            it('Should submit', async () => {
                const currentAgent = request.agent(app);
                const initialResponse = await currentAgent.get('/apply/start-or-resume');
                const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                const response = await currentAgent.post('/apply/applicant-fatal-claim').send({
                    _csrf: initialCsrfToken
                });
                expect(response.res.text).toContain('Application submitted');
            });
        });

        describe('Error', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../form-helper.js': jest.fn(() => ({
                        addPrefix: () => {
                            throw new Error('Something went wrong!');
                        }
                    }))
                });
            });
            it('Should 404', async () => {
                const currentAgent = request.agent(app);
                const initialResponse = await currentAgent.get('/apply/start-or-resume');
                const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                const response = await currentAgent.post('/apply/applicant-fatal-claim').send({
                    _csrf: initialCsrfToken
                });
                expect(response.statusCode).toBe(404);
            });
        });
    });
});

describe('Hitting /actions/:action/previous/:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it('Should render a section', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/actions/decisionletter/previous/request-review');
        expect(response.res.text).toContain(
            'Found. Redirecting to /actions/decisionletter/request-review'
        );
    });

    describe('Referrer', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getPrevious: () => fixtureProgressEntryUrlNotNull
                    }));
                }
            });
        });

        it('Should redirect to the defined `url`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/actions/decisionletter/previous/request-review'
            );
            expect(response.res.text).toContain('Found. Redirecting to http://www.google.com');
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getPrevious: () => {
                            throw new Error('Something went wrong!');
                        }
                    }));
                }
            });
        });
        it('Should respond with error page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/actions/decisionletter/previous/request-review'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /actions/:action/:section?next=:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it.skip('Should redirect to a section', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.post(
            '/actions/decisionletter/decision-letter?next=request-review'
        );
        expect(response.res.text).toContain(
            'Found. Redirecting to /actions/decisionletter/request-review'
        );
    });

    describe('Section unavailable', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire-service': '__UNMOCK__',
                '../request-service': () => {
                    const apiV1 = `${process.env.CW_DCS_URL}/api/v1/questionnaires/c992d660-d1a8-4928-89a0-87d4f9640250`;
                    const api = `${process.env.CW_DCS_URL}/api/questionnaires/c992d660-d1a8-4928-89a0-87d4f9640250`;
                    return () => ({
                        post: options => {
                            const responses = {
                                [`${api}/sections/p-applicant-fatal-claim/answers`]: {
                                    statusCode: 201
                                }
                            };

                            return responses[options.url];
                        },
                        get: options => {
                            const responses = {
                                [`${api}/progress-entries?filter[sectionId]=p--check-your-answers`]: {
                                    statusCode: 404
                                },
                                [`${api}/progress-entries?filter[position]=current`]: {
                                    statusCode: 200,
                                    body: {
                                        data: [
                                            {
                                                attributes: {
                                                    sectionId: 'p--was-the-crime-reported-to-police'
                                                }
                                            }
                                        ]
                                    }
                                },
                                [`${apiV1}/sections/p-applicant-fatal-claim/answers`]: {
                                    statusCode: 201
                                },
                                [`${api}/session/keep-alive`]: {
                                    statusCode: 200,
                                    ...getKeepAlive
                                }
                            };

                            return responses[options.url];
                        }
                    });
                }
            });
        });

        it.skip('Should redirect to the current section if the `next` section id is not available', async () => {
            const currentAgent = request.agent(app);
            const initialResponse = await currentAgent.get('/apply/start-or-resume');
            const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
            const response = await currentAgent
                .post('/apply/applicant-fatal-claim?next=info-check-your-answers')
                .send({
                    _csrf: initialCsrfToken
                });
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/info-was-the-crime-reported-to-police'
            );
        });
    });
});
