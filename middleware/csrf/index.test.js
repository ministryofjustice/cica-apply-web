/* eslint-disable global-require */

'use strict';

jest.mock('csrf-csrf', () => ({
    doubleCsrf: jest.fn(() => ({
        doubleCsrfProtection: jest.fn(),
        generateToken: jest.fn()
    }))
}));

describe('csrf module', () => {
    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it('calls doubleCsrf with correct config in production', () => {
        process.env.NODE_ENV = 'production';
        process.env.CW_COOKIE_SECRET = 'prod-secret';

        const {doubleCsrf} = require('csrf-csrf');

        jest.isolateModules(() => {
            require('./index');
        });

        expect(doubleCsrf).toHaveBeenCalledTimes(1);

        expect(doubleCsrf).toHaveBeenCalledWith({
            getSecret: expect.any(Function),
            getTokenFromRequest: expect.any(Function),
            cookieName: '__Host-request-config',
            cookieOptions: {
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: 'Lax'
            }
        });
    });

    it('calls doubleCsrf with correct config in development', () => {
        process.env.NODE_ENV = 'development';
        process.env.CW_COOKIE_SECRET = 'dev-secret';
        const {doubleCsrf} = require('csrf-csrf');

        jest.isolateModules(() => {
            require('./index');
        });

        expect(doubleCsrf).toHaveBeenCalledTimes(1);

        expect(doubleCsrf).toHaveBeenCalledWith({
            getSecret: expect.any(Function),
            getTokenFromRequest: expect.any(Function),
            cookieName: 'request-config',
            cookieOptions: {
                path: '/',
                secure: false,
                httpOnly: true,
                sameSite: 'Lax'
            }
        });
    });
});
