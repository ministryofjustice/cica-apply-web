'use strict';

const express = require('express');

const csrf = require('csurf');

const csrfProtection = csrf({
    cookie: false,
    sessionKey: 'cicaSession'
});

const app = express();

app.use(csrfProtection);

// TODO: move to centralised error handling middleware
// // error handler
// app.use((err, req, res, next) => {
//     if (err.code === 'EBADCSRFTOKEN') {
//         const error = Error(`Your session has expired`);
//         error.name = 'EBADCSRFTOKEN';
//         error.error = 'Your session has expired';
//         throw error;
//     }
//     return next(err);
// });

module.exports = app;
