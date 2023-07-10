'use strict';

const config = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ['./account/routes.js'],
    coverageThreshold: {
        './**/*.js': {
            branches: 60,
            functions: 60,
            lines: 60,
            statements: 60
        }
    }
};

module.exports = config;
