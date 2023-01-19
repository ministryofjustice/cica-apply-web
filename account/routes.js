'use strict';

const express = require('express');
const {v4: uuidv4} = require('uuid');
// const passport = require('passport');

const createJwtService = require('../govuk/sign-in/jwt');
const createAuthService = require('../openid/auth');

const createSignInService = require('../govuk/sign-in');

const router = express.Router();

/* ******************************************************************************************************************************************** */
/* ** OPENID-CLIENT IMPLEMENTATION START                                                                                                     ** */
/* ******************************************************************************************************************************************** */
/* **                                                                                                                                        ** */
/* ** consistantly errors with the following:                                                                                                ** */
/* **                                                                                                                                        ** */
/* ** cw                      | TypeError: no client jwks provided for signing a client assertion with                                       ** */
/* ** cw                      |     at Client.clientAssertion (/usr/src/app/node_modules/openid-client/lib/helpers/client.js:46:11)          ** */
/* ** cw                      |     at processTicksAndRejections (node:internal/process/task_queues:96:5)                                    ** */
/* ** cw                      |     at async Client.authFor (/usr/src/app/node_modules/openid-client/lib/helpers/client.js:97:25)            ** */
/* ** cw                      |     at async Client.authenticatedPost (/usr/src/app/node_modules/openid-client/lib/helpers/client.js:164:16) ** */
/* ** cw                      |     at async Client.grant (/usr/src/app/node_modules/openid-client/lib/client.js:1316:22)                    ** */
/* ** cw                      |     at async Client.callback (/usr/src/app/node_modules/openid-client/lib/client.js:476:24)                  ** */
/* ** cw                      |     at async /usr/src/app/account/routes.js:35:22                                                            ** */
/* ******************************************************************************************************************************************** */

router.get('/sign-in', async (req, res) => {
    const authService = createAuthService(req);
    const redirectUri = await authService.getAuthorisationUri({
        nonce: '123',
        state: '456'
    });
    return res.redirect(redirectUri);
});

router.get('/signed-in', async (req, res) => {
    const authService = createAuthService(req);
    const jwtService = createJwtService();
    const client = await authService.getClient();
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
        'http://localhost:3000/signed-in',
        params,
        {
            // code_verifier: req.session.codeVerifier,
            nonce: '123',
            state: '456',
            hello: 'bacon'
        },
        {
            exchangeBody: {
                client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
                client_assertion: jwtService.generateJWT({
                    aud: client.token_endpoint,
                    iss: process.env.CW_GOVUK_CLIENT_ID,
                    sub: process.env.CW_GOVUK_CLIENT_ID,
                    exp: Date.now() + 1000 * 60 * 5, // 5 minutes from now.
                    jti: uuidv4(),
                    iat: Date.now() // TODO: cache Date.now() to be the same value for both.
                })
            }
        }
    );
    res.json({
        a: `received and validated tokens: ' ${tokenSet}`,
        b: `validated ID Token claims: ' ${tokenSet.claims()}`
    });
});

/* ******************************************************************************************************************************************** */
/* ** OPENID-CLIENT IMPLEMENTATION END                                                                                                       ** */
/* ******************************************************************************************************************************************** */

// /* ************************************************** */
// /* ** OPENID-CONNECT IMPLEMENTATION START          ** */
// /* ************************************************** */

// router.get('/sign-in', passport.authenticate('openidconnect'));

// router.get(
//     '/signed-in',
//     passport.authenticate('openidconnect', {
//         failureRedirect: '/woops',
//         failureMessage: true
//     }),
//     (req, res) => {
//         res.redirect('/success');
//     }
// );

// /* ************************************************** */
// /* ** OPENID-CONNECT IMPLEMENTATION END            ** */
// /* ************************************************** */

// router.get('/sign-in', (req, res, next) => {
//     let {redirect} = req.query;
//     redirect = redirect || '/apply';
//     const state = {
//         qid: req.session.questionnaireId,
//         redirect
//     };
//     req.session.nonce = uuidv4();
//     const encodedState = Buffer.from(JSON.stringify(state)).toString('base64');
//     passport.authenticate('oidc', {
//         scope: 'openid',
//         state: encodedState,
//         nonce: req.session.nonce
//     })(req, res, next);
// });
// router.get('/signed-in', async (req, res, next) => {
//     let queryParams;
//     try {
//         queryParams = req?.query;
//         if (queryParams.error) {
//             const authenticationError = queryParams.error;
//             const authenticationErrorDescription = queryParams.error_description;
//             // TODO: log this error somewhere correctly.
//             throw Error(`${authenticationError} - ${authenticationErrorDescription}`);
//         }
//         // passport.authenticate('oidc', {
//         //     successRedirect: '/user',
//         //     failureRedirect: '/woops'
//         // })(req, res, next);
//         // // assumes req.body is populated from your web framework's body parser
//         const params = client.callbackParams(req);
//         const tokenSet = await client.callback('https://client.example.com/callback', params, { code_verifier });
//         console.log('received and validated tokens %j', tokenSet);
//         console.log('validated ID Token claims %j', tokenSet.claims());
//     } catch (err) {
//         // const state = JSON.parse(Buffer.from(queryParams.state, 'base64').toString('UTF-8'));
//         // res.redirect(state.redirect);
//         res.json({error: err});
//     }
// });

// router.get('/sign-in', async (req, res, next) => {
//     try {
//         // check if `req.session.userId` exits, and if so, redirect the user to the appropriate page.

//         const signInService = createSignInService();
//         const redirectUri = getSignedInURI();
//         const stateObject = {
//             qid: req.session.questionnaireId,
//             referrer: req.get('Referrer') || '/apply/'
//         };
//         const encodedState = Buffer.from(JSON.stringify(stateObject)).toString('base64');

//         req.session.nonce = uuidv4();
//         const options = {
//             state: encodedState,
//             redirect_uri: redirectUri,
//             nonce: req.session.nonce
//         };

//         const url = await signInService.getAuthorisationURI(options);
//         return res.redirect(302, url);
//     } catch (err) {
//         res.status(err.statusCode || 404).render('404.njk');
//         return next(err);
//     }
// });

// router.get('/signed-in', async (req, res, next) => {
//     try {
//         // check if signed in already and do appropriate action.

//         // Get query strings
//         const queryParams = req.query;
//         if (queryParams.error) {
//             const err = Error(`Error: ${queryParams.error_description}`);
//             err.name = queryParams.error;
//             err.statusCode = 500;
//             err.error = '500 Internal Server Error';
//             throw err;
//         }
//         // Validate state
//         const stateObject = JSON.parse(Buffer.from(queryParams.state, 'base64').toString('UTF-8'));
//         // TODO: check referrer too?
//         if (stateObject.qid !== req.session.questionnaireId) {
//             const err = Error(`Received incorrect value for "state"`);
//             err.name = 'IncorrectStateReceived';
//             err.statusCode = 500;
//             err.error = '500 Internal Server Error';
//             throw err;
//         }

//         // Get UserIdToken
//         const signInService = createSignInService();
//         const userIdToken = await signInService.getIdToken(queryParams.code, req.session.nonce);

//         // delete the nonce
//         req.session.nonce = undefined;
//         // Save unique userId as system answer
//         req.session.userId = userIdToken;

//         // Redirect user back to current progress entry
//         return res.redirect(302, stateObject.referrer);
//     } catch (err) {
//         res.status(err.statusCode || 404).render('404.njk');
//         return next(err);
//     }
// });

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
