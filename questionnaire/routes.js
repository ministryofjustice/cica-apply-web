'use strict';

const express = require('express');
const moment = require('moment-timezone');
const formHelper = require('./form-helper');
const qService = require('./questionnaire-service')();
const downloadHelper = require('./download-helper');

const router = express.Router();

router.route('/').get(async (req, res, next) => {
    try {
        const response = await qService.getFirstSection(req.cicaSession.questionnaireId);
        const responseBody = response.body;
        const initialSection = formHelper.removeSectionIdPrefix(
            responseBody.data[0].attributes.sectionId
        );
        res.redirect(`${req.baseUrl}/${initialSection}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.route('/download-summary').get(async (req, res, next) => {
    try {
        const response = await qService.getSection(
            req.cicaSession.questionnaireId,
            'p--check-your-answers'
        );
        const timestamp = moment().tz('Europe/London');
        const draftSummaryHtml = downloadHelper.getSummaryHtml(response.body, timestamp);
        const filename = `Draft_application_summary_${timestamp.format(
            'YYYY-MM-DD-HH-MM-SS-SSS'
        )}.html`;
        // add timestamp to filename in the correct format
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.type('.html');
        return res.send(draftSummaryHtml);
    } catch (err) {
        // is this the correct error code for a failure here?
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.route('/previous/:section').get(async (req, res, next) => {
    try {
        const sectionId = formHelper.addPrefix(req.params.section);
        const response = await qService.getPrevious(req.cicaSession.questionnaireId, sectionId);
        if (response.body.data[0].attributes && response.body.data[0].attributes.url !== null) {
            const overwriteId = response.body.data[0].attributes.url;
            return res.redirect(overwriteId);
        }
        const previousSectionId = formHelper.removeSectionIdPrefix(
            response.body.data[0].attributes.sectionId
        );
        return res.redirect(`${req.baseUrl}/${previousSectionId}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router
    .route('/:section')
    .get(async (req, res, next) => {
        try {
            const sectionId = formHelper.addPrefix(req.params.section);
            const response = await qService.getSection(req.cicaSession.questionnaireId, sectionId);
            if (
                response.body.data &&
                response.body.data[0].attributes &&
                response.body.data[0].attributes.sectionId
            ) {
                const isSummaryPage =
                    formHelper.getSectionContext(response.body.data[0].attributes.sectionId) ===
                    'summary';

                if (isSummaryPage) {
                    res.set({
                        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                        Expires: '-1',
                        Pragma: 'no-cache'
                    });
                }
            }
            const html = formHelper.getSectionHtml(
                response.body,
                req.csrfToken(),
                res.locals.nonce
            );
            if (formHelper.getSectionContext(sectionId) === 'confirmation') {
                req.cicaSession.reset();
            }
            res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const sectionId = formHelper.addPrefix(req.params.section);
            const body = formHelper.processRequest(req.body, req.params.section);
            let nextSectionId;
            // delete the token from the body to allow AJV to validate the request.
            // eslint-disable-next-line no-underscore-dangle
            delete body._csrf;
            const response = await qService.postSection(
                req.cicaSession.questionnaireId,
                sectionId,
                body
            );
            if (response.statusCode === 201) {
                // if the page is a submission
                const isApplicationSubmission =
                    formHelper.getSectionContext(sectionId) === 'submission';
                if (isApplicationSubmission) {
                    try {
                        await qService.postSubmission(req.cicaSession.questionnaireId);
                        const submissionResponse = await qService.getSubmissionStatus(
                            req.cicaSession.questionnaireId,
                            Date.now()
                        );

                        if (submissionResponse.status === 'FAILED') {
                            const err = Error(`Unable to retrieve questionnaire submission status`);
                            err.name = 'CRNNotRetrieved';
                            err.statusCode = 500;
                            err.error = '500 Internal Server Error';
                            throw err;
                        }
                    } catch (err) {
                        return next(err);
                    }
                }

                if ('next' in req.query) {
                    const progressEntryResponse = await qService.getSection(
                        req.cicaSession.questionnaireId,
                        formHelper.addPrefix(req.query.next)
                    );

                    if (progressEntryResponse.statusCode === 200) {
                        nextSectionId = formHelper.removeSectionIdPrefix(
                            progressEntryResponse.body.data[0].attributes.sectionId
                        );
                        return res.redirect(`${req.baseUrl}/${nextSectionId}`);
                    }
                }

                const progressEntryResponse = await qService.getCurrentSection(
                    req.cicaSession.questionnaireId
                );
                nextSectionId = formHelper.removeSectionIdPrefix(
                    progressEntryResponse.body.data[0].attributes.sectionId
                );

                return res.redirect(`${req.baseUrl}/${nextSectionId}`);
            }

            const html = formHelper.getSectionHtmlWithErrors(
                response.body,
                sectionId,
                req.csrfToken(),
                res.locals.nonce
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            return next(err);
        }
    });

module.exports = router;
