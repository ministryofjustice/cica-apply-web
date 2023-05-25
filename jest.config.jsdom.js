'use strict';

const config = {
    testRegex: '.*\\.test\\.jsdom\\.js$',
    setupFilesAfterEnv: ['./jest.setup.js']
};

module.exports = config;
