'use strict';

const express = require('express');
const createSignInService = require('../govuk/sign-in/index');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        // check if `req.session.userId` exits, and if so, redirect the user to the appropriate page.

        const signInService = createSignInService();
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;
        const stateObject = {
            qid: req.session.questionnaireId,
            referrer: req.get('Referrer') || `${req.protocol}://${req.get('host')}/apply/`
        };
        const encodedState = Buffer.from(JSON.stringify(stateObject)).toString('base64');

        const options = {
            state: encodedState,
            redirect_uri: redirectUri
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
        if (stateObject.qid !== req.session.questionnaireId) {
            const err = Error(`Received incorrect value for "state"`);
            err.name = 'IncorrectStateReceived';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }

        // Get redirectUri
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;

        // Get UserIdToken
        const signInService = createSignInService();
        const options = {
            code: queryParams.code,
            redirectUri
        };
        const userIdToken = await signInService.getIdToken(options);

        // Save unique userId as system answer
        req.session.userId = userIdToken;
        console.log(`HERE'S OUR NEW COOKIE VALUE: ${req.session.userId}`);

        // Redirect user back to current progress entry
        return res.redirect(302, stateObject.referrer);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        console.log(err);
        return next(err);
    }
});

module.exports = router;
