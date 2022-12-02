'use strict';

const requestServiceMethodsMock = {get: jest.fn()};
jest.doMock('../../questionnaire/request-service', () => () => requestServiceMethodsMock);

// eslint-disable-next-line global-require
const addressFinderService = require('../address-finder-service')();
const getAddressCollectionResponse = require('./fixtures/validAddressCollectionResponse.json');

// see https://apidocs.os.uk/reference/os-places-postcode
describe('find Address by Postcode lookup', () => {
    describe('200', () => {
        it('Should respond with status code 200 and return an Address collection response given a valid postcode', async () => {
            requestServiceMethodsMock.get.mockReturnValueOnce(getAddressCollectionResponse);

            const response = await addressFinderService.lookupPostcode('FO123BA');
            expect(response).toEqual(getAddressCollectionResponse);
        });

        it.todo(
            'Should respond with status code 200 and return the correct header response when no addresses found'
        );
    });

    describe('400', () => {
        it.todo(
            'Should respond with status code 400 and return an error response when no postcode parameter provided'
        );

        it.todo(
            'Should respond with status code 400 and return an error response when an invalid postcode parameter provided'
        );

        it.todo(
            'Should respond with status code 400 and return an error response when postcode parameter does not contain minimum of sector plus 1 digit'
        );
    });

    describe('401', () => {
        it.todo(
            'Should respond with status code 401 and return an error response for invalid api key'
        );
    });
    describe('500', () => {
        it.todo(
            'Should respond with status code 500 and return an error response for internal service error'
        );
    });
});
