'use strict';

const express = require('express');

const csrf = require('csurf');

const csrfProtection = csrf({
    cookie: false,
    sessionKey: 'cicaSession'
});

const app = express();
app.use(csrfProtection);

// error handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        const error = Error(`Your session has expired`);
        error.name = 'EBADCSRFTOKEN';
        error.statusCode = 403;
        error.error = '403 Forbidden';
        throw error;
    }
    return next(err);
});

module.exports = app;
