'use strict';

const express = require('express');
const {v4: uuidv4} = require('uuid');
const createSignInService = require('../govuk/sign-in/index');

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
        req.session.userId = userIdToken;

        // Redirect user back to current progress entry
        return res.redirect(302, stateObject.referrer);
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

module.exports = router;
