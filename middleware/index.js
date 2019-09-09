'use strict';

const express = require('express');

const app = express();

const csrf = require('./csrf');

app.use(csrf);

module.exports = app;
