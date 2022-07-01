'use strict';

const moment = require('moment-timezone');
const downloadHelper = require('../questionnaire/download-helper');

const sectionData = require('./test-fixtures/downloads/check-your-answers-section');
const expectedSummaryHtml = require('./test-fixtures/downloads/expected-summary-html');

// Remove indentation from strings when comparing them
// Remove indentation from strings when comparing them
function removeIndentation(val) {
    const regex = /^\s+/gm;

    if (val && typeof val === 'object' && !Array.isArray(val)) {
        return JSON.parse(
            JSON.stringify(val, (key, value) => {
                if (typeof value === 'string') {
                    return value.replace(regex, '');
                }

                return value;
            })
        );
    }

    return val.replace(regex, '');
}

describe('download-helper functions', () => {
    describe('Should render Nunjucks', () => {
        it('Should render application summary nujunks from valid summary', () => {
            const timestamp = moment('2022-01-01 17:15');
            const summaryHtml = downloadHelper.getSummaryHtml(sectionData, timestamp);
            // const transformationContent = {};
            expect(removeIndentation(expectedSummaryHtml.html)).toEqual(
                removeIndentation(summaryHtml)
            );
        });
    });
});
