/* eslint-disable global-require */

'use strict';

let createAccountService;

const OWNER_ID = 'urn:fdc:gov.uk:2022:dGhpc2lzYW5vd25lcmlkdGhpc2lzYW5vd25lcmlkdGh';
const SESSION_WITH_OWNER = {
    ownerId: OWNER_ID
};
const SESSION_WITHOUT_OWNER = {};

const REGEX_OWNER_ID_ANONYMOUS = /^urn:uuid:[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
const REGEX_OWNER_ID_ASSIGNED = /^(urn:fdc:gov\.uk:2022:[A-Za-z0-9+/=-_]{1,44})$/i;

const REQUEST_WITH_IS_AUTHENTICATED_TRUE = {isAuthenticated: true};

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    createAccountService = require('./account-service');
});

describe('Account service', () => {
    describe('session not populated with ownerId', () => {
        describe('getOwnerId', () => {
            it('Should generate a URN with GUID', () => {
                const accountService = createAccountService(SESSION_WITHOUT_OWNER);
                const ownerId = accountService.getOwnerId();
                expect(ownerId).toMatch(REGEX_OWNER_ID_ANONYMOUS);
            });
        });
        describe('setOwnerId', () => {
            it('Should set an ownerId', () => {
                const accountService = createAccountService(SESSION_WITHOUT_OWNER);
                accountService.setOwnerId(OWNER_ID);
                const ownerId = accountService.getOwnerId();
                expect(ownerId).toMatch(REGEX_OWNER_ID_ASSIGNED);
            });
        });
    });
    describe('session populated with ownerId', () => {
        describe('getOwnerId', () => {
            it('Should retrieve a URN', () => {
                const accountService = createAccountService(SESSION_WITH_OWNER);
                const ownerId = accountService.getOwnerId();
                expect(ownerId).toMatch(REGEX_OWNER_ID_ASSIGNED);
            });
        });
        describe('setOwnerId', () => {
            it('Should set an ownerId', () => {
                const accountService = createAccountService(SESSION_WITH_OWNER);
                accountService.setOwnerId('mynewownerid');
                const ownerId = accountService.getOwnerId();
                expect(ownerId).toMatch('mynewownerid');
            });
        });
    });
    describe('isAuthenticated', () => {
        it('Should return authenticated state', () => {
            const accountService = createAccountService(SESSION_WITH_OWNER);
            const isAuthenticated = accountService.isAuthenticated(
                REQUEST_WITH_IS_AUTHENTICATED_TRUE
            );
            expect(isAuthenticated).toBe(true);
        });
    });
});
