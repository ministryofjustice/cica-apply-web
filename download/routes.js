'use strict';

const express = require('express');

const moment = require('moment-timezone');
const downloadHelper = require('./download-helper');
const qService = require('../questionnaire/questionnaire-service')();
const isQuestionnaireInstantiated = require('../questionnaire/utils/isQuestionnaireInstantiated');

const router = express.Router();

router.route('/application-summary').get(async (req, res, next) => {
    try {
        const questionnaireId = isQuestionnaireInstantiated(req.session);
        if (!questionnaireId) {
            return res.redirect('/apply');
        }
        const response = await qService.getSection(questionnaireId, 'p--check-your-answers');
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
