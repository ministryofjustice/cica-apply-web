'use strict';

const express = require('express');

const app = express();

const clientSessions = require('./client-sessions');

const csrf = require('./csrf');

// certralised middleware calls.
// grouping them here as it de-clutters the app.js file.
// and these can be run in succession, so they are here together.
app.use(clientSessions);
app.use(csrf);

module.exports = app;
