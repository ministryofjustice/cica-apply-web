'use strict';

const addressServiceMethodsMock = {lookupPostcode: jest.fn()};
jest.doMock('../address-finder-service', () => () => addressServiceMethodsMock);

// eslint-disable-next-line global-require

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
            addressServiceMethodsMock.lookupPostcode.mockReturnValueOnce(
                getAddressCollectionResponse
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
                        expect(response.data).toEqual(getAddressCollectionResponse.body);
                    })
            );
        });
    });
    describe('Error thrown when calling the external api', () => {
        it('Should fail gracefully if there is an unexpected error', async () => {
            addressServiceMethodsMock.lookupPostcode.mockImplementation(() => {
                throw new Error();
            });
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
                        expect(response.status).toBe(500);
                    })
            );
        });
    });
});
