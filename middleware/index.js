const express = require('express');

const app = express();

const cookieParser = require('cookie-parser');
const bodyParser = require('./body-parser');
const sessionsMiddleware = require('./sessions');
const csrfMiddleware = require('./csrf');

app.use(bodyParser);
app.use(sessionsMiddleware);
app.use(cookieParser());
app.use(csrfMiddleware);

module.exports = app;
