'use strict';

function createErrorHandlerService() {
    function processError(err) {
        let status = 500;
        let templateName = '500';

        if (err.statusCode === 500) {
            templateName = '500';
            status = 500;
        }

        if (err.statusCode === 504) {
            templateName = '500';
            status = 504;
        }

        if (err.name === 'CRNNotRetrieved') {
            templateName = '500.MBDown';
            status = 500;
        }

        if (err.name === 'DCSUnavailable') {
            templateName = '500.DCSDown';
            status = 500;
        }

        if (err.code === 'EBADCSRFTOKEN') {
            templateName = '500.badtoken';
            status = 403;
        }

        if (err.statusCode === 404) {
            templateName = '404';
            status = 404;
        }

        return {
            status,
            templateName
        };
    }

    return Object.freeze({
        processError
    });
}

module.exports = createErrorHandlerService;
