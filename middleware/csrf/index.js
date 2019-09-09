'use strict';

const express = require('express');

const app = express();

const csrf = require('csurf');

const csrfProtection = csrf({
    cookie: false,
    sessionKey: 'cicaSession'
});

app.use(csrfProtection);

module.exports = app;
