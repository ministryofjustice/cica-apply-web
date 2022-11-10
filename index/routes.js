'use strict';

const express = require('express');
const createLiveChatHelper = require('./liveChatHelper');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk');
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us.njk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk');
});

router.get('/accessibility-statement', (req, res) => {
    res.render('accessibility-statement.njk');
});

router.get('/start-chat', (req, res) => {
    if (process.env.CW_LIVECHAT_ALIVE !== 'true') {
        return res.render('chat-withdrawn.njk');
    }
    const liveChatHelper = createLiveChatHelper();
    if (
        process.env.CW_LIVECHAT_DISABLED !== 'true' &&
        liveChatHelper.isLiveChatActive(
            process.env.CW_LIVECHAT_START_TIMES,
            process.env.CW_LIVECHAT_END_TIMES
        )
    ) {
        return res.render('start-chat.njk');
    }
    return res.render('chat-disabled.njk');
});

router.get('/chat', (req, res) => {
    if (process.env.CW_LIVECHAT_ALIVE !== 'true') {
        return res.render('chat-withdrawn.njk');
    }
    const liveChatHelper = createLiveChatHelper();
    if (
        process.env.CW_LIVECHAT_DISABLED !== 'true' &&
        liveChatHelper.isLiveChatActive(
            process.env.CW_LIVECHAT_START_TIMES,
            process.env.CW_LIVECHAT_END_TIMES
        )
    ) {
        return res.render('chat-iframe.njk');
    }
    return res.render('chat-disabled.njk');
});

const createTokenService = require('../services/token');
const createAccountService = require('../services/account');
// const createCookieService = require('../cookie/cookie-service');

// emulating env secrets stored remotely.
const config = require('../config/index.json');

router.route('/loggedIn').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (accountService.isSignedIn()) {
            return res.redirect('/account/dashboard');
        }
        const tokenService = createTokenService();
        const queryParams = req.query;

        if (queryParams.state !== config.state) {
            throw Error('Received incorrect value for "state"');
        }
        if (!queryParams.code) {
            throw Error('AUTHORIZATION_CODE not set');
        }

        const idToken = await tokenService.getIdToken(queryParams.code);
        const idTokenDecoded = await tokenService.validateIdToken(idToken);
        accountService.signIn(idTokenDecoded.sub);
        return res.redirect('/account/dashboard');

        // next steps:
        // check if there is an in progress application related to this session.
        // store the `idTokenDecoded.sub` alongside that questionnaire in the DB (user_id or similar).
        // if a user_id exists on a row (after the 30 minutes has elapsed), don't delete it
        // if a user_id exists on a row, and 30 days has elapsed, delete it.
        // Dashboard:
        // getQuestionnairesByUserId()
        // If a user is logged in and they start a new application, then create the entry in the DB with the user ID also present. This will ensure immediate association.
    } catch (err) {
        return next(err);
    }
});
// router.route('/loggedOut').get(async (req, res, next) => {
//     try {
//         res.redirect('http://www.gov.uk');
//     } catch (err) {
//         console.log({err});
//         next(err);
//     }
// });

module.exports = router;

// send the user to the end of the road if they try and acess any of the intermediate endpoints/urls.

// i.e. if they manually go to /loggedIn, then punt them to gov uk login if they are not logged in, otherwise punt them to the dashboard (or whatever the end of the road will be)

router.get('*', (req, res) => {
    res.status(404).render('404.njk');
});

module.exports = router;
