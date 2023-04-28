'use strict';

const express = require('express');
const formHelper = require('./form-helper');
const createQuestionnaireService = require('./questionnaire-service');
const getFormSubmitButtonText = require('./utils/getFormSubmitButtonText');
const getQuestionnaireIdInSession = require('./utils/getQuestionnaireIdInSession');
const createAccountService = require('../account/account-service');
const getRedirectionUrl = require('./utils/getRedirectionUrl');

const router = express.Router();

router.get('/', (req, res) => {
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
        const redirectionUrl = getRedirectionUrl(
            startType,
            getQuestionnaireIdInSession(req.session)
        );

        if (redirectionUrl) {
            return res.redirect(redirectionUrl);
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

router.get('/resume/:questionnaireId', async (req, res) => {
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
                res.clearCookie('session');
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
                res.locals.nonce
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            return next(err);
        }
    });

module.exports = router;
