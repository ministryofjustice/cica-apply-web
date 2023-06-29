'use strict';

const express = require('express');
const formHelper = require('./form-helper');
const createQuestionnaireService = require('./questionnaire-service');
const getFormSubmitButtonText = require('./utils/getFormSubmitButtonText');
const getQuestionnaireIdInSession = require('./utils/getQuestionnaireIdInSession');
const createAccountService = require('../account/account-service');
const getRedirectionUrl = require('./utils/getRedirectionUrl');
const createTemplateEngineService = require('../templateEngine');

const router = express.Router();

router.route('/').get((req, res) => {
    try {
        const questionnaireId = getQuestionnaireIdInSession(req.session);
        if (questionnaireId) {
            return res.redirect(`/apply/resume/${questionnaireId}`);
        }
        return res.redirect('/apply/start-or-resume');
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router
    .route('/start-or-resume')
    .get((req, res) => {
        try {
            const templateEngineService = createTemplateEngineService();
            const accountService = createAccountService(req.session);
            const {render} = templateEngineService;
            const html = render('start-or-resume.njk', {
                submitButtonText: getFormSubmitButtonText('start'),
                csrfToken: req.csrfToken(),
                isAuthenticated: accountService.isAuthenticated(req)
            });
            return res.send(html);
        } catch (err) {
            return res.status(err.statusCode || 404).render('404.njk');
        }
    })
    .post((req, res) => {
        try {
            const templateEngineService = createTemplateEngineService();
            const accountService = createAccountService(req.session);
            const {render} = templateEngineService;
            const startType = req.body['start-or-resume'];
            const redirectionUrl = getRedirectionUrl(
                startType,
                getQuestionnaireIdInSession(req.session)
            );

            if (redirectionUrl) {
                return res.redirect(redirectionUrl);
            }

            const html = render('start-or-resume.njk', {
                submitButtonText: getFormSubmitButtonText('start'),
                csrfToken: req.csrfToken(),
                error: {
                    text: 'Select what you would like to do'
                },
                isAuthenticated: accountService.isAuthenticated(req)
            });
            return res.send(html);
        } catch (err) {
            return res.status(err.statusCode || 404).render('404.njk');
        }
    });

router.route('/start').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
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

router.route('/resume/:questionnaireId').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });

        const defaultRedirect = '/apply';
        let redirectUrl = defaultRedirect;

        const resumableQuestionnaireId = req.params.questionnaireId;
        const resumableQuestionnaireResponse = await questionnaireService.getCurrentSection(
            resumableQuestionnaireId
        );

        if (resumableQuestionnaireResponse.body?.errors) {
            const errorResponse = resumableQuestionnaireResponse.body?.errors[0];
            if (errorResponse.status === 404) {
                return res.redirect(redirectUrl);
            }
        }

        const resumableQuestionnaireCurrentSectionId =
            resumableQuestionnaireResponse.body?.data?.[0]?.relationships?.section?.data?.id;

        // switch session info and redirect if valid.
        if (resumableQuestionnaireCurrentSectionId) {
            req.session.questionnaireId = resumableQuestionnaireId;
            redirectUrl = `${redirectUrl}/${formHelper.removeSectionIdPrefix(
                resumableQuestionnaireCurrentSectionId
            )}`;
        }
        return res.redirect(redirectUrl);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
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
            const isAuthenticated = accountService.isAuthenticated(req);
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId(),
                isAuthenticated
            });
            const sectionId = formHelper.addPrefix(req.params.section);
            const response = await questionnaireService.getSection(
                req.session.questionnaireId,
                sectionId
            );

            req.session.referrer = req.originalUrl;

            const html = formHelper.getSectionHtml(
                response.body,
                req.csrfToken(),
                res.locals.nonce,
                isAuthenticated
            );
            if (formHelper.getSectionContext(sectionId) === 'confirmation') {
                delete req.session.questionnaireId;
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
            const isAuthenticated = accountService.isAuthenticated(req);
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId(),
                isAuthenticated
            });
            const sectionId = formHelper.addPrefix(req.params.section);
            const body = formHelper.processRequest(req.body, req.params.section);
            let nextSectionId;
            // delete the token from the body to allow AJV to validate the request.
            // eslint-disable-next-line no-underscore-dangle
            delete body._csrf;
            const response = await questionnaireService.postSection(
                getQuestionnaireIdInSession(req.session),
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
                        getQuestionnaireIdInSession(req.session),
                        formHelper.addPrefix(req.query.next)
                    );
                    console.log(progressEntryResponse);
                    if (progressEntryResponse.statusCode === 200) {
                        nextSectionId = formHelper.removeSectionIdPrefix(
                            progressEntryResponse.body.data[0].attributes.sectionId
                        );
                        return res.redirect(`${req.baseUrl}/${nextSectionId}`);
                    }
                }

                const progressEntryResponse = await questionnaireService.getCurrentSection(
                    getQuestionnaireIdInSession(req.session)
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
                res.locals.nonce,
                isAuthenticated
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            return next(err);
        }
    });

module.exports = router;
