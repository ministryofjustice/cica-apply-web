'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const createTemplateEngineService = require('../templateEngine');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');
const {getDashboardURI} = require('./utils/getActionURIs');
const createAccountService = require('./account-service');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const getQuestionnaireIdInSession = require('../questionnaire/utils/getQuestionnaireIdInSession');

const router = express.Router();

router.get('/sign-in/success', requiresAuth(), async (req, res, next) => {
    try {
        const expiryDate = new Date(
            new Date().setDate(new Date().getDate() + 31)
        ).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});

        const accountService = createAccountService(req.session);
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;

        const questionnaireId = getQuestionnaireIdInSession(req.session);
        if (questionnaireId) {
            const questionnaireService = createQuestionnaireService({
                id: accountService.getOwnerId(),
                isAuthenticated: true
            });
            await questionnaireService.postSection(questionnaireId, 'owner', {
                id: req.oidc.user.sub,
                isAuthenticated: true
            });
        }
        accountService.setOwnerId(req.oidc.user.sub);

        const html = render('authentication-success.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/sign-in', (req, res) =>
    res.oidc.login({
        returnTo: '/account/sign-in/success',
        authorizationParams: {
            redirect_uri: `${process.env.CW_URL}/account/signed-in`
        }
    })
);

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk');
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
