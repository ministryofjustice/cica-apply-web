'use strict';

const getRedirectionUrl = require('.');

describe('getRedirectionUrl', () => {
    it('Should return a valid URL', () => {
        const type = 'start';
        const result = getRedirectionUrl(type);
        expect(result).toBe('/apply/start');
    });
    it('Should return undefined', () => {
        const type = 'notavalidtype';
        const result = getRedirectionUrl(type);
        expect(result).toBe(undefined);
    });
});
