'use strict';

const request = require('supertest');
const csrf = require('csurf');

const fixtureTemplate = require('./test-fixtures/aar/template.json');
const fixtureProgressEntryTemplateSectionInitial = require('./test-fixtures/aar/progress-entry-template-section-initial.json');
const fixtureProgressEntryTemplateSectionCurrent = require('./test-fixtures/aar/progress-entry-template-section-current.json');
const fixtureProgressEntryTemplateSectionSecondary = require('./test-fixtures/aar/progress-entry-template-section-secondary.json');
const fixtureSessionKeepAlive = require('./test-fixtures/aar/session-keepalive.json');

let app;

function replaceCsrfMiddlwareForTest(expressApp) {
    // TODO: find a better way to do this
    // because I cannot alter the contents of the variable that
    // is passed in to the `app.use()` method within the app.js,
    // I need to butcher the stack from the outside so that the
    // csrf stuff is altered after initialisation. If the csrf
    // stuff was extracted out its own middleware then we could
    // just that js file instead.
    // eslint-disable-next-line no-underscore-dangle
    const middlewareStack = expressApp._router.stack;
    let csrfMiddlewareStackIndex = -1;
    let newCsrfMiddlewareStackItem = [];
    let newCsrfMiddlewareStackIndex = -1;
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            csrfMiddlewareStackIndex = index;
        }
    });
    if (csrfMiddlewareStackIndex > -1) {
        // eslint-disable-next-line no-underscore-dangle
        expressApp._router.stack.splice(csrfMiddlewareStackIndex, 1);
    }

    const csrfProtection = csrf({
        cookie: false,
        sessionKey: 'session',
        ignoreMethods: ['GET', 'POST']
    });
    expressApp.use(csrfProtection);

    // look for the new csrf middleware. it should be the last item.
    middlewareStack.forEach((layer, index) => {
        if (layer.name === 'csrf') {
            // get a copy of the new middleware.
            newCsrfMiddlewareStackItem = layer;
            newCsrfMiddlewareStackIndex = index;
            // remove it from the stack.
            // eslint-disable-next-line no-underscore-dangle
            expressApp._router.stack.splice(newCsrfMiddlewareStackIndex, 1);
        }
    });
    // eslint-disable-next-line no-underscore-dangle
    expressApp._router.stack.splice(csrfMiddlewareStackIndex, 0, newCsrfMiddlewareStackItem);
}

function setUpCommonMocks(additionalMocks) {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.unmock('../questionnaire/questionnaire-service');
    jest.unmock('../questionnaire/utils/isQuestionnaireInstantiated');
    jest.unmock('../questionnaire/form-helper');
    jest.unmock('../index/liveChatHelper');

    // jest.unmock('../questionnaire/request-service');
    // jest.unmock('client-sessions');
    if (additionalMocks) {
        additionalMocks();
    } else {
        jest.doMock('../questionnaire/questionnaire-service', () =>
            jest.fn(() => ({
                createQuestionnaire: () => fixtureTemplate,
                getCurrentSection: () => fixtureProgressEntryTemplateSectionCurrent
            }))
        );
    }
    // eslint-disable-next-line global-require
    app = require('../app');
    replaceCsrfMiddlwareForTest(app);
}

describe('Static routes', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.restoreAllMocks();
        // eslint-disable-next-line global-require
        app = require('../app');
    });

    describe('/', () => {
        it('should redirect to GOV UK landing page', async () => {
            const response = await request(app).get('/');
            expect(response.statusCode).toBe(301);
            expect(response.get('location')).toEqual(
                'https://www.gov.uk/claim-compensation-criminal-injury/make-claim'
            );
        });
    });

    describe('/cookies', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/cookies');
            expect(response.statusCode).toBe(200);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/cookies');
            const actual = response.res.text.replace(/\s+/g, '');
            const pageHeading = `<h1 class="govuk-heading-xl">Cookies</h1>`.replace(/\s+/g, '');
            expect(actual).toContain(pageHeading);
        });
    });

    describe('/contact-us', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/contact-us');
            expect(response.statusCode).toBe(200);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/contact-us');
            const actual = response.res.text.replace(/\s+/g, '');
            const pageHeading = `<h1 class="govuk-heading-xl">Contact us</h1>`.replace(/\s+/g, '');
            expect(actual).toContain(pageHeading);
        });
    });

    describe('/accessibility-statement', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/accessibility-statement');
            expect(response.statusCode).toBe(200);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/accessibility-statement');
            const actual = response.res.text.replace(/\s+/g, '');
            const pageHeading = `<h1 class="govuk-heading-xl">Accessibility for Claim criminal injuries compensation</h1>`.replace(
                /\s+/g,
                ''
            );
            expect(actual).toContain(pageHeading);
        });
    });

    describe('/police-forces', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/police-forces');
            expect(response.statusCode).toBe(200);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/police-forces');
            const actual = response.res.text.replace(/\s+/g, '');
            const pageHeading = `<h1 class="govuk-heading-xl">Police forces</h1>`.replace(
                /\s+/g,
                ''
            );
            expect(actual).toContain(pageHeading);
        });
    });

    describe('/thisdoesntexist', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/thisdoesntexist');
            expect(response.statusCode).toBe(404);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/thisdoesntexist');
            const actual = response.res.text.replace(/\s+/g, '');
            const pageHeading = `<h1 class="govuk-heading-xl">Page not found</h1>`.replace(
                /\s+/g,
                ''
            );
            expect(actual).toContain(pageHeading);
        });
    });

    describe('/start-chat', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/start-chat');
            expect(response.statusCode).toBe(200);
        });
        describe('When Live Chat is active', () => {
            it('Should render specific content on the page', async () => {
                jest.resetModules();
                jest.doMock('../index/liveChatHelper', () =>
                    jest.fn(() => ({
                        isLiveChatActive: () => {
                            return true;
                        }
                    }))
                );

                // eslint-disable-next-line global-require
                app = require('../app');
                const response = await request(app).get('/start-chat');
                const actual = response.res.text.replace(/\s+/g, '');
                const pageHeading = `<h1 class="govuk-heading-xl">Chat to us online</h1>`.replace(
                    /\s+/g,
                    ''
                );
                expect(actual).toContain(pageHeading);
            });
        });
        describe('When Live Chat is not active', () => {
            it('Should render specific content on the page', async () => {
                jest.resetModules();
                jest.doMock('../index/liveChatHelper', () =>
                    jest.fn(() => ({
                        isLiveChatActive: () => {
                            return false;
                        }
                    }))
                );

                // eslint-disable-next-line global-require
                app = require('../app');
                const response = await request(app).get('/start-chat');
                const actual = response.res.text.replace(/\s+/g, '');
                const pageHeading = `<h1 class="govuk-heading-xl">Sorry, the service is unavailable</h1>`.replace(
                    /\s+/g,
                    ''
                );
                expect(actual).toContain(pageHeading);
            });
        });
    });

    describe('/chat', () => {
        it('Should respond with a 200 status code', async () => {
            const response = await request(app).get('/chat');
            expect(response.statusCode).toBe(200);
        });
        describe('When Live Chat is active', () => {
            it('Should render specific content on the page', async () => {
                jest.resetModules();
                jest.doMock('../index/liveChatHelper', () =>
                    jest.fn(() => ({
                        isLiveChatActive: () => {
                            return true;
                        }
                    }))
                );

                // eslint-disable-next-line global-require
                app = require('../app');
                const response = await request(app).get('/chat');
                const actual = response.res.text.replace(/\s+/g, '');
                const pageContent = `<iframe id="chat-iframe"`.replace(/\s+/g, '');
                expect(actual).toContain(pageContent);
            });
        });
        describe('When Live Chat is not active', () => {
            it('Should render specific content on the page', async () => {
                jest.resetModules();
                jest.doMock('../index/liveChatHelper', () =>
                    jest.fn(() => ({
                        isLiveChatActive: () => {
                            return false;
                        }
                    }))
                );

                // eslint-disable-next-line global-require
                app = require('../app');
                const response = await request(app).get('/start-chat');
                const actual = response.res.text.replace(/\s+/g, '');
                const pageHeading = `<h1 class="govuk-heading-xl">Sorry, the service is unavailable</h1>`.replace(
                    /\s+/g,
                    ''
                );
                expect(actual).toContain(pageHeading);
            });
        });
    });
});

describe('/apply', () => {
    describe('Template instantiated', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureTemplate,
                        getFirstSection: () => fixtureProgressEntryTemplateSectionInitial,
                        keepAlive: () => fixtureSessionKeepAlive
                    }))
                );
                jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                    jest.fn(() => true)
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });

        it('Should redirect', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(302);
        });

        it('Should redirect to initial section', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-fatal-claim');
        });

        describe('Error', () => {
            beforeEach(() => {
                function blockSpecificMocks() {
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            getFirstSection: () => {
                                throw new Error();
                            },
                            keepAlive: () => fixtureSessionKeepAlive
                        }))
                    );
                    jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                        jest.fn(() => true)
                    );
                }
                setUpCommonMocks(blockSpecificMocks);
            });
            it('Should fail gracefully', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.get('/apply');
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe('Template uninstantiated', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureTemplate,
                        getFirstSection: () => fixtureProgressEntryTemplateSectionInitial
                    }))
                );
                jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                    jest.fn(() => false)
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });
        it('Should redirect to initial section when no cookie is set', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/apply/applicant-british-citizen-or-eu-national'
            );
            expect(response.res.text).toBe('Found. Redirecting to /apply/');
        });
    });
});

describe('/apply/new', () => {
    it('Should redict to /apply', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply/new');
        expect(response.res.text).toBe('Found. Redirecting to /apply');
    });
});

describe('/apply/resume/:questionnaireId', () => {
    beforeEach(() => {
        function blockSpecificMocks() {
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureTemplate,
                    getCurrentSection: questionnaireId => {
                        if (questionnaireId === 'c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd') {
                            return fixtureProgressEntryTemplateSectionCurrent;
                        }
                        return {};
                    }
                }))
            );
        }
        setUpCommonMocks(blockSpecificMocks);
    });
    it('Should redirect to a questionnaires `current` section', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get(
            '/apply/resume/c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd'
        );
        expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-fatal-claim');
    });

    it('Should redirect by default to /apply', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get(
            '/apply/resume/85ef497c-35ec-4a30-8b2c-e1cf8ab3a93c'
        );
        expect(response.res.text).toBe('Found. Redirecting to /apply');
    });

    describe('Error', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        getCurrentSection: () => {
                            throw new Error();
                        }
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });
        it('Should fail gracefully', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/apply/resume/c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('/apply/previous/:sectionId', () => {
    beforeEach(() => {
        function blockSpecificMocks() {
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => fixtureTemplate,
                    getPrevious: (questionnaireId, sectionId) => {
                        if (sectionId === 'p--was-the-crime-reported-to-police') {
                            return fixtureProgressEntryTemplateSectionInitial;
                        }
                        return {};
                    }
                }))
            );
        }
        setUpCommonMocks(blockSpecificMocks);
    });
    it('Should redirect to a previous section', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply/previous/was-the-crime-reported-to-police');
        expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-fatal-claim');
    });

    describe('Error', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        getPrevious: () => {
                            throw new Error();
                        }
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });
        it('Should fail gracefully', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get(
                '/apply/previous/was-the-crime-reported-to-police'
            );
            expect(response.statusCode).toBe(404);
        });
    });
});

describe('/apply/:sectionId', () => {
    describe('GET', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureTemplate,
                        getSection: (questionnaireId, sectionId) => {
                            if (sectionId === 'p--was-the-crime-reported-to-police') {
                                return fixtureProgressEntryTemplateSectionSecondary;
                            }
                            return {};
                        },
                        keepAlive: () => fixtureSessionKeepAlive
                    }))
                );
                jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                    jest.fn(() => true)
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });
        it('Should render a section', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply/was-the-crime-reported-to-police');
            expect(response.res.text).toContain('id="q--was-the-crime-reported-to-police"');
        });
    });
    describe('POST', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        postSection: () => {
                            return {
                                statusCode: 201
                            };
                        },
                        getCurrentSection: () => fixtureProgressEntryTemplateSectionCurrent,
                        keepAlive: () => fixtureSessionKeepAlive
                    }))
                );
                jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                    jest.fn(() => true)
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });
        it('Should redirect to a section', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.post('/apply/was-the-crime-reported-to-police');
            expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-fatal-claim');
        });

        describe('Create', () => {
            beforeEach(() => {
                function blockSpecificMocks() {
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            postSection: () => {
                                return {
                                    statusCode: 201
                                };
                            },
                            getSubmissionStatus: () => {
                                return {status: 'FAILED'};
                            },
                            getCurrentSection: () => fixtureProgressEntryTemplateSectionCurrent,
                            postSubmission: () => undefined,
                            keepAlive: () => fixtureSessionKeepAlive
                        }))
                    );
                    jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                        jest.fn(() => true)
                    );
                    jest.doMock('../questionnaire/form-helper', () => ({
                        getSectionContext: () => 'submission',
                        addPrefix: () => 'p-was-the-crime-reported-to-police',
                        processRequest: () => ({'q-applicant-fatal-claim': true})
                    }));
                }
                setUpCommonMocks(blockSpecificMocks);
            });
            it('Should error upon submission', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.post('/apply/was-the-crime-reported-to-police');
                // rendered 500.MBDown.njk.
                expect(response.res.text).toContain(
                    'However, there is a delay with us sending your reference number to you.'
                );
            });

            describe('`next` in query', () => {
                beforeEach(() => {
                    function blockSpecificMocks() {
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                postSection: () => {
                                    return {
                                        statusCode: 201
                                    };
                                },
                                getSubmissionStatus: () => {
                                    return {status: 'COMPLETED'};
                                },
                                getSection: (questionnaireId, sectionId) => {
                                    if (sectionId === 'p-applicant-fatal-claim') {
                                        return {
                                            statusCode: 200,
                                            ...fixtureProgressEntryTemplateSectionCurrent
                                        };
                                    }
                                    return {};
                                },
                                keepAlive: () => fixtureSessionKeepAlive
                            }))
                        );
                        jest.doMock('../questionnaire/utils/isQuestionnaireInstantiated', () =>
                            jest.fn(() => true)
                        );
                    }
                    setUpCommonMocks(blockSpecificMocks);
                });
                it('Should redirect to `next`', async () => {
                    const currentAgent = request.agent(app);
                    const response = await currentAgent.post(
                        '/apply/was-the-crime-reported-to-police?next=applicant-fatal-claim'
                    );
                    expect(response.res.text).toBe(
                        'Found. Redirecting to /apply/applicant-fatal-claim'
                    );
                });
            });
        });

        describe('Error', () => {
            beforeEach(() => {
                function blockSpecificMocks() {
                    jest.doMock('../questionnaire/form-helper', () => ({
                        addPrefix: () => {
                            throw new Error();
                        }
                    }));
                }
                setUpCommonMocks(blockSpecificMocks);
            });
            it('Should fail gracefully', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent.post('/apply/was-the-crime-reported-to-police');
                expect(response.statusCode).toBe(404);
            });
        });
    });
});

describe('/session', () => {
    describe('Success', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureTemplate,
                        getCurrentSection: () => fixtureProgressEntryTemplateSectionCurrent,
                        keepAlive: () => fixtureSessionKeepAlive
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });

        it('should return a session keep alive resource', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent.get('/session/keep-alive');
            expect(response.text).toEqual(
                JSON.stringify({
                    data: [
                        {
                            id: '285cb104-0c15-4a9c-9840-cb1007f098fb',
                            type: 'sessions',
                            attributes: {
                                alive: true,
                                created: 1662544121060,
                                duration: 900000,
                                expires: 1662545021060
                            }
                        }
                    ]
                })
            );
        });
    });
    describe('Failure', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => fixtureTemplate,
                        getCurrentSection: () => fixtureProgressEntryTemplateSectionCurrent,
                        keepAlive: () => {
                            return Promise.reject(new Error('Something went wrong'));
                        }
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);
        });

        it('should error when retreiving a session keep alive resource', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent.get('/session/keep-alive');
            expect(response.statusCode).toBe(404);
        });
    });
});
