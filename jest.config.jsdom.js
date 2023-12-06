'use strict';

const config = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./jest.setup.js', './jest.setup.jsdom.js'],
    coveragePathIgnorePatterns: ['.*vendor.*\\.js$'],
    testRegex: '.*\\.test\\.jsdom\\.js$'
};

module.exports = config;
