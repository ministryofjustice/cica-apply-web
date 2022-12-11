'use strict';

const config = {
    testEnvironment: 'node'
};

config.setupFilesAfterEnv = ['./jest.setup.js'];

config.coverageThreshold = {
    './**/*.js': {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
    }
};

module.exports = config;
