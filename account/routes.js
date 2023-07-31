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

        const html = render('authentication-success.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate,
            isAuthenticated: accountService.isAuthenticated(req),
            nonce: res.locals.nonce
        });
        accountService.setOwnerId(req.oidc.user.sub);
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/sign-in', (req, res) =>
    res.oidc.login({
        returnTo: getSignInReturnTo(req.session),
        authorizationParams: {
            redirect_uri: `${process.env.CW_URL}/account/signed-in`
        }
    })
);

router.get('/signed-in', requiresAuth(), (req, res, next) => {
    try {
        return res.redirect('/account/sign-in/success');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
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
        return res.redirect('https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        accountService.setOwnerId(req.oidc.user.sub);
        const dashboardService = createDashboardService(req.oidc.user.sub);
        const ownerData = await dashboardService.getTemplateData();

        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            ownerData,
            nonce: res.locals.nonce
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/*', (req, res) => {
    res.redirect(getDashboardURI());
});

module.exports = router;
