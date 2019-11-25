'use strict';

const createErrorHandler = require('./index');

const errorHandler = createErrorHandler();

describe('error handler', () => {
    it('should return a 500', () => {
        const err = new Error('Internal Server Error');
        err.statusCode = 500;
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 500,
            templateName: '500'
        });
    });

    it('should return a 504', () => {
        const err = new Error('Internal Server Error');
        err.statusCode = 504;
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 504,
            templateName: '500'
        });
    });

    it('should process a 404 error', () => {
        const err = new Error('Page Not Found');
        err.statusCode = 404;
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 404,
            templateName: '404'
        });
    });

    it('should process a "CRNNotRetrieved" error', () => {
        const err = new Error('Internal Server Error');
        err.name = 'CRNNotRetrieved';
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 500,
            templateName: '500.MBDown'
        });
    });

    it('should process a "DCSUnavailable" error', () => {
        const err = new Error('Internal Server Error');
        err.name = 'DCSUnavailable';
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 500,
            templateName: '500.DCSDown'
        });
    });

    it('should process a "EBADCSRFTOKEN" error', () => {
        const err = new Error('Session timeout');
        err.code = 'EBADCSRFTOKEN';
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 403,
            templateName: '500.badtoken'
        });
    });
    it('should return a default error response when no specifics are given', () => {
        const err = new Error();
        const result = errorHandler.processError(err);
        expect(result).toEqual({
            status: 500,
            templateName: '500'
        });
    });
});
