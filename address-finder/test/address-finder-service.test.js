'use strict';

const getAddressCollectionResponse = require('./fixtures/validAddressCollectionResponse.json');
const noAddressesFoundResponse = require('./fixtures/noAddressesFoundResponse.json');

// see https://apidocs.os.uk/reference/os-places-postcode
describe('find Address by Postcode lookup', () => {
    describe('200', () => {
        it('Should respond with status code 200 and return an Adress collection response given a valid postcode', async () => {
            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => getAddressCollectionResponse
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode('FO123BA');
            expect(response).toEqual(getAddressCollectionResponse);
        });

        it('Should respond with status code 200 and return the correct header response when no addresses found', async () => {
            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => noAddressesFoundResponse
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode('FO123BA');
            expect(response).toEqual(noAddressesFoundResponse);
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

            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => noPostcodeProvidedError
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode();
            expect(response).toEqual(noPostcodeProvidedError);
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

            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => invalidPostcodeProvidedError
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode();
            expect(response).toEqual(invalidPostcodeProvidedError);
        });

        it('Should respond with status code 400 and return an error response when postcode parameter does not contain minimum of sector plus 1 digit', async () => {
            const invalidPostcodeProvidedError = {
                statusCode: 400,
                body: {
                    error: {
                        statuscode: 400,
                        message:
                            'Requested postcode must contain a minimum of the sector plus 1 digit of the district e.g. SO1. Requested postcode was AB12CD'
                    }
                }
            };

            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => invalidPostcodeProvidedError
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode();
            expect(response).toEqual(invalidPostcodeProvidedError);
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

            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => apiKeyInvalidFault
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode('FO123BA');
            expect(response).toEqual(apiKeyInvalidFault);
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

            jest.doMock('../../questionnaire/request-service', () =>
                jest.fn(() => ({
                    get: () => internalServiceError
                }))
            );
            jest.resetModules();
            // eslint-disable-next-line global-require
            const addressFinderService = require('../address-finder-service')();
            const response = await addressFinderService.lookupPostcode('FO123BA');
            expect(response).toEqual(internalServiceError);
        });
    });
});
