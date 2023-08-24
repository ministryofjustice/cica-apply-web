/* eslint-disable global-require */

'use strict';

const request = require('supertest');
const fixtureQuestionnaire = require('./fixtures/questionnaire.json');
const fixtureProgressEntryOrdinal1 = require('./fixtures/fixtureProgressEntryOrdinal1.json');
const fixtureProgressEntryOrdinal2 = require('./fixtures/fixtureProgressEntryOrdinal2.json');
const fixtureProgressEntryUrlNotNull = require('./fixtures/fixtureProgressEntryUrlNotNull.json');
const fixture404 = require('./fixtures/fixture404.json');
const getKeepAlive = require('../test/test-fixtures/res/get_keep_alive');

let app;

function getCsrfTokenFromResponse(input) {
    return input.match(/<input(?:.*?)name="_csrf"(?:.*)value="([^"]+).*>/)[1];
}

const defaultMocks = {
    '../questionnaire/questionnaire-service': () => {
        return jest.fn(() => ({
            createQuestionnaire: () => fixtureQuestionnaire,
            keepAlive: () => getKeepAlive,
            getSection: (questionnaireId, sectionId) => {
                if (sectionId === 'p-applicant-fatal-claim') {
                    return fixtureProgressEntryOrdinal1;
                }
                if (sectionId === 'p--was-the-crime-reported-to-police') {
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
    '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => true),
    '../questionnaire/utils/getQuestionnaireIdInSession': () =>
        jest.fn(() => 'c992d660-d1a8-4928-89a0-87d4f9640250'),
    '../account/account-service': () => {
        return jest.fn(() => ({
            getOwnerId: () => '123ownerid',
            isAuthenticated: () => false
        }));
    }
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
    app = require('../app');
}

describe('Hitting /apply/this-page-does-not-exist', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../questionnaire/utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should respond with error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/this-page-does-not-exist');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should respond with error', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/this-page-does-not-exist');
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /apply', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../questionnaire/utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should redirect to `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe('Found. Redirecting to /apply/start-or-resume');
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should redirect to `/apply/resume/:questionnaireId`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
            );
        });
    });
});

describe('Hitting /apply/start-or-resume', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../questionnaire/utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should render the `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start-or-resume');
            expect(response.res.text).toContain('What would you like to do?');
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should render the `/apply/start-or-resume` page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start-or-resume');
            expect(response.res.text).toContain('What would you like to do?');
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../templateEngine/index.js': () => {
                    return jest.fn(() => ({
                        init: () => jest.fn(() => undefined),
                        render: () => {
                            throw new Error('Something went wrong!');
                        }
                    }));
                }
            });
        });
        it('Should respond with error page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start-or-resume');
            expect(response.statusCode).toBe(404);
        });
    });
    describe('Postback', () => {
        describe('Uninstantiated questionnaire', () => {
            describe('start new questionnaire', () => {
                beforeEach(() => {
                    setUpCommonMocks({
                        '../questionnaire/utils/isQuestionnaireInstantiated': () =>
                            jest.fn(() => false),
                        '../questionnaire/utils/getQuestionnaireIdInSession': () =>
                            jest.fn(() => undefined)
                    });
                });

                it('Should redirect to `/apply/start`', async () => {
                    const currentAgent = request.agent(app);
                    const initialResponse = await currentAgent.get('/apply/start-or-resume');
                    const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                    const response = await currentAgent.post('/apply/start-or-resume').send({
                        'start-or-resume': 'start',
                        _csrf: initialCsrfToken
                    });
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe('Found. Redirecting to /apply/start');
                });
            });
            describe('continue existing application', () => {
                beforeEach(() => {
                    setUpCommonMocks({
                        '../questionnaire/utils/isQuestionnaireInstantiated': () =>
                            jest.fn(() => false),
                        '../questionnaire/utils/getQuestionnaireIdInSession': () =>
                            jest.fn(() => undefined)
                    });
                });

                it('Should redirect to `/account/dashboard`', async () => {
                    const currentAgent = request.agent(app);
                    const initialResponse = await currentAgent.get('/apply/start-or-resume');
                    const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                    const response = await currentAgent.post('/apply/start-or-resume').send({
                        'start-or-resume': 'resume',
                        _csrf: initialCsrfToken
                    });
                    expect(response.res.text).toContain('Found. Redirecting to /account/dashboard');
                });
            });
        });
        describe('Instantiated questionnaire', () => {
            describe('start new questionnaire', () => {
                beforeEach(() => {
                    setUpCommonMocks();
                });

                it('Should redirect to `/apply/start`', async () => {
                    const currentAgent = request.agent(app);
                    const initialResponse = await currentAgent.get('/apply/start-or-resume');
                    const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                    const response = await currentAgent.post('/apply/start-or-resume').send({
                        'start-or-resume': 'start',
                        _csrf: initialCsrfToken
                    });
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe('Found. Redirecting to /apply/start');
                });
            });
            describe('continue existing application', () => {
                beforeEach(() => {
                    setUpCommonMocks();
                });

                it('Should redirect to `/apply/resume/:questionnaireId`', async () => {
                    const currentAgent = request.agent(app);
                    const initialResponse = await currentAgent.get('/apply/start-or-resume');
                    const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                    const response = await currentAgent.post('/apply/start-or-resume').send({
                        'start-or-resume': 'resume',
                        _csrf: initialCsrfToken
                    });
                    expect(response.res.text).toContain(
                        'Found. Redirecting to /apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                    );
                });
            });
        });
        describe('Invalid request body', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should render the page with error', async () => {
                const currentAgent = request.agent(app);
                const initialResponse = await currentAgent.get('/apply/start-or-resume');
                const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
                const response = await currentAgent.post('/apply/start-or-resume').send({
                    'start-or-resume': 'notavalidvalue',
                    _csrf: initialCsrfToken
                });
                expect(response.res.text).toContain('Select what you would like to do');
            });
        });
    });
});

describe('Hitting /apply/start', () => {
    describe('Uninstantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/utils/isQuestionnaireInstantiated': () => jest.fn(() => false),
                '../questionnaire/utils/getQuestionnaireIdInSession': () => jest.fn(() => undefined)
            });
        });

        it('Should redirect to `/apply/<initialSection>`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start');
            expect(response.res.text).toContain(
                'Found. Redirecting to /apply/applicant-fatal-claim'
            );
        });
    });
    describe('Instantiated questionnaire', () => {
        beforeEach(() => {
            setUpCommonMocks();
        });

        it('Should redirect to `/apply/<initialSection>`', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start');
            expect(response.res.text).toContain(
                'Found. Redirecting to /apply/applicant-fatal-claim'
            );
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        createQuestionnaire: () => {
                            throw new Error('Something went wrong!');
                        }
                    }));
                }
            });
        });
        it('Should respond with error page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/start');
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /apply/resume/:questionnaireId', () => {
    describe('Uninstantiated questionnaire', () => {
        describe('No questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/utils/isQuestionnaireInstantiated': () =>
                        jest.fn(() => false),
                    '../questionnaire/utils/getQuestionnaireIdInSession': () =>
                        jest.fn(() => undefined)
                });
            });

            it('Should response with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply/resume/');
                expect(response.statusCode).toBe(404);
            });
        });

        describe('Malformed questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/utils/isQuestionnaireInstantiated': () =>
                        jest.fn(() => false),
                    '../questionnaire/utils/getQuestionnaireIdInSession': () =>
                        jest.fn(() => undefined)
                });
            });

            it('Should redirect to `/apply`', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/thisisnotavalidquestionnaireid'
                );
                expect(response.res.text).toContain('Found. Redirecting to /apply');
            });
        });

        describe('Invalid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/utils/isQuestionnaireInstantiated': () =>
                        jest.fn(() => false),
                    '../questionnaire/utils/getQuestionnaireIdInSession': () =>
                        jest.fn(() => undefined)
                });
            });

            it('Should redirect to `/apply`', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                );
                expect(response.res.text).toContain('Found. Redirecting to /apply');
            });
        });

        describe('Incompatible template', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/questionnaire-service': () => {
                        return jest.fn(() => ({
                            keepAlive: () => getKeepAlive,
                            getCurrentSection: () => ({
                                body: {
                                    data: [
                                        {
                                            attributes: {
                                                url: null,
                                                sectionId: null
                                            }
                                        }
                                    ]
                                }
                            })
                        }));
                    }
                });
            });

            it('Should render the "Application expired" page', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                );
                expect(response.res.text).toContain(
                    '<title>Application expired - Claim criminal injuries compensation - GOV.UK</title>'
                );
            });
        });
    });
    describe('Instantiated questionnaire', () => {
        describe('No questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should response with error', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply/resume/');
                expect(response.statusCode).toBe(404);
            });
        });

        describe('Malformed questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to `/apply`', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/thisisnotavalidquestionnaireid'
                );
                expect(response.res.text).toContain('Found. Redirecting to /apply');
            });
        });

        describe('Invalid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to `/apply`', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
                );
                expect(response.res.text).toContain('Found. Redirecting to /apply');
            });
        });
        describe('Valid questionnaire id', () => {
            beforeEach(() => {
                setUpCommonMocks();
            });

            it('Should redirect to `current` section', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/c992d660-d1a8-4928-89a0-87d4f9640250'
                );
                expect(response.res.text).toContain(
                    'Found. Redirecting to /apply/was-the-crime-reported-to-police'
                );
            });
        });

        describe('Insufficient privileges', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../questionnaire/questionnaire-service': () => {
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

            it('Should redirect to `/apply`', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get(
                    '/apply/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
                );
                expect(response.res.text).toContain('Found. Redirecting to /apply');
            });
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
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
                '/apply/resume/8928deab-f2aa-4b62-a1ec-a5876f31257b'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('Hitting /apply/:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it('Should render a section', async () => {
        const currentAgent = request.agent(app);
        await currentAgent.get('/apply');
        const response = await currentAgent.get('/apply/applicant-fatal-claim');
        expect(response.res.text).toContain(
            'Are you applying because someone died from their injuries?'
        );
    });

    describe('Incompatible template', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getSection: () => ({
                            body: {
                                data: [
                                    {
                                        attributes: {
                                            url: null,
                                            sectionId: null
                                        }
                                    }
                                ]
                            }
                        })
                    }));
                }
            });
        });

        it('Should render the "Application expired" page', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent.get('/apply/applicant-fatal-claim');
            expect(response.res.text).toContain(
                '<title>Application expired - Claim criminal injuries compensation - GOV.UK</title>'
            );
        });
    });

    describe('Post', () => {
        describe('Submission', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    './form-helper.js': jest.fn(() => ({
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
                    './form-helper.js': jest.fn(() => ({
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

describe('Hitting /apply/previous/:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it('Should render a section', async () => {
        const currentAgent = request.agent(app);
        await currentAgent.get('/apply');
        const response = await currentAgent.get('/apply/previous/applicant-fatal-claim');
        expect(response.res.text).toContain('Found. Redirecting to /apply/applicant-fatal-claim');
    });

    describe('Referrer', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getPrevious: () => fixtureProgressEntryUrlNotNull
                    }));
                }
            });
        });

        it('Should redirect to the defined `url`', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent.get('/apply/previous/applicant-fatal-claim');
            expect(response.res.text).toContain('Found. Redirecting to http://www.google.com');
        });
    });
    describe('Error', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
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
            const response = await currentAgent.get('/apply/previous/applicant-fatal-claim');
            expect(response.statusCode).toBe(404);
        });
    });

    describe('Incompatible template', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': () => {
                    return jest.fn(() => ({
                        keepAlive: () => getKeepAlive,
                        getPrevious: () => ({
                            body: {
                                data: [
                                    {
                                        attributes: {
                                            url: null,
                                            sectionId: null
                                        }
                                    }
                                ]
                            }
                        })
                    }));
                }
            });
        });

        it('Should render the "Application expired" page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/previous/applicant-fatal-claim');
            expect(response.res.text).toContain(
                '<title>Application expired - Claim criminal injuries compensation - GOV.UK</title>'
            );
        });
    });
});

describe('Hitting /apply/:section?next=:section', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    it('Should redirect to a section', async () => {
        const currentAgent = request.agent(app);
        const initialResponse = await currentAgent.get('/apply/start-or-resume');
        const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
        const response = await currentAgent
            .post('/apply/was-the-crime-reported-to-police?next=applicant-fatal-claim')
            .send({
                _csrf: initialCsrfToken
            });
        expect(response.res.text).toContain('Found. Redirecting to /apply/applicant-fatal-claim');
    });

    describe('Section unavailable', () => {
        beforeEach(() => {
            setUpCommonMocks({
                '../questionnaire/questionnaire-service': '__UNMOCK__',
                '../questionnaire/request-service': () => {
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

        it('Should redirect to the current section if the `next` section id is not available', async () => {
            const currentAgent = request.agent(app);
            const initialResponse = await currentAgent.get('/apply/start-or-resume');
            const initialCsrfToken = getCsrfTokenFromResponse(initialResponse.res.text);
            const response = await currentAgent
                .post('/apply/applicant-fatal-claim?next=check-your-answers')
                .send({
                    _csrf: initialCsrfToken
                });
            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/was-the-crime-reported-to-police'
            );
        });
    });
});
