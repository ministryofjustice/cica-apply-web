'use strict';

const createRequestService = require('../questionnaire/request-service');

const {get} = createRequestService();

const addressFinderEndpoint = 'https://api.os.uk/search/places/v1/postcode';
const apikey = `${process.env.CW_OS_PLACES_API_KEY}`;

function addressFinderService() {
    function lookupPostcode(postcode) {
        const opts = {
            url: `${addressFinderEndpoint}?postcode=${postcode}`,
            headers: {
                Key: apikey
            }
        };
        return get(opts);
    }
    return Object.freeze({
        lookupPostcode
    });
}

module.exports = addressFinderService;
