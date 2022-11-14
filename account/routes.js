'use strict';

const express = require('express');

const router = express.Router();
const createIssuerService = require('../services/issuer');
const createAuthorisationService = require('../services/authorisation');
const createAccountService = require('../services/account');
const createTokenService = require('../services/token');
const createCookieService = require('../cookie/cookie-service');
const {getSignedOutURI, getRefererURI, isValidRedirectionURI} = require('./utils/getActionURIs');

router.route('/sign-in').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        if (accountService.isSignedIn()) {
            const redirectURI = signedInCookie.get('referer');
            let decodedRefererURI = Buffer.from(redirectURI, 'base64').toString('utf-8');
            if (!isValidRedirectionURI(decodedRefererURI)) {
                decodedRefererURI = getRefererURI();
            }
            return res.redirect(decodedRefererURI);
        }
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        const encodedRefererURI = Buffer.from(getRefererURI(req.headers.referer)).toString(
            'base64'
        );
        signedInCookie.set({
            referer: encodedRefererURI
        });

        const authorisationURI = await authorisationService.getAuthorisationURI(
            issuer,
            encodedRefererURI
        );
        return res.status(303).redirect(authorisationURI);
    } catch (err) {
        return next(err);
    }
});

router.route('/sign-out').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (!accountService.isSignedIn()) {
            return res.redirect('http://www.gov.uk');
        }
        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        const idToken = signedInCookie.get('idToken');
        // console.log({idToken});
        return res
            .status(303)
            .redirect(
                `https://signin.account.gov.uk/logout?id_token_hint=${idToken}&post_logout_redirect_uri=${getSignedOutURI()}`
            );
    } catch (err) {
        return next(err);
    }
});

router.route('/dashboard').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (!accountService.isSignedIn()) {
            return res.redirect('/account/sign-in'); // or other places depending on query params.
        }
        // get all questionnaires pertaining to a user.
        // render dashboard.
        return res.status(200).json({location: 'dashboard'});
    } catch (err) {
        return next(err);
    }
});

router.route('/signed-in').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (accountService.isSignedIn()) {
            return res.redirect('/account/dashboard');
        }
        const tokenService = createTokenService();
        const queryParams = req.query;

        const signedInCookie = createCookieService({
            req,
            res,
            cookieName: 'signedinuser'
        });
        const referer = signedInCookie.get('referer');

        console.log(queryParams.state, referer);
        if (queryParams.state !== referer) {
            throw Error('Received incorrect value for "state"');
        }
        if (!queryParams.code) {
            throw Error('AUTHORIZATION_CODE not set');
        }

        const idToken = await tokenService.getIdToken(queryParams.code);
        const idTokenDecoded = await tokenService.validateIdToken(idToken);
        accountService.signIn(idTokenDecoded.sub, idToken);
        // need to check it is an internal URL somehow...?
        const redirectURI = Buffer.from(referer, 'base64').toString('utf-8');
        return res.redirect(redirectURI);

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

router.route('/signed-out').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        accountService.signOut();
        res.redirect('http://www.gov.uk');
    } catch (err) {
        next(err);
    }
});

// send the user to the end of the road if they try and acess any of the intermediate endpoints/urls.

// i.e. if they manually go to /loggedIn, then punt them to gov uk login if they are not logged in, otherwise punt them to the dashboard (or whatever the end of the road will be)

module.exports = router;
