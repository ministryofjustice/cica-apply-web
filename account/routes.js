'use strict';

const express = require('express');
const createSignInService = require('../govuk/sign-in/index');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        const signInService = createSignInService();
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;
        const url = await signInService.getServiceUrl(redirectUri);
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
        /* if (queryParams.state !== config.state) {
            const err = Error(`Received incorrect value for "state"`);
            err.name = 'IncorrectStateReceived';
            err.statusCode = 500;
            err.error = '500 Internal Server Error';
            throw err;
        } */

        // Get redirectUri
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;

        // Get UserIdToken
        const signInService = createSignInService();
        const options = {
            code: queryParams.code,
            redirectUri
        };
        const userIdToken = await signInService.getUserIdToken(options);

        // Save unique userId as system answer
        req.session.userId = userIdToken;
        console.log(`HERE'S OUR NEW COOKIE VALUE: ${req.session.userId}`);

        // Redirect user back to current progress entry
        // ToDo: This logic should live elsewhere, this routes file shouldn't know about formHelper or qService
        // eslint-disable-next-line global-require
        const formHelper = require('../questionnaire/form-helper');
        // eslint-disable-next-line global-require
        const qService = require('../questionnaire/questionnaire-service')();

        const progressEntryResponse = await qService.getCurrentSection(req.session.questionnaireId);
        const nextSectionId = formHelper.removeSectionIdPrefix(
            progressEntryResponse.body.data[0].attributes.sectionId
        );

        return res.redirect(302, `${req.protocol}://${req.get('host')}/apply/${nextSectionId}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
