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
    });
});
