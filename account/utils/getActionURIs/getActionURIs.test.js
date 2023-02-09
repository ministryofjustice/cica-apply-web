'use strict';

const {getSignedInURI, getSignedOutURI, getDashboardURI} = require('.');

describe('getActionURIs', () => {
    describe('getSignedInURI', () => {
        it('Should return full URI including host and pathname', () => {
            expect(getSignedInURI()).toBe('http://www.cw.com/account/signed-in');
        });
        it('Should return URI including path only', () => {
            expect(getSignedInURI(true)).toBe('/account/signed-in');
        });
    });

    describe('getSignedOutURI', () => {
        it('Should return full URI including host and pathname', () => {
            expect(getSignedOutURI()).toBe('http://www.cw.com/account/signed-out');
        });
        it('Should return URI including path only', () => {
            expect(getSignedOutURI(true)).toBe('/account/signed-out');
        });
    });

    describe('getDashboardURI', () => {
        it('Should return full URI including host and pathname', () => {
            expect(getDashboardURI()).toBe('http://www.cw.com/account/dashboard');
        });
        it('Should return URI including path only', () => {
            expect(getDashboardURI(true)).toBe('/account/dashboard');
        });
    });
});
