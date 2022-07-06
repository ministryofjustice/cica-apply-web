'use strict';

const express = require('express');

const moment = require('moment-timezone');
const downloadHelper = require('./download-helper');
const qService = require('../questionnaire/questionnaire-service')();

exports.qService = qService;

const router = express.Router();
exports.router = router;

router.route('/application-summary').get(async (req, res, next) => {
    try {
        const response = await qService.getSection(
            req.cicaSession.questionnaireId,
            'p--check-your-answers'
        );
        const timestamp = moment().tz('Europe/London');
        const applicationSummaryHtml = downloadHelper.getSummaryHtml(response.body, timestamp);
        // add timestamp to filename in the correct format
        const filename = `Draft_application_summary_${timestamp.format(
            'YYYY-MM-DD-HH-mm-ss-SSS'
        )}.html`;

        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.type('.html');
        return res.send(applicationSummaryHtml);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
