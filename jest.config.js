/*! m0-start */

'use strict';

const config = {
    testEnvironment: 'node'
};
/*! m0-end */

config.setupFilesAfterEnv = ['./jest.setup.js'];

config.coverageThreshold = {
    './**/!(autocomplete).js': {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60
    },
    './src/modules/autocomplete/autocomplete.js': {
        branches: 20,
        functions: 20,
        lines: 20,
        statements: 20
    }
};

/*! m0-start */
module.exports = config;
/*! m0-end */
