'use strict';

const express = require('express');
const createSignInService = require('../govuk/sign-in/index');
const createCryptoService = require('./utils/crypto/index');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        // check if `req.session.userId` exits, and if so, redirect the user to the appropriate page.

        const signInService = createSignInService();
        const cryptoService = createCryptoService();
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;
        const stateObject = {
            qid: req.session.questionnaireId,
            referrer: req.get('Referrer') || `${req.protocol}://${req.get('host')}/apply/`
        };
        const encodedState = Buffer.from(JSON.stringify(stateObject)).toString('base64');
        const nonce = cryptoService.encrypt(req.session.questionnaireId);

        const options = {
            state: encodedState,
            redirect_uri: redirectUri,
            nonce
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
        const cryptoService = createCryptoService();
        const expectedNonce = cryptoService.encrypt(req.session.questionnaireId);
        const options = {
            authorisationCode: queryParams.code,
            expectedNonce
        };
        const userIdToken = await signInService.getIdToken(options);

        // Save unique userId as system answer
        req.session.userId = userIdToken;

        // Redirect user back to current progress entry
        return res.redirect(302, stateObject.referrer);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
