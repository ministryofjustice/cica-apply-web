'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const createTemplateEngineService = require('../templateEngine');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');
const {getDashboardURI} = require('./utils/getActionURIs');
const createAccountService = require('./account-service');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const getQuestionnaireIdInSession = require('../questionnaire/utils/getQuestionnaireIdInSession');
const createDashboardService = require('../dashboard/dashboard-service');
const getSignInReturnTo = require('./utils/getSignInReturnToURI');

const router = express.Router();

router.get('/sign-in/success', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        const {render} = templateEngineService;

        const questionnaireId = getQuestionnaireIdInSession(req.session);
        const questionnaireServiceUnauthenticated = createQuestionnaireService({
            ownerId: accountService.getOwnerId()
        });
        if (questionnaireId) {
            await questionnaireServiceUnauthenticated.postSection(questionnaireId, 'owner', {
                'owner-id': req.oidc.user.sub,
                'is-authenticated': true
            });
        }

        const questionnaireServiceAuthenticated = createQuestionnaireService({
            ownerId: req.oidc.user.sub
        });
        const questionnaireMetadata = await questionnaireServiceAuthenticated.getQuestionnaireMetadata(
            questionnaireId
        );

        const expiryDate = new Date(
            questionnaireMetadata.body.data[0].attributes.expires
        ).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/London'
        });

        accountService.setOwnerId(req.oidc.user.sub);
        const html = render('authentication-success.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate,
            isAuthenticated: accountService.isAuthenticated(req),
            cspNonce: res.locals.cspNonce,
            userId: accountService.getOwnerId(req),
            externalId: req.session.externalId,
            sectionId: 'authentication-success'
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/auth', (req, res) => {
    return res.oidc.login({
        returnTo: getSignInReturnTo(req.session),
        authorizationParams: {
            redirect_uri: `${process.env.CW_URL}/account/signed-in`
        }
    });
});

router.get('/sign-in', (req, res) => {
    res.oidc.logout({
        returnTo: '/auth'
    });
});

router.get('/signed-in', requiresAuth(), (req, res, next) => {
    try {
        return res.redirect('/account/sign-in/success');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/sign-out', (req, res) => {
    res.clearCookie('session', {path: '/'});
    res.clearCookie('sessionExpiry', {path: '/'});
    res.oidc.logout();
});

router.get('/signed-out', (req, res, next) => {
    try {
        return res.render('signed-out.njk', {sectionId: 'signed-out'});
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        accountService.setOwnerId(req.oidc.user.sub);
        const dashboardService = createDashboardService(req.oidc.user.sub);
        const applicationData = await dashboardService.getApplicationData();
        const displayStartedApplications = applicationData.length > 0;

        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            applicationData,
            displayStartedApplications,
            cspNonce: res.locals.cspNonce,
            currentUrlPathname: '/account/dashboard',
            sectionId: 'dashboard'
        });
        res.clearCookie('sessionExpiry', {path: '/'});
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/dashboard/manage', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        accountService.setOwnerId(req.oidc.user.sub);
        const dashboardService = createDashboardService(req.oidc.user.sub);
        const actionData = await dashboardService.getActionData();
        const displayActions = actionData.length > 0;

        const {render} = templateEngineService;
        const html = render('manage-applications.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            actionData,
            displayActions,
            cspNonce: res.locals.cspNonce,
            currentUrlPathname: '/account/dashboard/manage'
        });
        res.clearCookie('sessionExpiry', {path: '/'});
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard/manage/:questionnaireId', async (req, res) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });

        const defaultRedirect = '/dashboard';

        const resumableQuestionnaireId = req.params.questionnaireId;
        const resumableQuestionnaireResponse = await questionnaireService.getCurrentSection(
            resumableQuestionnaireId
        );
        const questionnaireMetadata = await questionnaireService.getQuestionnaireMetadata(
            resumableQuestionnaireId
        );
        const modifiedDate = questionnaireMetadata.body.data[0].attributes.modified;
        const createdDate = questionnaireMetadata.body.data[0].attributes.created;
        const actionToDo = modifiedDate === createdDate;

        const personalisationData = await questionnaireService.getPersonalisationData(
            resumableQuestionnaireId
        );
        const applicantFirstName = personalisationData.body.data.attributes['first-name'];
        const applicantLastName = personalisationData.body.data.attributes['last-name'];

        const submissionData = await questionnaireService.getSubmission(resumableQuestionnaireId);
        const {caseReferenceNumber} = submissionData.body.data.attributes;

        const actionLink = `<p class=govuk-body><a href="/apply/resume/${resumableQuestionnaireId}" class="govuk-link">Read our decision about your application</a></p>`;

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
                return res.redirect(defaultRedirect);
            }
        }

        const resumableQuestionnaireCurrentSectionId =
            resumableQuestionnaireResponse.body?.data?.[0]?.relationships?.section?.data?.id;

        // redirect if valid.
        if (resumableQuestionnaireCurrentSectionId) {
            const {render} = templateEngineService;
            const html = render('todo.njk', {
                csrfToken: req.csrfToken(),
                isAuthenticated: accountService.isAuthenticated(req),
                caseReferenceNumber,
                applicantFirstName,
                applicantLastName,
                actionToDo,
                actionLink,
                cspNonce: res.locals.cspNonce,
                currentUrlPathname: `/account/dashboard/manage/${resumableQuestionnaireId}`
            });
            return res.send(html);
        }
        return res.redirect(defaultRedirect);
    } catch (err) {
        return res.redirect('/dashboard');
    }
});

router.get('/secure-link-login', requiresAuth(), async (req, res, next) => {
    try {
        const accountService = createAccountService(req.session);
        const ownerId = req.query.uid;
        const questionnaireId = req.query.qid;
        const questionnaireServiceUnauthenticated = createQuestionnaireService({
            ownerId
        });
        if (questionnaireId) {
            await questionnaireServiceUnauthenticated.postSection(questionnaireId, 'owner', {
                'owner-id': req.oidc.user.sub,
                'is-authenticated': true
            });
            accountService.setOwnerId(req.oidc.user.sub);

            return res.redirect(`/apply/resume/${questionnaireId}`);
        }

        // Else, redirect dashboard
        return res.redirect('/account/dashboard');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/*', (req, res) => {
    res.redirect(getDashboardURI());
});

module.exports = router;
