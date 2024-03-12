'use strict';

const moment = require('moment-timezone');
const downloadHelper = require('../download-helper');
const createTemplateEngineService = require('../../templateEngine');

const templateEngineService = createTemplateEngineService();
templateEngineService.init();

const sectionData = require('./fixtures/check-your-answers-section');
const expectedSummaryHtml = require('./fixtures/expected-summary-html');

describe('download-helper functions', () => {
    describe('Should render Nunjucks', () => {
        it('Should render application summary nujunks from valid summary', () => {
            const timestamp = moment('2022-01-01 17:15');
            const summaryHtml = downloadHelper.getSummaryHtml(sectionData, timestamp);
            // const transformationContent = {};
            expect(expectedSummaryHtml.html.replace(/[\n\r]/g, '').replace(/\s/g, '')).toEqual(
                summaryHtml.replace(/[\n\r]/g, '').replace(/\s/g, '')
            );
        });
    });
});
