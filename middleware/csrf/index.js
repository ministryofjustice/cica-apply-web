const express = require('express');
const csrf = require('csurf');

// cookie name is session, whic is the same as the
// client session cookie name that is in use.
const csrfProtection = csrf({key: 'session'});

const app = express();

app.use(csrfProtection);
app.use((req, res, next) => {
    // ading this to the session automatically creates a cookie on the client.
    // this is due to the 'sessions' middleware.
    req.session.CSRFTOKEN = req.csrfToken();
    next();
});

// error handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        const error = Error(`Your session has expired`);
        error.name = 'EBADCSRFTOKEN';
        error.error = 'Your session has expired';
        throw error;
    }
    return next(err);
});

module.exports = app;
