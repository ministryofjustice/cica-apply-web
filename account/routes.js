'use strict';

const express = require('express');
const {v4: uuidv4} = require('uuid');
const createSignInService = require('../govuk/sign-in/index');
const createTemplateEngineService = require('../templateEngine');
const qService = require('../questionnaire/questionnaire-service')();

const {getSignedInURI} = require('./utils/getActionURIs');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        // check if `req.session.userId` exits, and if so, redirect the user to the appropriate page.

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
        // check if signed in already and do appropriate action.

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
        // Send the user to the landing page
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('authenticated-user-landing-page.njk', {
            nextPageUrl: stateObject.referrer
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
        req.session.userId = undefined;
        return res.redirect(302, url);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard', async (req, res, next) => {
    try {
        // Remove session cookie
        req.session.questionnaireId = undefined;

        // Get data
        const dataObject = [
            [
                {
                    text: 'Tony Stark',
                    classes: 'govuk-table__cell__overflow'
                },
                {
                    text: '8 December 2022',
                    attributes: {
                        'data-sort-value': '123456789002'
                    }
                },
                {
                    html:
                        "<a href='www.gov.uk'>Continue<span class='govuk-visually-hidden'> Continue application for Tony Stark</span></a>"
                }
            ],
            [
                {
                    text: 'Bruce Banner',
                    classes: 'govuk-table__cell__overflow'
                },
                {
                    text: '7 December 2022',
                    attributes: {
                        'data-sort-value': '123456789001'
                    }
                },
                {
                    html:
                        "<a href='www.gov.uk'>Continue<span class='govuk-visually-hidden'> Continue application for Bruce Banner</span></a>"
                }
            ]
        ];

        // Go to dashboard
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk', {nonce: res.locals.nonce, userData: dataObject});
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
