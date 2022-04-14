'use strict';

const express = require('express');

const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');

const formHelper = require('./form-helper');
const qService = require('./questionnaire-service')();

const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const uploader = multer({
    dest: 'uploads/'
});

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

router.route('/submission/confirm').post(async (req, res, next) => {
    try {
        await qService.postSubmission(req.cicaSession.questionnaireId);
        const response = await qService.getSubmissionStatus(
            req.cicaSession.questionnaireId,
            Date.now()
        );

        if (response.status === 'FAILED') {
            const err = Error(`Unable to retrieve questionnaire submission status`);
            err.name = 'CRNNotRetrieved';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }

        const resp = await qService.getCurrentSection(req.cicaSession.questionnaireId);
        const responseBody = resp.body;
        const nextSection = formHelper.removeSectionIdPrefix(
            responseBody.data[0].attributes.sectionId
        );
        return res.redirect(`${req.baseUrl}/${nextSection}`);
    } catch (err) {
        return next(err);
    }
});

router
    .route('/upload/document')
    .post(uploader.single('q-applicant-upload-example'), async (req, res, next) => {
        try {
            console.log(`1::: HERE`);
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: req.file.originalname,
                Body: fs.createReadStream(req.file.path)
            };

            await s3Client.upload(uploadParams, err => {
                if (err) {
                    console.log(`ERROR::: ${err}`);
                    const error = Error(`Unable to upload document: ${err}`);
                    error.name = 'UploadFailed';
                    error.statusCode = 500;
                    error.error = '500 Internal Server Error';
                    throw error;
                }
                console.log(`2::: HERE`);
            });

            const progressEntryResponse = await qService.getCurrentSection(
                req.cicaSession.questionnaireId
            );
            console.log(`3::: ${progressEntryResponse}`);
            const nextSectionId = formHelper.removeSectionIdPrefix(
                progressEntryResponse.body.data[0].attributes.sectionId
            );
            console.log(`4::: ${nextSectionId}`);
            return res.redirect(`${req.baseUrl}/${nextSectionId}`);
        } catch (err) {
            return next(err);
        }
    });

module.exports = router;
