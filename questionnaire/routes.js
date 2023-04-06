'use strict';

const express = require('express');
const formHelper = require('./form-helper');
const createQuestionnaireService = require('./questionnaire-service');
const getFormSubmitButtonText = require('./utils/getFormSubmitButtonText');
const isQuestionnaireInstantiated = require('./utils/isQuestionnaireInstantiated');
const createAccountService = require('../account/account-service');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const questionnaireId = isQuestionnaireInstantiated(req.session);
        if (questionnaireId) {
            return res.redirect(`/apply/resume/${questionnaireId}`);
        }
        return res.redirect('/apply/start-or-resume');
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router.route('/start-or-resume').get((req, res) => {
    try {
        return res.render('start-or-resume.njk', {
            submitButtonText: getFormSubmitButtonText('start'),
            csrfToken: req.csrfToken()
        });
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router.post('/start-or-resume', (req, res) => {
    try {
        const startType = req.body['start-or-resume'];
        if (startType === 'start') {
            return res.redirect('/apply/start');
        }

        return res.render('start-or-resume.njk', {
            submitButtonText: getFormSubmitButtonText('start'),
            csrfToken: req.csrfToken(),
            error: {
                text: 'Select what you would like to do'
            }
        });
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router.route('/start').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        accountService.generateOwnerId();
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const response = await questionnaireService.createQuestionnaire();
        const initialSection = formHelper.removeSectionIdPrefix(
            response.body.data.attributes.routes.initial
        );
        req.session.questionnaireId = response.body.data.attributes.id;

        res.redirect(`/apply/${initialSection}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

router.route('/previous/:section').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const sectionId = formHelper.addPrefix(req.params.section);
        const response = await questionnaireService.getPrevious(
            req.session.questionnaireId,
            sectionId
        );
        if (response.body.data[0].attributes && response.body.data[0].attributes.url !== null) {
            const overwriteId = response.body.data[0].attributes.url;
            return res.redirect(overwriteId);
        }
        const previousSectionId = formHelper.removeSectionIdPrefix(
            response.body.data[0].attributes.sectionId
        );
        return res.redirect(`${req.baseUrl}/${previousSectionId}`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router
    .route('/:section')
    .get(async (req, res, next) => {
        try {
            const accountService = createAccountService(req.session);
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId(),
                isAuthenticated: accountService.isAuthenticated(req)
            });
            const sectionId = formHelper.addPrefix(req.params.section);
            const response = await questionnaireService.getSection(
                req.session.questionnaireId,
                sectionId
            );
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
                req.session.reset();
            }
            res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const accountService = createAccountService(req.session);
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId(),
                isAuthenticated: accountService.isAuthenticated(req)
            });
            const sectionId = formHelper.addPrefix(req.params.section);
            const body = formHelper.processRequest(req.body, req.params.section);
            let nextSectionId;
            // delete the token from the body to allow AJV to validate the request.
            // eslint-disable-next-line no-underscore-dangle
            delete body._csrf;
            const response = await questionnaireService.postSection(
                isQuestionnaireInstantiated(req.session),
                sectionId,
                body
            );

            if (response.statusCode === 201) {
                // if the page is a submission
                const isApplicationSubmission =
                    formHelper.getSectionContext(sectionId) === 'submission';
                if (isApplicationSubmission) {
                    try {
                        await questionnaireService.postSubmission(req.session.questionnaireId);
                        const submissionResponse = await questionnaireService.getSubmissionStatus(
                            req.session.questionnaireId,
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
                    const progressEntryResponse = await questionnaireService.getSection(
                        isQuestionnaireInstantiated(req.session),
                        formHelper.addPrefix(req.query.next)
                    );

                    if (progressEntryResponse.statusCode === 200) {
                        nextSectionId = formHelper.removeSectionIdPrefix(
                            progressEntryResponse.body.data[0].attributes.sectionId
                        );
                        return res.redirect(`${req.baseUrl}/${nextSectionId}`);
                    }
                }

                const progressEntryResponse = await questionnaireService.getCurrentSection(
                    isQuestionnaireInstantiated(req.session)
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
