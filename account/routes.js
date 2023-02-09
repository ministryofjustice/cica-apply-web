'use strict';

const express = require('express');
const {v4: uuidv4} = require('uuid');
const createSignInService = require('../govuk/sign-in/index');
const createTemplateEngineService = require('../templateEngine');
const qService = require('../questionnaire/questionnaire-service')();
const createDashboardService = require('../dashboard/dashboard-service');

const {getSignedInURI} = require('./utils/getActionURIs');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        if (req.session.userId) {
            return res.redirect('/account/dashboard');
        }

        const signInService = createSignInService();
        const redirectUri = getSignedInURI();
        const stateObject = {
            qid: req.session.questionnaireId,
            referrer: req.get('Referrer') || '/apply/'
        };
        const encodedState = Buffer.from(JSON.stringify(stateObject)).toString('base64');

        req.session.nonce = uuidv4();
        const options = {
            state: encodedState,
            redirect_uri: redirectUri,
            nonce: req.session.nonce
        };

        const url = await signInService.getAuthorisationURI(options);
        return res.redirect(302, url);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/signed-in', async (req, res, next) => {
    try {
        if (req.session.userId) {
            return res.redirect('/account/dashboard');
        }

        // Get query strings
        const queryParams = req.query;
        if (queryParams.error) {
            const err = Error(`Error: ${queryParams.error_description}`);
            err.name = queryParams.error;
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }
        // Validate state
        const stateObject = JSON.parse(Buffer.from(queryParams.state, 'base64').toString('UTF-8'));
        // TODO: check referrer too?
        if (stateObject.qid !== req.session.questionnaireId) {
            const err = Error(`Received incorrect value for "state"`);
            err.name = 'IncorrectStateReceived';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }

        // Get UserIdToken
        const signInService = createSignInService();
        const userIdToken = await signInService.getIdToken(queryParams.code, req.session.nonce);

        // delete the nonce
        req.session.nonce = undefined;
        // Save unique userId as system answer
        req.session.userId = userIdToken.sub;

        // Save the userId to the questionnaire
        const data = {'user-id': userIdToken.sub};
        await qService.postSection(req.session.questionnaireId, 'user', data);

        // Calculate the expiry date
        const dateOpts = {year: 'numeric', month: 'long', day: 'numeric'};
        const expiryDate = new Date(
            new Date().setDate(new Date().getDate() + 30)
        ).toLocaleDateString('en-GB', dateOpts);
        // Send the user to the landing page
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('authenticated-user-landing-page.njk', {
            nextPageUrl: stateObject.referrer,
            expiryDate
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/sign-out', async (req, res, next) => {
    try {
        const signInService = createSignInService();
        const url = await signInService.getLogoutUrl();
        delete req.session.userId;
        return res.redirect(302, url);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard', async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/account/sign-in');
        }
        const dashboardService = createDashboardService();
        const templateData = await dashboardService.getTemplateData(req.session.userId);
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            nonce: res.locals.nonce,
            userData: templateData,
            isAuthenticated: 'userId' in req.session
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
