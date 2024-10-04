'use strict';

const express = require('express');

const moment = require('moment-timezone');
const downloadHelper = require('./download-helper');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const createAccountService = require('../account/account-service');
const getQuestionnaireIdInSession = require('../questionnaire/utils/getQuestionnaireIdInSession');

const router = express.Router();

router.route('/application-summary').get(async (req, res, next) => {
    try {
        const questionnaireId = getQuestionnaireIdInSession(req.session);
        if (!questionnaireId) {
            return res.redirect('/apply');
        }
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const response = await questionnaireService.getSection(
            questionnaireId,
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

router.route('/:sectionId').get(async (req, res, next) => {
    try {
        const questionnaireId = getQuestionnaireIdInSession(req.session);
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const response = await questionnaireService.getSection(
            questionnaireId,
            `p-${req.params.sectionId}`
        );
        const timestamp = moment().tz('Europe/London');
        const pageHtml = downloadHelper.getPageHtml(response.body, timestamp);
        // add timestamp to filename in the correct format
        const filename = `${req.params.sectionId}.html`;

        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.type('.html');
        return res.send(pageHtml);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
