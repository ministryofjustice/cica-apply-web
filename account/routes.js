'use strict';

const express = require('express');

const router = express.Router();
const createIssuerService = require('../services/issuer');
const createAuthorisationService = require('../services/authorisation');
const createAccountService = require('../services/account');
// const createAccountsDAL = require('../services/dal');

router.route('/sign-in').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (accountService.isSignedIn()) {
            return res.redirect('/account/dashboard'); // or other places depending on query params.
        }
        const issuerService = createIssuerService();
        const authorisationService = createAuthorisationService();
        const issuer = await issuerService.identify();
        const authorisationURI = await authorisationService.getAuthorisationURI(issuer);
        return res.status(303).redirect(authorisationURI);
    } catch (err) {
        return next(err);
    }
});

// router.route('/sign-out').get(async (req, res, next) => {
//     try {
//         if (!isSignedIn()) {
//             return;
//         }
//         const db = createAccountsDAL();
//         const tokenData = JSON.parse(db.get('token'));
//         res.status(303).redirect(
//             `https://signin.account.gov.uk/logout?id_token_hint=${tokenData.id_token}&post_logout_redirect_uri=http://127.0.0.1:6987/loggedOut`
//         );
//     } catch (err) {
//         next(err);
//     }
// });

router.route('/dashboard').get(async (req, res, next) => {
    try {
        const accountService = createAccountService({req, res});
        if (!accountService.isSignedIn()) {
            return res.redirect('/account/sign-in'); // or other places depending on query params.
        }
        // const accountService = createAccountService();
        // const userId = accountService.getAuthenticatedUserId();
        return res.status(200).json({location: 'dashboard'});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
