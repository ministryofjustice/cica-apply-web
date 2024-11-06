'use strict';

const isValidExternalId = require('.');

describe('isValidExternalId', () => {
    it('Should return true for a valid external id', () => {
        const validExternalId = 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6';
        expect(isValidExternalId(validExternalId)).toBe(true);
    });
    it('Should return false for an invalid external id', () => {
        const invalidExternalId = 'foo';
        expect(isValidExternalId(invalidExternalId)).toBe(false);
    });
    it('Should return false for an undefined external id', () => {
        const undefinedExternalId = undefined;
        expect(isValidExternalId(undefinedExternalId)).toBe(false);
    });
});
