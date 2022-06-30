'use strict';

const moment = require('moment-timezone');
const downloadHelper = require('../questionnaire/download-helper');

const sectionData = require('./test-fixtures/downloads/check-your-answers-section');
const expectedSummaryHtml = require('./test-fixtures/downloads/expected-summary-html');

describe('download-helper functions', () => {
    describe('Should render Nunjucks', () => {
        it('Should render application summary nujunks from valid summary', () => {
            const timestamp = moment('2022-01-01 17:15');
            const summaryHtml = downloadHelper.getSummaryHtml(sectionData, timestamp);
            // const transformationContent = {};
            expect(expectedSummaryHtml.html).toEqual(summaryHtml);
        });
    });
});
