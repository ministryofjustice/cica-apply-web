'use strict';

const express = require('express');
const createSignInService = require('../govuk/sign-in/index');
const createCryptoService = require('../utils/crypto/index');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        const signInService = createSignInService();
        const cryptoService = createCryptoService();
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;
        const referrer = req.get('Referrer') || `${req.protocol}://${req.get('host')}/apply/`;
        const stateObject = {
            qid: req.session.questionnaireId,
            referrer
        };
        const options = {
            state: Buffer.from(JSON.stringify(stateObject)).toString('base64'),
            redirect_uri: redirectUri,
            nonce: cryptoService.encrypt(req.session.questionnaireId)
        };
        const url = await signInService.getServiceUrl(options);
        return res.redirect(302, url);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/signed-in', async (req, res, next) => {
    try {
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
        const stateObject = JSON.parse(Buffer.from(queryParams.state, 'base64').toString('ascii'));
        if (stateObject.qid !== req.session.questionnaireId) {
            const err = Error(`Received incorrect value for "state"`);
            err.name = 'IncorrectStateReceived';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        }

        // Get redirectUri
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;

        // Get Nonce
        const cryptoService = createCryptoService();
        const expectedNonce = cryptoService.encrypt(req.session.questionnaireId);

        // Get UserIdToken
        const signInService = createSignInService();
        const userId = await signInService.getUserId(queryParams.code, redirectUri, expectedNonce);

        // Save unique userId as system answer
        req.session.userId = userId;
        console.log(`HERE'S OUR NEW COOKIE VALUE: ${req.session.userId}`);

        // Redirect user back to current progress entry
        return res.redirect(302, stateObject.referrer);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
