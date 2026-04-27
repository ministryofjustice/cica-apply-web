'use strict';

const express = require('express');
const crypto = require('crypto');
const formHelper = require('./form-helper');
const createQuestionnaireService = require('./questionnaire-service');
const getFormSubmitButtonText = require('./utils/getFormSubmitButtonText');
const getQuestionnaireIdInSession = require('./utils/getQuestionnaireIdInSession');
const createAccountService = require('../account/account-service');
const getRedirectionUrl = require('./utils/getRedirectionUrl');
const createTemplateEngineService = require('../templateEngine');
const getOwnerOrigin = require('./utils/getOwnerOrigin');
const isValidExternalId = require('./utils/isValidExternalId');
const getFeatureFlagsOptionsFromCookies = require('./utils/getFeatureFlagsOptions');

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const questionnaireId = getQuestionnaireIdInSession(req.session);
        if (questionnaireId) {
            if (req.session?.externalId) {
                return res.redirect(
                    `/apply/resume/${questionnaireId}?external_id=${req.session.externalId}`
                );
            }
            return res.redirect(`/apply/resume/${questionnaireId}`);
        }
        return res.redirect('/apply/start-or-resume');
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
    }
});

router.route('/start-or-resume').get((req, res) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('start-or-resume.njk', {
            csrfToken: res.locals.csrfToken,
            submitButtonText: getFormSubmitButtonText('start'),
            cspNonce: res.locals.cspNonce,
            sectionId: 'start-or-resume'
        });
        return res.send(html);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
    }
});

router.post('/start-or-resume', (req, res) => {
    try {
        const templateEngineService = createTemplateEngineService();
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
            csrfToken: res.locals.csrfToken,
            submitButtonText: getFormSubmitButtonText('start'),
            cspNonce: res.locals.cspNonce,
            error: {
                text: 'Select what you would like to do'
            }
        });
        return res.send(html);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
    }
});

router.route('/start').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const isAuthenticated = accountService.isAuthenticated(req);
        const origin = getOwnerOrigin(req, isAuthenticated);
        const externalId = `urn:uuid:${crypto.randomUUID()}`;
        const featureFlagsOptions = getFeatureFlagsOptionsFromCookies(req.cookies);

        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated,
            templateName: 'apply-for-compensation',
            origin,
            externalId,
            featureFlags: featureFlagsOptions
        });
        const response = await questionnaireService.createQuestionnaire();
        const initialSection = formHelper.removeSectionIdPrefix(
            response.body.data.attributes.routes.initial
        );
        req.session.questionnaireId = response.body.data.attributes.id;
        req.session.externalId = externalId;
        res.redirect(`/apply/${initialSection}?utm_source=${origin}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
    }
});

router.get('/resume/:questionnaireId', async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        let resumableQuestionnaireExternalId;

        const defaultRedirect = '/apply';
        let redirectUrl = defaultRedirect;

        const resumableQuestionnaireId = req.params.questionnaireId;
        const resumableQuestionnaireResponse = await questionnaireService.getCurrentSection(
            resumableQuestionnaireId
        );

        if ('external_id' in req.query && isValidExternalId(req.query.external_id)) {
            resumableQuestionnaireExternalId = req.query.external_id;
        }

        const resumableQuestionnaireProgressEntry =
            resumableQuestionnaireResponse?.body?.data?.[0]?.attributes;
        if (
            resumableQuestionnaireProgressEntry &&
            resumableQuestionnaireProgressEntry.sectionId === null &&
            resumableQuestionnaireProgressEntry.url === null
        ) {
            return res.render('incompatible.njk', {
                isAuthenticated: accountService.isAuthenticated(req),
                sectionId: 'incompatible'
            });
        }

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
            req.session.externalId = resumableQuestionnaireExternalId;
            let targetPage = formHelper.removeSectionIdPrefix(
                resumableQuestionnaireCurrentSectionId
            );
            if (req.query?.target) {
                targetPage = req.query.target;
            }
            redirectUrl = `${redirectUrl}/${targetPage}`;
        }
        return res.redirect(redirectUrl);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
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

        const progressEntry = response?.body?.data?.[0]?.attributes;

        if (progressEntry && progressEntry.url !== null) {
            const overwriteId = progressEntry.url;
            return res.redirect(overwriteId);
        }
        if (progressEntry && progressEntry.sectionId === null && progressEntry.url === null) {
            return res.render('incompatible.njk', {
                isAuthenticated: accountService.isAuthenticated(req),
                sectionId: 'incompatible'
            });
        }
        const previousSectionId = formHelper.removeSectionIdPrefix(progressEntry.sectionId);
        return res.redirect(`${req.baseUrl}/${previousSectionId}`);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
    }
});

//* *****************************************************************************************//
//                              DO NOT DEPLOY LIVE                                          //
//* *****************************************************************************************//
router.route('/secure-link').get(async (req, res) => {
    try {
        // Random ownerId
        const ownerId = `urn:uuid:${crypto.randomUUID()}`;

        const currentDate = new Date();

        const dateTime = currentDate.toISOString().split('T');
        const day = dateTime[0].split('-')[2];
        const time = dateTime[1]
            .split('.')[0]
            .split(':')
            .join('');
        const crn = `${day}\\${time}`;

        // Create new template
        const questionnaireService = createQuestionnaireService({
            ownerId,
            isAuthenticated: false,
            templateName: 'request-a-review',
            origin: 'web',
            externalId: `urn:uuid:${crypto.randomUUID()}`,
            featureFlags: {
                templateVersion: '1.0.0',
                bearerAuth: process.env.FEATURE_FLAGS_TOKEN
            },
            userData: {
                personalisation: {
                    'first-name': 'Sam',
                    'last-name': 'Smith',
                    date: '21 October 2025',
                    'short-reason': 'short summary of why',
                    'decision-reason':
                        'I was sorry to read that you were the victim of a violent crime and the impact this incident had on you. I have carefully considered your application for criminal injuries compensation. The amount of compensation that can be awarded and the rules I must apply are set out in the Criminal Injuries Compensation Scheme 2012 (the Scheme). The Scheme rules are approved by Parliament.</p><p class="govuk-body">The Scheme states that an award may be withheld or reduced if you have an unspent conviction at the date of your application for compensation or during the course of your application, depending on the seriousness of that conviction.</p><p class="govuk-body">Whether a conviction is spent or unspent will be assessed in accordance with the Rehabilitation of Offenders Act 1974 (as amended). This sets out the length of time after you have been convicted, that your conviction must still be considered by CICA and others.</p><p class="govuk-body">Where a person has an unspent conviction at the date of application which resulted in a sentence listed at paragraph 3 of Annex D, the Scheme provides CICA with no discretion and the application must be refused. This includes a community order.</p><p class="govuk-body">The evidence gathered in connection with your application shows that on 12 June 2025 you were sentenced to a community order. This conviction was unspent at the time you made your application for compensation, and I am therefore unable to make an award or a reduced award of compensation.</p><p class="govuk-body">I am also unable to make an award of compensation as your application was not received within the two-year time limit. Paragraph 87 of the Scheme states that an application must be sent by the applicant so that it is received by the Authority as soon as reasonably practicable after the incident giving rise to the criminal injury to which it relates, and in any event within two years after the date of that incident. Under paragraph 89 of the Scheme, the time limit can be extended where there are exceptional circumstances that prevented an application being made, and no further extensive enquiries are required.</p><p class="govuk-body">As your claim is not eligible due to your unspent conviction, I have not made further enquiries about the delay in your application and I am not going to extend the time limit to apply.</p><p class="govuk-body">I appreciate this will be disappointing news and not the decision you were hoping for. I must emphasise that this decision is not intended to diminish the seriousness of the circumstances which led you to apply or the impact the crime has had on you.</p><p class="govuk-body">Please note that in making my assessment I have considered the evidence available to me on this date only in so far as to determine, on the balance of probabilities, how the paragraph(s) of the Scheme set out in this letter affect your eligibility to receive an award. I have not made any decision in relation to any other paragraphs of the Scheme.</p>',
                    'decision-paragraphs':
                        'Under paragraph 26 of the Scheme "Annex D sets out the circumstances in which an award under this Scheme will be withheld or reduced because the applicant to whom an award would otherwise be made has unspent convictions.</p><p class="govuk-body">Under paragraph 87 of the Scheme "Subject to paragraph 88, an application must be sent by the applicant so that it is received by the Authority as soon as reasonably practicable after the incident giving rise to the criminal injury to which it relates, and in any event within two years after the date of that incident."',
                    'expiry-date': '31 December 2025',
                    'barcode-string': '1234567890',
                    'contact-method': 'email',
                    'email-address': 'test-email-address'
                },
                caseReference: crn
            }
        });
        const response = await questionnaireService.createQuestionnaire();

        // Display magic link
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.send(
            `${baseUrl}/account/login?qid=${response.body.data.attributes.id}&uid=${ownerId}&target=${crn}`
        );
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
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

            const progressEntry = response?.body?.data?.[0]?.attributes;
            if (progressEntry && progressEntry.sectionId === null && progressEntry.url === null) {
                return res.render('incompatible.njk', {
                    isAuthenticated: accountService.isAuthenticated(req),
                    sectionId: 'incompatible'
                });
            }

            req.session.referrer = req.originalUrl;

            const html = formHelper.getSectionHtml(
                response.body,
                res.locals.csrfToken,
                res.locals.cspNonce,
                isAuthenticated,
                req.session.externalId
            );
            if (formHelper.getSectionContext(sectionId) === 'confirmation') {
                delete req.session.questionnaireId;
                delete req.session.externalId;
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
            const currentSectionProgressResponse = await questionnaireService.getCurrentSection(
                getQuestionnaireIdInSession(req.session)
            );
            const uiOptions = currentSectionProgressResponse.body.included[0]?.attributes?.options;
            const sectionId = formHelper.addPrefix(req.params.section);
            const body = formHelper.processRequest(req.body, req.params.section, uiOptions);
            // eslint-disable-next-line no-underscore-dangle
            const pageExternalId = body['_external-id'];
            if (
                isAuthenticated &&
                pageExternalId !== undefined &&
                req.session?.externalId !== undefined &&
                pageExternalId !== req.session?.externalId
            ) {
                if (!isValidExternalId(pageExternalId)) {
                    console.info(
                        `Malformed page external id received for questionnaire "${getQuestionnaireIdInSession(
                            req.session
                        )}". Redirecting to dashboard.`
                    );
                } else {
                    console.info(
                        `Session external id "${
                            req.session?.externalId
                        }" does not match on-page external id "${pageExternalId}" for questionnaire id "${getQuestionnaireIdInSession(
                            req.session
                        )}". Redirecting to dashboard.`
                    );
                }
                return res.redirect('/account/dashboard');
            }
            let nextSectionId;
            // delete the token from the body to allow AJV to validate the request.
            // eslint-disable-next-line no-underscore-dangle
            delete body._csrf;
            // eslint-disable-next-line no-underscore-dangle
            delete body['_external-id'];
            const response = await questionnaireService.postSection(
                getQuestionnaireIdInSession(req.session),
                sectionId,
                body
            );

            if (response.statusCode === 201) {
                // if the page is a submission
                const isApplicationSubmission =
                    response.body.data.pageContext === 'submission' ||
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

                const isRedirect = response.body.data.pageContext === 'authentication-redirect';
                if (isRedirect) {
                    const answer = Object.values(response.body.data.attributes);
                    if (answer.includes('redirect')) {
                        req.session.referrer = `/apply/${nextSectionId}`;
                        return res.redirect(`/account/sign-in`);
                    }
                }

                return res.redirect(`${req.baseUrl}/${nextSectionId}`);
            }

            const html = formHelper.getSectionHtmlWithErrors(
                response.body,
                sectionId,
                res.locals.csrfToken,
                res.locals.cspNonce,
                isAuthenticated,
                req.session.externalId
            );
            return res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
            return next(err);
        }
    });

module.exports = router;
