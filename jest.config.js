'use strict';

const config = {
    testEnvironment: 'node'
};
/*! m0-end */

config.setupFilesAfterEnv = ['./jest.setup.js'];

config.coverageThreshold = {
    './!(account)/*.js': {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
    }
};

module.exports = config;
