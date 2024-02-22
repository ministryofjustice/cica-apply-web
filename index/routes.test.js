/* eslint-disable global-require */

'use strict';

const request = require('supertest');

let app;

const mocks = {
    '../index/liveChatHelper': () =>
        jest.fn(() => ({
            isLiveChatActive: () => {
                return true;
            }
        }))
};

function setUpCommonMocks(additionalMocks = {}) {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    const combinedMocks = {...mocks, ...additionalMocks};
    Object.keys(combinedMocks).forEach(path => {
        jest.unmock(path);
        if (combinedMocks[path] !== '__UNMOCK__') {
            jest.doMock(path, combinedMocks[path]);
        }
    });
    app = require('../app');
}

describe('Static routes', () => {
    beforeEach(() => {
        setUpCommonMocks();
    });
    describe('/', () => {
        it('should redirect to GOV UK landing page', async () => {
            const currentAgent = request.agent(app);
            const response = await currentAgent.get('/');
            expect(response.statusCode).toBe(301);
            expect(response.res.text).toBe(
                'Moved Permanently. Redirecting to https://www.gov.uk/claim-compensation-criminal-injury/make-claim'
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
            const pageHeading = `<h1 class="govuk-heading-xl">Accessibility statement for the claim criminal injuries compensation service</h1>`.replace(
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
            beforeEach(() => {
                setUpCommonMocks();
            });
            it('Should render specific content on the page', async () => {
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
            beforeEach(() => {
                setUpCommonMocks({
                    '../index/liveChatHelper': () =>
                        jest.fn(() => ({
                            isLiveChatActive: () => {
                                return false;
                            }
                        }))
                });
            });
            it('Should render specific content on the page', async () => {
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
            beforeEach(() => {
                setUpCommonMocks();
            });
            it('Should render specific content on the page', async () => {
                const response = await request(app).get('/chat');
                const actual = response.res.text.replace(/\s+/g, '');
                const pageContent = `<iframe id="chat-iframe"`.replace(/\s+/g, '');
                expect(actual).toContain(pageContent);
            });
        });
        describe('When Live Chat is not active', () => {
            beforeEach(() => {
                setUpCommonMocks({
                    '../index/liveChatHelper': () =>
                        jest.fn(() => ({
                            isLiveChatActive: () => {
                                return false;
                            }
                        }))
                });
            });
            it('Should render specific content on the page', async () => {
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
