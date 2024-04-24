'use strict';

process.env.CW_INTERNAL_IP = '1.0.0.0';

const config = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.js'],
    coveragePathIgnorePatterns: ['./account/routes.js', './questionnaire/task-list/routes.js'],
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
