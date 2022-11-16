'use strict';

const request = require('supertest');
const createQuestionnaire = require('../../test/test-fixtures/res/get_questionnaire.json');
const getSectionValid = require('../../test/test-fixtures/res/get_schema_valid');
const getKeepAlive = require('../../test/test-fixtures/res/get_keep_alive');
const getAddressCollectionResponse = require('./fixtures/validAddressCollectionResponse.json');

let app;

beforeEach(() => {
    // set up for session context, otherwise we will get a redirect 302
    jest.resetModules();
    const initial = 'p-applicant-declaration';
    // jest.resetModules();
    jest.doMock('../../questionnaire/questionnaire-service', () =>
        jest.fn(() => ({
            getSection: () => getSectionValid,
            createQuestionnaire: () => createQuestionnaire,
            keepAlive: () => getKeepAlive
        }))
    );
    jest.doMock('../../questionnaire/form-helper', () => ({
        removeSectionIdPrefix: () => initial
    }));
});
describe('Address finder route proxy endpoint address-finder/postcode', () => {
    describe('200', () => {
        it('Should respond with a success status', async () => {
            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    lookupPostcode: () => getAddressCollectionResponse
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');
            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode?postcode=CF645UL')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                        expect(response.body).toEqual(getAddressCollectionResponse.body);
                    })
            );
        });
    });

    describe('400', () => {
        it('Should respond with status code 400 and return an error response when no postcode parameter provided', async () => {
            const noPostcodeProvidedError = {
                statusCode: 400,
                body: {
                    error: {
                        statuscode: 400,
                        message: 'No postcode parameter provided.'
                    }
                }
            };

            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    // lookupPostcode(postcode)
                    lookupPostcode: () => noPostcodeProvidedError
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');
            // eslint-disable-next-line global-require
            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(400);
                        expect(response.body).toEqual(noPostcodeProvidedError.body);
                    })
            );
        });

        it('Should respond with status code 400 and return an error response when an invalid postcode parameter provided', async () => {
            const invalidPostcodeProvidedError = {
                statusCode: 400,
                body: {
                    error: {
                        statuscode: 400,
                        message:
                            'Parameter £"1 is not a valid parameter for resource postcode. Valid parameters for requested resource are postcode, format, dataset, maxresults, offset, lr, fq, output_srs.'
                    }
                }
            };

            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    // lookupPostcode(postcode)
                    lookupPostcode: () => invalidPostcodeProvidedError
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');
            // eslint-disable-next-line global-require
            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(400);
                        expect(response.body).toEqual(invalidPostcodeProvidedError.body);
                    })
            );
        });
    });

    describe('401', () => {
        it('Should respond with status code 401 and return an error response for invalid api key', async () => {
            const apiKeyInvalidFault = {
                statusCode: 401,
                body: {
                    fault: {
                        faultstring: 'Invalid ApiKey',
                        detail: {
                            errorcode: 'oauth.v2.InvalidApiKey'
                        }
                    }
                }
            };
            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    lookupPostcode: () => apiKeyInvalidFault
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');
            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode?postcode=CF645UL')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(401);
                        expect(response.body).toEqual(apiKeyInvalidFault.body);
                    })
            );
        });
    });
    describe('500', () => {
        it('Should respond with status code 500 and return an error response for internal service error', async () => {
            const internalServiceError = {
                statusCode: 500,
                body: {
                    error: {
                        statuscode: 500,
                        message: 'The provided request resulted in an internal server error.'
                    }
                }
            };
            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    lookupPostcode: () => internalServiceError
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');
            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode?postcode=CF645UL')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(500);
                        expect(response.body).toEqual(internalServiceError.body);
                    })
            );
        });
    });

    describe('404', () => {
        it('Should fail gracefully if there is an unexpected error', async () => {
            jest.doMock('../address-finder-service', () =>
                jest.fn(() => ({
                    lookupPostcode: () => {
                        throw new Error();
                    }
                }))
            );

            // eslint-disable-next-line global-require
            app = require('../../app');

            const currentAgent = request.agent(app);
            return currentAgent.get('/apply/').then(() =>
                currentAgent
                    .get('/address-finder/postcode?postcode=CF645UL')
                    .set(
                        'Cookie',
                        'session=te3AFsfQozY49T4FIL8lEA.K2YvZ_eUm0YcCg2IA_qtCorcS2T17Td11LC0WmYuTaWc5PQuHcoCTHPuOPQoWVy_R5tUX4vzV4_pENOBxk1xPg0obdlP4suxaGK2YdqxjAE.1565864591496.900000.NwyQHlNP62CAiD-sk2GuuJvLzAQEZjX364hfnLp06yA'
                    )
                    .then(response => {
                        expect(response.statusCode).toBe(404);
                    })
            );
        });
    });
});
