'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
// const {v4: uuidv4} = require('uuid');
// const createSignInService = require('../govuk/sign-in/index');
const createTemplateEngineService = require('../templateEngine');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const createDashboardService = require('../dashboard/dashboard-service');

// const {getSignedInURI, getSignedOutURI, getDashboardURI} = require('./utils/getActionURIs');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        res.oidc.login();
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.get('/process-auth', requiresAuth(), async (req, res, next) => {
    try {
        const questionnaireService = createQuestionnaireService();
        console.log('req.session.questionnaireId', req.session.questionnaireId, {
            'user-id': req.oidc.user.sub
        });
        await questionnaireService.postSection(req.session.questionnaireId, 'user', {
            'user-id': req.oidc.user.sub
        });
        res.redirect(req.query.redirect);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.get('/sign-out', requiresAuth(), async (req, res, next) => {
    try {
        res.oidc.logout();
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.get('/signed-out', requiresAuth(), async (req, res, next) => {
    try {
        console.log('GOT TO THE SIGNED OUT ROUTE HANDLER!!!!!!!!!!!!!');
        res.send('GOT TO THE SIGNED OUT ROUTE HANDLER!!!!!!!!!!!!!');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const dashboardService = createDashboardService();
        const templateData = await dashboardService.getTemplateData(req.oidc.user.sub);
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            nonce: res.locals.nonce,
            userData: templateData,
            isAuthenticated: !!req.oidc.user.sub
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/sign-in/success', requiresAuth(), async (req, res, next) => {
    try {
        const expiryDate = new Date(
            new Date().setDate(new Date().getDate() + 31)
        ).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});

        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('authenticated-user-landing-page.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.query?.redirect),
            expiryDate,
            isAuthenticated: !!req.oidc.user.sub
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
