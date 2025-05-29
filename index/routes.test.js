/* eslint-disable global-require */

'use strict';

const request = require('supertest');

let app;

const mocks = {};

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
            expect(response.statusCode).toBe(301);
        });
        it('Should render a page with the correct page heading', async () => {
            const response = await request(app).get('/contact-us');
            expect(response.res.text).toBe(
                'Moved Permanently. Redirecting to https://contact-the-cica.form.service.justice.gov.uk'
            );
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
});
