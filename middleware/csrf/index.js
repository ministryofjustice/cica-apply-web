'use strict';

const {doubleCsrf} = require('csrf-csrf');

const csrf = doubleCsrf({
    getSecret: () => process.env.CW_COOKIE_SECRET,
    // eslint-disable-next-line no-underscore-dangle
    getTokenFromRequest: req => req.body._csrf,
    cookieName: process.env.NODE_ENV === 'production' ? '__Host-request-config' : 'request-config',
    cookieOptions: {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'Lax'
    }
});

module.exports = {
    doubleCsrfProtection: csrf.doubleCsrfProtection,
    generateToken: csrf.generateToken
};
