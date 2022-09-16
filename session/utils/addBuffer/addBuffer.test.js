'use strict';

const addBuffer = require('.');

const INITIAL_DURATION = 120000; // 2 minutes.
const EXPECTED_BUFFER_VALUE = 30000; // 30 seconds.
const CUSTOM_BUFFER_VALUE = 12345;

describe('addBuffer', () => {
    it('Should subtract the default amount from the passed-in value', () => {
        const result = addBuffer(INITIAL_DURATION);
        expect(result).toBe(INITIAL_DURATION - EXPECTED_BUFFER_VALUE);
    });

    it('Should subtract a given amount from the passed-in value', () => {
        const result = addBuffer(INITIAL_DURATION, CUSTOM_BUFFER_VALUE);
        expect(result).toBe(INITIAL_DURATION - CUSTOM_BUFFER_VALUE);
    });
});
