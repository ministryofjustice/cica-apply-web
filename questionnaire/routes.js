'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const formHelper = require('./form-helper');
const qService = require('./questionnaire-service')();
const getFormSubmitButtonText = require('./utils/getFormSubmitButtonText');
const isQuestionnaireInstantiated = require('./utils/isQuestionnaireInstantiated');
const isAuthenticated = require('../account/utils/isAuthenticated');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        if (!isQuestionnaireInstantiated(req)) {
            return res.redirect('/apply/start-or-resume');
        }
        return res.redirect(`/apply/resume/${req.session.questionnaireId}`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router.route('/start-or-resume').get((req, res) => {
    try {
        res.render('start-or-resume.njk', {
            // csrfToken: req.csrfToken(),
            submitButtonText: getFormSubmitButtonText('start'),
            isAuthenticated: isAuthenticated(req)
        });
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router.post('/start-or-resume', (req, res) => {
    try {
        const startType = req.body['start-or-resume'];
        if (startType === 'resume') {
            return res.redirect('/apply/resume');
        }
        if (startType === 'start') {
            return res.redirect('/apply/start');
        }
        // return res.redirect('/start-or-resume');
        return res.render('start-or-resume.njk', {
            // csrfToken: req.csrfToken(),
            submitButtonText: getFormSubmitButtonText('start'),
            isAuthenticated: isAuthenticated(req),
            error: {
                text: 'Select what you would like to do'
            }
        });
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router.route('/resume').get(async (req, res) => {
    try {
        res.redirect('/account/sign-in');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router.route('/start').get(async (req, res) => {
    try {
        const response = await qService.createQuestionnaire({
            answers: {
                user: {
                    'user-id': req?.oidc?.user?.sub
                }
            }
        });
        const initialSection = formHelper.removeSectionIdPrefix(
            response.body.data.attributes.routes.initial
        );
        req.session.questionnaireId = response.body.data.attributes.id;
        res.redirect(`/apply/${initialSection}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});
router.get('/resume/:questionnaireId', requiresAuth(), async (req, res) => {
    try {
        const defaultRedirect = '/apply';
        let redirectUrl = defaultRedirect;

        const resumableQuestionnaireId = req.params.questionnaireId;
        const resumableQuestionnaireResponse = await qService.getCurrentSection(
            resumableQuestionnaireId
        );
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
        return res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router.route('/previous/:section').get(async (req, res) => {
    try {
        const sectionId = formHelper.addPrefix(req.params.section);
        const response = await qService.getPrevious(req.session.questionnaireId, sectionId);
        if (response.body.data[0].attributes && response.body.data[0].attributes.url !== null) {
            const overwriteId = response.body.data[0].attributes.url;
            return res.redirect(overwriteId);
        }
        const previousSectionId = formHelper.removeSectionIdPrefix(
            response.body.data[0].attributes.sectionId
        );
        return res.redirect(`${req.baseUrl}/${previousSectionId}`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
    }
});

router
    .route('/:section')
    .get(async (req, res, next) => {
        try {
            if (!isQuestionnaireInstantiated(req)) {
                return res.redirect('/apply/');
            }
            const sectionId = formHelper.addPrefix(req.params.section);
            const response = await qService.getSection(req.session.questionnaireId, sectionId);
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
                req.session.referrer = req.originalUrl;
            }
            const html = formHelper.getSectionHtml(
                response.body,
                undefined,
                // req.csrfToken(),
                res.locals.nonce,
                isAuthenticated(req)
            );
            if (formHelper.getSectionContext(sectionId) === 'confirmation') {
                req.session.reset();
            }
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk', {
                isAuthenticated: isAuthenticated(req)
            });
            return next(err);
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
                req.session.questionnaireId,
                sectionId,
                body
            );
            if (response.statusCode === 201) {
                // if the page is a submission
                const isApplicationSubmission =
                    formHelper.getSectionContext(sectionId) === 'submission';
                if (isApplicationSubmission) {
                    try {
                        await qService.postSubmission(req.session.questionnaireId);
                        const submissionResponse = await qService.getSubmissionStatus(
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
                    const progressEntryResponse = await qService.getSection(
                        req.session.questionnaireId,
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
                    req.session.questionnaireId
                );
                nextSectionId = formHelper.removeSectionIdPrefix(
                    progressEntryResponse.body.data[0].attributes.sectionId
                );

                return res.redirect(`${req.baseUrl}/${nextSectionId}`);
            }
            const html = formHelper.getSectionHtmlWithErrors(
                response.body,
                sectionId,
                undefined,
                // req.csrfToken(),
                res.locals.nonce,
                isAuthenticated(req)
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk', {
                isAuthenticated: isAuthenticated(req)
            });
            return next(err);
        }
    });

module.exports = router;
