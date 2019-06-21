'use strict';

const request = require('supertest');

const createQuestionnaire = require('./test-fixtures/res/get_questionnaire.json');
const createQuestionnaireInvalid = require('./test-fixtures/res/get_invalid_questionnaire.json');
const getSectionValid = require('./test-fixtures/res/get_schema_valid');
const getPreviousValid = require('./test-fixtures/res/get_previous_valid');

// const questionnaireService = require('../questionnaire/questionnaire-service');

let app;

/**
 * Testing Data capture service endpoints
 */

describe('Data capture service endpoints', () => {
    describe('Cica-web routes', () => {
        describe('/', () => {
            describe('GET', () => {
                describe('302', () => {
                    beforeAll(() => {
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                createQuestionnaire: () => createQuestionnaire
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should respond with a Found status', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.statusCode).toBe(302);
                    });

                    it('Should respond by redirecting the user', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.res.text).toBe(
                            'Found. Redirecting to /apply/applicant-declaration'
                        );
                    });

                    it('Should set a cookie called cicaSession', async () => {
                        const response = await request(app)
                            .get('/apply')
                            .set('Accept', 'application/json');

                        let cookiePresent = false;
                        const cookies = response.header['set-cookie'];
                        cookies.forEach(cookie => {
                            cookiePresent = cookie.startsWith('cicaSession=')
                                ? true
                                : cookiePresent;
                        });
                        expect(cookiePresent).toBe(true);
                    });
                });
                describe('404', () => {
                    beforeAll(() => {
                        jest.resetModules();
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                createQuestionnaire: () => createQuestionnaireInvalid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should fail gracefully', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.statusCode).toBe(404);
                    });
                    it('Should not set a cookie', async () => {
                        const response = await request(app).get('/apply');
                        let cookiePresent = false;
                        const cookies = response.header['set-cookie'];
                        if (cookies) {
                            cookies.forEach(cookie => {
                                cookiePresent = cookie.startsWith('cicaSession=')
                                    ? true
                                    : cookiePresent;
                            });
                        }
                        expect(cookiePresent).toBe(false);
                    });
                });
            });
        });
        describe('/apply/:section', () => {
            describe('GET', () => {
                describe('200', () => {
                    beforeAll(() => {
                        jest.doMock('../questionnaire/questionnaire-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                getSection: () => getSectionValid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                        app.use('/apply', (req, res, next) => {
                            req.cicaSession.questionnaireId = 'SomeCookie';
                            next(); // <-- important!
                        });
                    });
                    it('Should respond with a success status', async () => {
                        const response = await request(app).get('/apply/applicant-enter-your-name');
                        expect(response.statusCode).toBe(200);
                    });

                    it('Should display the section to the user', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.res.text).toBe(
                            'Found. Redirecting to /apply/applicant-declaration'
                        );
                    });
                });
                describe('404', () => {
                    beforeAll(() => {
                        jest.resetModules();
                        jest.doMock('../questionnaire/request-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                post: () => createQuestionnaireInvalid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should fail gracefully', async () => {
                        const response = await request(app).get(
                            '/apply/p-applicant-enter-your-name'
                        );
                        expect(response.statusCode).toBe(404);
                    });
                    it('Should not set a cookie', async () => {
                        const response = await request(app).get(
                            '/apply/p-applicant-enter-your-name'
                        );
                        let cookiePresent = false;
                        const cookies = response.header['set-cookie'];
                        if (cookies) {
                            cookies.forEach(cookie => {
                                cookiePresent = cookie.startsWith('cicaSession=')
                                    ? true
                                    : cookiePresent;
                            });
                        }
                        expect(cookiePresent).toBe(false);
                    });
                });
            });
            describe('POST', () => {
                describe('200', () => {
                    beforeAll(() => {
                        jest.doMock('../questionnaire/request-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                post: () => createQuestionnaire
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should respond with a success status', async () => {
                        const response = await request(app)
                            .get('/apply/p-applicant-declaration')
                            .set('Cookie', 'cicaSession=CookiesAreKewl');
                        expect(response.statusCode).toBe(200);
                    });

                    it('Should display the section to the user', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.res.text).toBe(
                            'Found. Redirecting to /apply/applicant-declaration'
                        );
                    });
                });
                describe('404', () => {
                    beforeAll(() => {
                        jest.resetModules();
                        jest.doMock('../questionnaire/request-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                post: () => createQuestionnaireInvalid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should fail gracefully', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.statusCode).toBe(404);
                    });
                    it('Should not set a cookie', async () => {
                        const response = await request(app).get('/apply');
                        let cookiePresent = false;
                        const cookies = response.header['set-cookie'];
                        if (cookies) {
                            cookies.forEach(cookie => {
                                cookiePresent = cookie.startsWith('cicaSession=')
                                    ? true
                                    : cookiePresent;
                            });
                        }
                        expect(cookiePresent).toBe(false);
                    });
                });
            });
        });
        describe('/apply/previous/:section', () => {
            describe('GET', () => {
                describe('200', () => {
                    beforeAll(() => {
                        jest.doMock('../questionnaire/request-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                getPrevious: () => getPreviousValid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should respond with a found status', async () => {
                        /* const mockRequest = () => ({
                            cicaSession: {questionnaireId: 'CookiesAreKewl'}
                        }); */
                        const response = await request(app)
                            .get('/apply/p-applicant-declaration')
                            .set('Set-Cookie', 'cicaSession=CookiesAreKewl');
                        expect(response.statusCode).toBe(302);
                    });

                    it('Should display the section to the user', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.res.text).toBe(
                            'Found. Redirecting to /apply/applicant-declaration'
                        );
                    });
                });
                describe('404', () => {
                    beforeAll(() => {
                        jest.resetModules();
                        jest.doMock('../questionnaire/request-service', () =>
                            // return a modified factory function, that returns an object with a method, that returns a valid created response
                            jest.fn(() => ({
                                post: () => createQuestionnaireInvalid
                            }))
                        );
                        // eslint-disable-next-line global-require
                        app = require('../app');
                    });
                    it('Should fail gracefully', async () => {
                        const response = await request(app).get('/apply');
                        expect(response.statusCode).toBe(404);
                    });
                    it('Should not set a cookie', async () => {
                        const response = await request(app).get('/apply');
                        let cookiePresent = false;
                        const cookies = response.header['set-cookie'];
                        if (cookies) {
                            cookies.forEach(cookie => {
                                cookiePresent = cookie.startsWith('cicaSession=')
                                    ? true
                                    : cookiePresent;
                            });
                        }
                        expect(cookiePresent).toBe(false);
                    });
                });
            });
        });
    });
    describe('questionnaire service routes', () => {
        it('Should create a new questionnaire', async () => {
            jest.doMock('../questionnaire/questionnaire-service', () =>
                jest.fn(() => ({
                    createQuestionnaire: () => createQuestionnaire
                }))
            );
            jest.resetModules();

            // eslint-disable-next-line no-shadow,global-require
            const questionnaireService = require('../questionnaire/questionnaire-service')();

            const response = await questionnaireService.createQuestionnaire();

            expect(JSON.stringify(response)).toMatch(JSON.stringify(createQuestionnaire));
        });
    });
});
