'use strict';

const getValidReferrerOrDefault = require('.');
const {getDashboardURI} = require('../getActionURIs');

const REFERRER_VALID = '/apply/this-is-a-valid-id';
const REFERRER_INVALID_LENGTH =
    '/apply/this-is-a-not-valid-id-becuse-it-has-too-many-characters-in-its-name-andwill-not-pass-the-regex-check';
const REFERRER_INVALID_SHAPE = 'http://www.google.com';

describe('getValidReferrerOrDefault', () => {
    it('Should return the valid referrer', () => {
        const result = getValidReferrerOrDefault(REFERRER_VALID);
        expect(result).toBe(REFERRER_VALID);
    });

    it('Should return the default referrer - too long', () => {
        const result = getValidReferrerOrDefault(REFERRER_INVALID_LENGTH);
        expect(result).toBe(getDashboardURI());
    });

    it('Should return the default referrer - incorrect shape', () => {
        const result = getValidReferrerOrDefault(REFERRER_INVALID_SHAPE);
        expect(result).toBe(getDashboardURI());
    });

    it('Should return the specified default referrer', () => {
        const result = getValidReferrerOrDefault(REFERRER_INVALID_SHAPE, '/go-here-instead/');
        expect(result).toBe('/go-here-instead/');
    });
});
