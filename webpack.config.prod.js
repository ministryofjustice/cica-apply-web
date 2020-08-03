'use strict';

const config = require('./webpack.config');

delete config.devtool;

module.exports = config;
