'use strict';

const request = require('supertest');
const csrf = require('csurf');

const formHelper = require('../questionnaire/form-helper');

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');
const getCurrentSection = require('./test-fixtures/res/get_current_section_valid');
const getSectionValid = require('./test-fixtures/res/get_schema_valid');
const getSectionHtmlValid = require('./test-fixtures/transformations/resolved html/p-some-section');
const getProgressEntries = require('./test-fixtures/res/progress_entry_example');
const getPreviousValid = require('./test-fixtures/res/get_previous_valid_sectionId');
const getPreviousValidUrl = require('./test-fixtures/res/get_previous_valid_url');
const postValidSubmission = require('./test-fixtures/res/post_valid_submission');
const postValidSubmissionServiceDown = require('./test-fixtures/res/post_valid_submission_service_down');
const getKeepAlive = require('./test-fixtures/res/get_keep_alive');

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
    jest.unmock('../questionnaire/form-helper');
    jest.unmock('../index/liveChatHelper');
    jest.unmock('../questionnaire/request-service');
    jest.unmock('client-sessions');
    if (additionalMocks) {
        additionalMocks();
    } else {
        jest.doMock('../questionnaire/questionnaire-service', () =>
            jest.fn(() => ({
                createQuestionnaire: () => createQuestionnaire,
                getCurrentSection: () => getCurrentSection,
                keepAlive: () => getKeepAlive
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
    beforeEach(() => {
        setUpCommonMocks();
    });

    it('Should respond with a redirection status', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply');
        expect(response.statusCode).toBe(302);
    });

    it('Should redirect to the first section URL', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply');
        expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-declaration');
    });

    it('Should redirect the user to the inital page if the requested page is selected without a session', async () => {
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply/applicant-british-citizen-or-eu-national');
        expect(response.res.text).toBe('Found. Redirecting to /apply/applicant-declaration');
    });

    it('Should set a session cookie', async () => {
        let cookiePresent = false;
        const currentAgent = request.agent(app);
        const response = await currentAgent.get('/apply');
        const cookies = response.header['set-cookie'];
        cookies.forEach(cookie => {
            cookiePresent = cookie.startsWith('session=') ? true : cookiePresent;
        });
        expect(cookiePresent).toBe(true);
    });

    describe('createQuestionnaire', () => {
        it('Should fail gracefully', async () => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => {
                            return Promise.reject(new Error('Something went wrong'));
                        },
                        keepAlive: () => getKeepAlive
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(404);
        });
    });

    describe('getFirstSection', () => {
        it('Should fail gracefully', async () => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => createQuestionnaire,
                        getFirstSection: () => {
                            return Promise.reject(new Error('Something went wrong'));
                        },
                        keepAlive: () => getKeepAlive
                    }))
                );
            }
            setUpCommonMocks(blockSpecificMocks);

            const currentAgent = request.agent(app);
            await currentAgent
                .get('/apply')
                .set(
                    'Cookie',
                    'cicaSession=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                );
            const response = await currentAgent.get('/apply');
            expect(response.statusCode).toBe(404);
        });
    });

    describe(':section', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                const prefixedSection = 'p-applicant-enter-your-name';
                const initial = 'p-applicant-declaration';
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        getSection: () => getSectionValid,
                        createQuestionnaire: () => createQuestionnaire,
                        getCurrentSection: () => getCurrentSection,
                        keepAlive: () => getKeepAlive
                    }))
                );
                jest.doMock('../questionnaire/form-helper', () => ({
                    addPrefix: () => prefixedSection,
                    getSectionHtml: () => getSectionHtmlValid,
                    removeSectionIdPrefix: () => initial,
                    getSectionContext: () => undefined
                }));
            }
            setUpCommonMocks(blockSpecificMocks);
        });

        it('Should respond with a 200 status code', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent
                .get('/apply/applicant-enter-your-name')
                .set(
                    'Cookie',
                    'cicaSession=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                );
            expect(response.statusCode).toBe(200);
        });

        it('Should respond with a valid page', async () => {
            const currentAgent = request.agent(app);
            await currentAgent.get('/apply');
            const response = await currentAgent
                .get('/apply/applicant-enter-your-name')
                .set(
                    'Cookie',
                    'cicaSession=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                );
            expect(response.res.text).toContain('<p>This is a valid page</p>');
        });

        describe('Post', () => {
            describe('Redirects', () => {
                beforeEach(() => {
                    function blockSpecificMocks() {
                        const prefixedSection = 'p-applicant-enter-your-name';
                        const section = 'applicant-enter-your-name';
                        const processedAnswer = {'q-applicant-title': 'Mr'};
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                postSection: () => getProgressEntries,
                                createQuestionnaire: () => createQuestionnaire,
                                getCurrentSection: () => getCurrentSection,
                                keepAlive: () => getKeepAlive
                            }))
                        );
                        jest.doMock('../questionnaire/form-helper', () => ({
                            addPrefix: () => prefixedSection,
                            getSectionHtmlWithErrors: () => getSectionHtmlValid,
                            removeSectionIdPrefix: () => section,
                            processRequest: () => processedAnswer,
                            getNextSection: () => section,
                            getSectionContext: () => false
                        }));
                    }
                    setUpCommonMocks(blockSpecificMocks);
                });

                it('Should respond with a redirection status code', async () => {
                    const currentAgent = request.agent(app);
                    await currentAgent.get('/apply/');
                    const response = await currentAgent
                        .post('/apply/applicant-enter-your-name')
                        .set(
                            'Cookie',
                            'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                        );
                    expect(response.statusCode).toBe(302);
                });

                it('Should redirect the user if there are no errors', async () => {
                    const currentAgent = request.agent(app);
                    await currentAgent.get('/apply/');
                    const response = await currentAgent
                        .post('/apply/applicant-enter-your-name')
                        .set(
                            'Cookie',
                            'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                        );
                    expect(response.statusCode).toBe(302);
                    expect(response.res.text).toBe(
                        'Found. Redirecting to /apply/applicant-enter-your-name'
                    );
                });
            });

            describe('Not Found', () => {
                beforeEach(() => {
                    function blockSpecificMocks() {
                        const prefixedSection = 'p-applicant-enter-your-name';
                        const section = 'applicant-enter-your-name';
                        const processedAnswer = {'q-applicant-title': 'Mr'};
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            jest.fn(() => ({
                                postSection: () => {
                                    throw new Error();
                                },
                                createQuestionnaire: () => createQuestionnaire,
                                getCurrentSection: () => getCurrentSection,
                                keepAlive: () => getKeepAlive
                            }))
                        );
                        jest.doMock('../questionnaire/form-helper', () => ({
                            addPrefix: () => prefixedSection,
                            getSectionHtmlWithErrors: () => getSectionHtmlValid,
                            removeSectionIdPrefix: () => section,
                            processRequest: () => processedAnswer,
                            getNextSection: () => section
                        }));
                    }
                    setUpCommonMocks(blockSpecificMocks);
                });

                it('Should fail gracefully', async () => {
                    const currentAgent = request.agent(app);
                    formHelper.getSectionHtml = jest.fn(() => {
                        throw new Error('Something went wrong');
                    });
                    await currentAgent.get('/apply/');
                    const response = await currentAgent
                        .post('/apply/applicant-enter-your-name')
                        .set(
                            'Cookie',
                            'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                        )
                        .send();
                    expect(response.statusCode).toBe(404);
                });
            });

            describe('Submission', () => {
                describe('Success', () => {
                    beforeEach(() => {
                        function blockSpecificMocks() {
                            const prefixedSection = 'p-applicant-declaration';
                            const section = 'the-next-page';
                            const processedAnswer = {'q-applicant-declaration': [true]};
                            jest.doMock('../questionnaire/form-helper', () => ({
                                addPrefix: () => prefixedSection,
                                removeSectionIdPrefix: () => section,
                                processRequest: () => processedAnswer,
                                getSectionContext: () => 'submission'
                            }));
                            jest.doMock('../questionnaire/questionnaire-service', () =>
                                jest.fn(() => ({
                                    postSubmission: () => {},
                                    postSection: () => getProgressEntries,
                                    createQuestionnaire: () => createQuestionnaire,
                                    getCurrentSection: () => getCurrentSection,
                                    getSubmissionStatus: () => postValidSubmission,
                                    keepAlive: () => getKeepAlive
                                }))
                            );
                        }
                        setUpCommonMocks(blockSpecificMocks);
                    });

                    it('Should submit the application', async () => {
                        const currentAgent = request.agent(app);
                        await currentAgent.get('/apply/');
                        const response = await currentAgent
                            .post('/apply/applicant-declaration')
                            .set(
                                'Cookie',
                                'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                            );
                        expect(response.statusCode).toBe(302);
                        expect(response.res.text).toBe(
                            'Found. Redirecting to /apply/the-next-page'
                        );
                    });
                });

                describe('Failure', () => {
                    beforeEach(() => {
                        function blockSpecificMocks() {
                            const prefixedSection = 'p-applicant-declaration';
                            const section = 'the-next-page';
                            const processedAnswer = {'q-applicant-declaration': [true]};
                            jest.doMock('../questionnaire/form-helper', () => ({
                                addPrefix: () => prefixedSection,
                                removeSectionIdPrefix: () => section,
                                processRequest: () => processedAnswer,
                                getSectionContext: () => 'submission'
                            }));
                            jest.doMock('../questionnaire/questionnaire-service', () =>
                                jest.fn(() => ({
                                    postSubmission: () => {},
                                    postSection: () => getProgressEntries,
                                    createQuestionnaire: () => createQuestionnaire,
                                    getCurrentSection: () => getCurrentSection,
                                    getSubmissionStatus: () => postValidSubmissionServiceDown,
                                    keepAlive: () => getKeepAlive
                                }))
                            );
                        }
                        setUpCommonMocks(blockSpecificMocks);
                    });

                    it('Should submit the application', async () => {
                        const currentAgent = request.agent(app);
                        await currentAgent.get('/apply/');
                        const response = await currentAgent
                            .post('/apply/applicant-declaration')
                            .set(
                                'Cookie',
                                'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA;'
                            );
                        expect(response.statusCode).toBe(500);
                        expect(response.res.text).toContain(
                            '<p class="govuk-body">However, there is a delay with us sending your reference number to you.</p>'
                        );
                    });
                });
            });
        });
    });

    describe('/previous/:section', () => {
        describe('Given a sectionId', () => {
            beforeEach(() => {
                function blockSpecificMocks() {
                    const prefixedSection = 'p-applicant-enter-your-name';
                    const section = 'applicant-declaration';
                    const processedAnswer = {'q-applicant-title': 'Mr'};
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            getSection: () => getSectionValid,
                            postSection: () => getProgressEntries,
                            getPrevious: () => getPreviousValid,
                            createQuestionnaire: () => createQuestionnaire,
                            getCurrentSection: () => getCurrentSection,
                            keepAlive: () => getKeepAlive
                        }))
                    );
                    jest.doMock('../questionnaire/form-helper', () => ({
                        addPrefix: () => prefixedSection,
                        removeSectionIdPrefix: () => section,
                        getSectionHtml: () => getSectionHtmlValid,
                        processRequest: () => processedAnswer,
                        getNextSection: () => section,
                        getSectionContext: () => false
                    }));
                }
                setUpCommonMocks(blockSpecificMocks);
            });

            it('Should redirect to a section', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.statusCode).toBe(302);
            });

            it('Should identify and render an external URL', async () => {
                const currentAgent = request.agent(app);
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'cicaSession=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.res.text).toBe(
                    'Found. Redirecting to /apply/applicant-declaration'
                );
            });
        });

        describe('Given a URL', () => {
            beforeEach(() => {
                function blockSpecificMocks() {
                    const prefixedSection = 'p-applicant-enter-your-name';
                    const Section = 'applicant-declaration';
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            getPrevious: () => getPreviousValidUrl,
                            createQuestionnaire: () => createQuestionnaire,
                            keepAlive: () => getKeepAlive
                        }))
                    );
                    jest.doMock('../questionnaire/form-helper', () => ({
                        addPrefix: () => prefixedSection,
                        removeSectionIdPrefix: () => Section
                    }));
                }
                setUpCommonMocks(blockSpecificMocks);
            });

            it('Should redirect the request', async () => {
                const currentAgent = request.agent(app);
                await currentAgent.get('/apply/');
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.statusCode).toBe(302);
            });

            it('Should redirect to a page', async () => {
                const currentAgent = request.agent(app);
                await currentAgent.get('/apply/');
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.res.text).toBe('Found. Redirecting to http://www.google.com/');
            });
        });

        describe('Error', () => {
            it('Should fail gracefully', async () => {
                function blockSpecificMocks() {
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            createQuestionnaire: () => createQuestionnaire,
                            getPrevious() {
                                const err = Error(`The page was not found`);
                                err.name = 'HTTPError';
                                err.statusCode = 404;
                                err.error = '404 Not Found';
                                throw err;
                            },
                            keepAlive: () => getKeepAlive
                        }))
                    );
                }
                setUpCommonMocks(blockSpecificMocks);
                const currentAgent = request.agent(app);
                await currentAgent.get('/apply/');
                formHelper.removeSectionIdPrefix = jest.fn(() => 'applicant-declaration');
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.statusCode).toBe(404);
            });
            it('Should default to 404 if no error code is provided', async () => {
                function blockSpecificMocks() {
                    jest.doMock('../questionnaire/questionnaire-service', () =>
                        jest.fn(() => ({
                            createQuestionnaire: () => createQuestionnaire,
                            getPrevious: () => {
                                return Promise.reject(new Error('Something went wrong'));
                            },
                            keepAlive: () => getKeepAlive
                        }))
                    );
                }
                setUpCommonMocks(blockSpecificMocks);
                const currentAgent = request.agent(app);
                await currentAgent.get('/apply/');
                formHelper.removeSectionIdPrefix = jest.fn(() => 'applicant-declaration');
                const response = await currentAgent
                    .get('/apply/previous/applicant-enter-your-name')
                    .set(
                        'Cookie',
                        'session=mzBCUTUQGsOT36H6Bvvy5w.D-Om63et1DE6qXBbDvSbsG9A-nw_jL29edAzRc74M7ELpS5am1meqsbNXr5eNhVjQip3H0dRWS9gyIua1h6SVxVPd8X-4BcV4K4RXwnzhEc.1565175346779.900000.4UB0eoITG2We5EDID3nrODqlVqqSzuV72tiJXuzreDg;'
                    );
                expect(response.statusCode).toBe(404);
            });
        });
    });

    describe('/apply/:section?next=<some section id>', () => {
        it('Should redirect to the prescribed next section id if available', async () => {
            function blockSpecificMocks() {
                jest.doMock('client-sessions', () => () => (req, res, next) => {
                    req.session = {
                        cookie: {},
                        questionnaireId: 'c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd'
                    };

                    next();
                });

                jest.doMock('../questionnaire/request-service', () => {
                    const api = `${process.env.CW_DCS_URL}/api/v1/questionnaires/c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd`;

                    return () => ({
                        post: options => {
                            const responses = {
                                [`${api}/sections/p-applicant-enter-your-name/answers`]: {
                                    statusCode: 201
                                }
                            };

                            return responses[options.url];
                        },
                        get: options => {
                            const responses = {
                                [`${api}/progress-entries?filter[sectionId]=p--check-your-answers`]: {
                                    statusCode: 200,
                                    body: {
                                        data: [
                                            {
                                                attributes: {
                                                    sectionId: 'p--check-your-answers'
                                                }
                                            }
                                        ]
                                    }
                                },
                                [`${api}/session/keep-alive`]: {
                                    statusCode: 200,
                                    ...getKeepAlive
                                }
                            };

                            return responses[options.url];
                        }
                    });
                });
            }
            setUpCommonMocks(blockSpecificMocks);

            const response = await request(app).post(
                '/apply/applicant-enter-your-name?next=check-your-answers'
            );

            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe('Found. Redirecting to /apply/check-your-answers');
        });

        it('Should redirect to the current section if the prescribed next section id is not available', async () => {
            function blockSpecificMocks() {
                jest.doMock('client-sessions', () => () => (req, res, next) => {
                    req.session = {
                        cookie: {},
                        questionnaireId: 'c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd'
                    };

                    next();
                });

                jest.doMock('../questionnaire/request-service', () => {
                    const api = `${process.env.CW_DCS_URL}/api/v1/questionnaires/c7f3b592-b7ac-4f2a-ab9c-8af407ade8cd`;

                    return () => ({
                        post: options => {
                            const responses = {
                                [`${api}/sections/p-applicant-are-you-18-or-over/answers`]: {
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
                                                    sectionId:
                                                        'p-applicant-redirect-to-our-other-application'
                                                }
                                            }
                                        ]
                                    }
                                },
                                [`${api}/session/keep-alive`]: {
                                    statusCode: 200,
                                    ...getKeepAlive
                                }
                            };

                            return responses[options.url];
                        }
                    });
                });
            }
            setUpCommonMocks(blockSpecificMocks);

            const currentAgent = request.agent(app);
            await currentAgent.get('/apply/');
            const response = await currentAgent.post(
                '/apply/applicant-are-you-18-or-over?next=check-your-answers'
            );

            expect(response.statusCode).toBe(302);
            expect(response.res.text).toBe(
                'Found. Redirecting to /apply/applicant-redirect-to-our-other-application'
            );
        });
    });
});

describe('/session', () => {
    describe('Success', () => {
        beforeEach(() => {
            function blockSpecificMocks() {
                jest.doMock('../questionnaire/questionnaire-service', () =>
                    jest.fn(() => ({
                        createQuestionnaire: () => createQuestionnaire,
                        getCurrentSection: () => getCurrentSection,
                        keepAlive: () => getKeepAlive
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
                        createQuestionnaire: () => createQuestionnaire,
                        getCurrentSection: () => getCurrentSection,
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
