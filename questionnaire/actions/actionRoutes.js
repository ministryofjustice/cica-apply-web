'use strict';

const express = require('express');
const crypto = require('crypto');
const formHelper = require('../form-helper');
const createQuestionnaireService = require('../questionnaire-service');
const getQuestionnaireIdInSession = require('../utils/getQuestionnaireIdInSession');
const createAccountService = require('../../account/account-service');
const getOwnerOrigin = require('../utils/getOwnerOrigin');

const router = express.Router();

router.get('/', (req, res) => {
    return res.status(404).render('404.njk');
});

router.get('/:action', (req, res) => {
    try {
        return res.redirect(`/${req.params.action}/start`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

// TODO: delete this route before release; not needed, just using for testing
router.route('/:action/start').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const isAuthenticated = accountService.isAuthenticated(req);
        const origin = getOwnerOrigin(req, isAuthenticated);
        const analyticsId = `urn:uuid:${crypto.randomUUID()}`;
        const actionId = req.params.action;

        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated,
            templateName: actionId,
            origin,
            analyticsId
        });
        const response = await questionnaireService.createQuestionnaire();
        const initialSection = formHelper.removeSectionIdPrefix(
            response.body.data.attributes.routes.initial
        );
        req.session.questionnaireId = response.body.data.attributes.id;
        req.session.analyticsId = analyticsId;

        res.redirect(`/actions/${actionId}/${initialSection}?utm_source=${origin}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

router.get('/:action/resume/:questionnaireId', async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        let resumableQuestionnaireAnalyticsId;

        const actionId = req.params.action;
        const defaultRedirect = `actions/${actionId}`;
        let redirectUrl = defaultRedirect;

        const resumableQuestionnaireId = req.params.questionnaireId;
        const resumableQuestionnaireResponse = await questionnaireService.getCurrentSection(
            resumableQuestionnaireId
        );

        if ('a_id' in req.query) {
            resumableQuestionnaireAnalyticsId = req.query.a_id;
        }

        const resumableQuestionnaireProgressEntry =
            resumableQuestionnaireResponse?.body?.data?.[0]?.attributes;
        if (
            resumableQuestionnaireProgressEntry &&
            resumableQuestionnaireProgressEntry.sectionId === null &&
            resumableQuestionnaireProgressEntry.url === null
        ) {
            return res.render('incompatible.njk', {
                isAuthenticated: accountService.isAuthenticated(req)
            });
        }

        if (resumableQuestionnaireResponse.body?.errors) {
            const errorResponse = resumableQuestionnaireResponse.body?.errors[0];
            if (errorResponse.status === 404) {
                // TODO: what do we want to happen in this scenario?
                return res.status(errorResponse.statusCode).render('404.njk');
            }
        }

        const resumableQuestionnaireCurrentSectionId =
            resumableQuestionnaireResponse.body?.data?.[0]?.relationships?.section?.data?.id;

        // switch session info and redirect if valid.
        if (resumableQuestionnaireCurrentSectionId) {
            req.session.questionnaireId = resumableQuestionnaireId;
            req.session.analyticsId = resumableQuestionnaireAnalyticsId;
            redirectUrl = `${redirectUrl}/${formHelper.removeSectionIdPrefix(
                resumableQuestionnaireCurrentSectionId
            )}`;
        }
        return res.redirect(redirectUrl);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router.route('/:action/previous/:section').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const actionId = req.params.action;
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            templateName: actionId,
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const sectionId = formHelper.addPrefix(req.params.section);
        const response = await questionnaireService.getPrevious(
            req.session.questionnaireId,
            sectionId
        );

        const progressEntry = response?.body?.data?.[0]?.attributes;

        if (progressEntry && progressEntry.url !== null) {
            const overwriteId = progressEntry.url;
            return res.redirect(overwriteId);
        }
        if (progressEntry && progressEntry.sectionId === null && progressEntry.url === null) {
            return res.render('incompatible.njk', {
                isAuthenticated: accountService.isAuthenticated(req)
            });
        }
        const previousSectionId = formHelper.removeSectionIdPrefix(progressEntry.sectionId);
        return res.redirect(`${req.baseUrl}/${actionId}/${previousSectionId}`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

router
    .route('/:action/:section')
    .get(async (req, res, next) => {
        try {
            const accountService = createAccountService(req.session);
            const isAuthenticated = accountService.isAuthenticated(req);
            const actionId = req.params.action;
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId(),
                templateName: actionId,
                isAuthenticated
            });
            const sectionId = formHelper.addPrefix(req.params.section);
            const response = await questionnaireService.getSection(
                req.session.questionnaireId,
                sectionId
            );

            const progressEntry = response?.body?.data?.[0]?.attributes;
            if (progressEntry && progressEntry.sectionId === null && progressEntry.url === null) {
                return res.render('incompatible.njk', {
                    isAuthenticated: accountService.isAuthenticated(req)
                });
            }

            req.session.referrer = req.originalUrl;

            const html = formHelper.getSectionHtml(
                response.body,
                req.csrfToken(),
                res.locals.cspNonce,
                isAuthenticated,
                accountService.getOwnerId(),
                req.session.analyticsId,
                `actions/${actionId}`
            );
            if (formHelper.getSectionContext(sectionId) === 'confirmation') {
                delete req.session.questionnaireId;
                delete req.session.analyticsId;
            }
            return res.send(html);
        } catch (err) {
            const pageNotFoundErr = new Error(err.message);
            pageNotFoundErr.name = 'PageNotFound';
            pageNotFoundErr.stack = err.stack;
            return next(pageNotFoundErr);
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
            const actionId = req.params.action;
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
                    formHelper.getSectionContext(sectionId) === 'submission' ||
                    response.body.submission === true;
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

                    if (progressEntryResponse.statusCode === 200) {
                        nextSectionId = formHelper.removeSectionIdPrefix(
                            progressEntryResponse.body.data[0].attributes.sectionId
                        );
                        return res.redirect(`${req.baseUrl}/${actionId}/${nextSectionId}`);
                    }
                }

                const progressEntryResponse = await questionnaireService.getCurrentSection(
                    getQuestionnaireIdInSession(req.session)
                );
                nextSectionId = formHelper.removeSectionIdPrefix(
                    progressEntryResponse.body.data[0].attributes.sectionId
                );

                return res.redirect(`${req.baseUrl}/${actionId}/${nextSectionId}`);
            }

            const html = formHelper.getSectionHtmlWithErrors(
                response.body,
                sectionId,
                req.csrfToken(),
                res.locals.cspNonce,
                isAuthenticated,
                accountService.getOwnerId(),
                req.session.analyticsId,
                `actions/${actionId}`
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            return next(err);
        }
    });

module.exports = router;
