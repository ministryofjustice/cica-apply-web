'use strict';

const config = require('./webpack.config');

config.mode = 'production';
delete config.devtool;

module.exports = config;
