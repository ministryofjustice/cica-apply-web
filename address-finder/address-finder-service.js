'use strict';

const service = require('../questionnaire/request-service')();

const addressFinderEndpoint = 'https://api.os.uk/search/places/v1/postcode';
const apikey = 'TO_BE_DEFINED';

// TODO should this be async?
function addressFinderService() {
    function lookupPostcode(postcode) {
        const opts = {
            url: `${addressFinderEndpoint}?postcode=${postcode}`,
            headers: {
                Key: apikey
            }
        };
        return service.get(opts);
    }
    return Object.freeze({
        lookupPostcode
    });
}

module.exports = addressFinderService;
