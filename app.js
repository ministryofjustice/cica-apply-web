'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const clientSessions = require('client-sessions');
const csrf = require('csurf');
const {nanoid} = require('nanoid');
// const passport = require('passport');
// const OpenIDConnectStrategy = require('passport-openidconnect');
// const {Issuer, Strategy, generators} = require('openid-client');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');
const accountRouter = require('./account/routes');
const createCookieService = require('./cookie/cookie-service');

const DURATION_LIMIT = 3600000;

const app = express();

nunjucks
    .configure(
        [
            'node_modules/@ministryofjustice/frontend/',
            'components/',
            'node_modules/govuk-frontend/govuk/',
            'node_modules/govuk-frontend/govuk/components/',
            'index/',
            'questionnaire/',
            'page/',
            'partials/'
        ],
        {
            autoescape: true,
            express: app
        }
    )
    .addGlobal('CW_GA_TRACKING_ID', process.env.CW_GA_TRACKING_ID)
    .addGlobal('CW_URL', process.env.CW_URL)
    .addGlobal('CW_LIVECHAT_CHAT_ID', process.env.CW_LIVECHAT_CHAT_ID)
    .addGlobal(
        'CW_LIVECHAT_MAINTENANCE_MESSAGE',
        !process.env?.CW_LIVECHAT_MAINTENANCE_MESSAGE?.length
            ? 'maintenance message not set'
            : process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE
    )
    .addGlobal(
        'CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED',
        process.env.CW_LIVECHAT_MAINTENANCE_MESSAGE_ENABLED === 'true'
    )
    .addGlobal(
        'CW_MAINTENANCE_MESSAGE',
        !process.env?.CW_MAINTENANCE_MESSAGE?.length
            ? 'maintenance message not set'
            : process.env.CW_MAINTENANCE_MESSAGE
    )
    .addGlobal(
        'CW_MAINTENANCE_MESSAGE_ENABLED',
        process.env.CW_MAINTENANCE_MESSAGE_ENABLED === 'true'
    );

app.use((req, res, next) => {
    res.locals.nonce = nanoid();
    // https://stackoverflow.com/a/22339262/2952356
    // `process.env.npm_package_version` only works if you use npm start to run the app.
    res.set('Application-Version', process.env.npm_package_version);
    next();
});

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    (req, res) => `'nonce-${res.locals.nonce}'`,
                    "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='", // hash of the inline script in frontend template.njk.
                    'www.googletagmanager.com'
                ],
                imgSrc: ["'self'", 'data:', 'www.google-analytics.com', 'www.googletagmanager.com'],
                objectSrc: ["'none'"],
                frameSrc: ['*.ccng.bt.com'],
                connectSrc: ["'self'", 'www.google-analytics.com']
            }
        },
        hsts: {
            maxAge: 60 * 60 * 24 * 365 // the units is seconds.
        }
    })
);

app.use(logger('dev'));
// https://expressjs.com/en/api.html#express.json
app.use(express.json());
// https://expressjs.com/en/api.html#express.urlencoded
app.use(express.urlencoded({extended: true}));
app.use(
    cookieParser(null, {
        httpOnly: true
    })
);

app.use(
    clientSessions({
        cookieName: 'session', // cookie name dictates the key name added to the request object
        secret: process.env.CW_COOKIE_SECRET, // should be a large unguessable string
        duration: DURATION_LIMIT, // how long the session will stay valid in ms
        cookie: {
            ephemeral: true, // when true, cookie expires when the browser closes
            httpOnly: true, // when true, cookie is not accessible from javascript
            // TODO: create a proper environment variable for this situation.
            // TODO: replace all instances of process.env.NODE_ENV conditions with their own env vars.
            secureProxy: process.env.NODE_ENV === 'production' // when true, cookie will only be sent over SSL. use key 'proxySecure' instead if you handle SSL not in your node process
        }
    })
);

app.use(
    csrf({
        cookie: false,
        sessionKey: 'session'
    })
);

app.use((req, res, next) => {
    res.locals.nonce = nanoid();
    // https://stackoverflow.com/a/22339262/2952356
    // `process.env.npm_package_version` only works if you use npm start to run the app.
    res.set('Application-Version', process.env.npm_package_version);
    next();
});

app.use((req, res, next) => {
    res.locals.nonce = nanoid();
    // https://stackoverflow.com/a/22339262/2952356
    // `process.env.npm_package_version` only works if you use npm start to run the app.
    res.set('Application-Version', process.env.npm_package_version);
    next();
});

// passport.use(
//     new OpenIDConnectStrategy(
//         {
//             issuer: `${process.env.CW_GOVUK_ISSUER_URL}/`,
//             authorizationURL: `${process.env.CW_GOVUK_ISSUER_URL}/authorize`,
//             tokenURL: `${process.env.CW_GOVUK_ISSUER_URL}/token`,
//             userInfoURL: `${process.env.CW_GOVUK_ISSUER_URL}/userinfo`,
//             clientID: process.env.CW_GOVUK_CLIENT_ID,
//             clientSecret: process.env.CW_GOVUK_PRIVATE_KEY,
//             callbackURL: `${process.env.CW_URL}/account/signed-in`,
//             // scope: ['profile'],
//             nonce: 'test',
//             passReqToCallback: true
//         },
//         function verify(issuer, profile, cb, a, b, c, d) {
//             console.log({
//                 issuer,
//                 profile,
//                 cb,
//                 a,
//                 b,
//                 c,
//                 d
//             });
//             return cb(null, profile);
//         }
//     )
// );

// async function authenticationSetUp() {
//     app.use(passport.initialize());
//     app.use(passport.session());
//     const issuer = await Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);

//     const client = new issuer.Client(
//         {
//             client_id: process.env.CW_GOVUK_CLIENT_ID,
//             client_secret: process.env.CW_GOVUK_PRIVATE_KEY,
//             redirect_uris: [`${process.env.CW_URL}/account/signed-in`],
//             post_logout_redirect_uris: [`${process.env.CW_URL}/account/signed-out`],
//             response_types: ['code'],
//             token_endpoint_auth_method: issuer.token_endpoint_auth_methods_supported[0],
//             // jwks_uri: issuer.jwks_uri,
//             token_endpoint: issuer.token_endpoint
//         } // ,
//         // {
//         //     keys: [
//         //         // {
//         //         //     kty: 'EC',
//         //         //     use: 'sig',
//         //         //     crv: 'P-256',
//         //         //     kid: 'ALdE4OMHn0Yz5kFVgm47q4iQv_KhKJhotSJJgXymAeU',
//         //         //     x: 'udx5m5olYgy8_rIMIw3iTzjD1U8gcs0oq9cy-3xO4As',
//         //         //     y: '-ch5DuOsvM65-yzLYBBeyhHtBlEmmk0WKRUI6FH6hh0',
//         //         //     alg: 'ES256'
//         //         // }
//         //         {
//         //             kty: 'RSA',
//         //             n: '4MwJMUaiiuLZXZZwFWfjdvtpFeUVdBUgRKRlBW5UqVcmR7ee9FZJjmYM2TNVx-5cHp0ilcTo0mv96aLnGLeT8l6T1oNbeNYg2Ot7Z_6oyyqNeizt9n58GkKIowsabJrtFIVDdr3OoQ1YTgkhYTNKSxSXSF2X-VOwuh0KnuxrQdWs_l1um7kowxRJPTHFKeSPgaG-0NQ4dRvpnHTWyD6pqzeezEopphXTjSIQQkKfRUiHgX-JPK0-Gp06pRQDTC3be0HGA9GOdnxdPOu4N9Z8bjs8zF5FdCre3TVX5vg6S0EdnOFqkpsWTmCdQ61Q8RLbc1tHF2Z-21pVufhYJHPu3w',
//         //             e: 'AQAB',
//         //             d: 'G0Fh0_Gmf4Rlqm01BcNk1uZApYDzCvIMyYXNIc1wwl9oqsVepm1X2cYRxLvuqKED1kpjCRmoyOqDDLLNpjeL3pUNA7NFge8kaGiUu9UqjgeIw8lyyLIpRd3PR0VvXL-kAxrtRRZaWTiO_lcpDunzFgtXFFUUugwln0sqIH61unN9qvfMzsCzswYlAFyLKT3rIVjlUPyVSgJMEvMNxbPj3lQZRNEf0eM7VSIl55J0JKaIV5hPqnmIVuzCbvRMtZTbf5ige_pYtBcZu2d93ruVpVWAwHDakOjupZVa9ZmcL6kgVeYyHodRVHAJJWKxt7LQuvHcs-T0I-Ohjf9GYOc58Q',
//         //             p: '8snU8nzioAShB5Y7DgptPfQ9taDmnQNBUI2T7PgsURtYHZqaWHvv9bNXAfp5w1xpk50jzG_PID5vviT9DlsvrOVtuE8pbo8R-dJxHbCl9hT50ofACU95mIunguNSpfMF5rGrQ53-BE6elW3YJRR6W1dGA3IDm7S9uL3Qv-IrPSs',
//         //             q: '7QeTH7P0zdO4AflkAym9q2X0q8KmVVIJT39o-gaor7xFES06ZWWWZScAwtYLn28hrOFwDu3y1qUM5yY-Zt29pdb3z_UhHIoOQIpVtK5yr_Gr7F0uNu6E1DAMPGbLN2N3Ex_WdzfWW4b2fnqIlkuqE81jkGVZWY4aBYKrB6lDgx0',
//         //             dp: 'SVnhFEHW1jGP1RL2VI-h4Y3g9vbdtaI-IXAkuPthqD9yp78F0qXfIYRFTTu3feZ1nztijWlaUouKhw_1xFiYVswaEg0Yn2ZqL-f8dNPh0C8WKx0IT8fLHONUgJ7dYXXC2qfi7lLVY8e88bh2DP3a2a3MYU4Y-PnqN95hKxfRqHE',
//         //             dq: 'iSoZ_H2iC74aPKI6Ow5boSUWCpNQuA0KMEP11sIludSET2VR5r1747tHWHiPL0sbPLUUqL8QCSBoMBdUgyiMh7y3mVMsPxyxFK443J8a5TBAIj7l8Inkufm4CvgdX0ci8CE7dbANTtfyKszz362XlXAEztmndAikjE3KdVuBIw0',
//         //             qi: '10FTacKKO3JFm0bBImJGYn-1RrbarCSxBLMJz4e91nxfQ43pycePOqHrqh5lxXsanZhSQxhnxIyB8LaJzhb8BulDL6rJL3jtHmKUPKpjPAeva-ilPIPhCHIMtQ6x4pu990kqI_DlSvYFxpwslVnIFt6SqfdXD01dRoottfvupmQ'
//         //           }
//         //     ]
//         // }
//     );

//     // passport.use(
//     //     'oidc',
//     //     new Strategy({client, passReqToCallback: true}, (req, tokenSet, userinfo, done) => {
//     //         console.log('tokenSet', tokenSet);
//     //         console.log('userinfo', userinfo);
//     //         // do whatever you want with tokenset and userinfo
//     //         req.session.tokenSet = tokenSet;
//     //         req.session.userinfo = userinfo;

//     //         return done(null, tokenSet.claims());
//     //     })
//     // );

//     const codeVerifier = generators.codeVerifier();
//     // store the code_verifier in your framework's session mechanism, if it is a cookie based solution
//     // it should be httpOnly (not readable by javascript) and encrypted.

//     const codeChallenge = generators.codeChallenge(codeVerifier);

//     client.authorizationUrl({
//         scope: 'openid email profile',
//         resource: 'https://my.api.example.com/resource/32178',
//         code_challenge: codeChallenge,
//         code_challenge_method: 'S256'
//     });

//     app.use(async (req, res, next) => {
//         const params = client.callbackParams(req);
//         const tokenSet = await client.callback('https://client.example.com/callback', params, {
//             codeVerifier
//         });
//         console.log('received and validated tokens %j', tokenSet);
//         console.log('validated ID Token claims %j', tokenSet.claims());
//         next();
//     });

//     // passport.use(
//     //     'oidc',
//     //     new Strategy({client}, (tokenSet, userinfo, done) => {
//     //         console.log({tokenSet});
//     //         return done(null, tokenSet.claims());
//     //     })
//     // );

//     // passport.serializeUser((user, done) => {
//     //     done(null, user);
//     // });
//     // passport.deserializeUser((user, done) => {
//     //     done(null, user);
//     // });
// }

// // authenticationSetUp();

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/assets',
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'))
);
app.use(
    '/govuk-frontend/all.css',
    express.static(path.join(__dirname, '/public/stylesheets/all.css'))
);
app.use(
    '/govuk-frontend/all-ie8.css',
    express.static(path.join(__dirname, '/public/stylesheets/all-ie8.css'))
);
app.use(
    '/govuk-frontend/all.js',
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/all.js'))
);

app.use(async (req, res, next) => {
    try {
        if (!req.originalUrl.startsWith('/session') && req.session.questionnaireId) {
            const cookieExpiryService = createCookieService({
                req,
                res,
                cookieName: 'sessionExpiry'
            });

            if (cookieExpiryService.isSet('expires') && cookieExpiryService.isExpired()) {
                req.session.destroy();
                cookieExpiryService.set('expires', '');
                return next();
            }
            const response = await qService.keepAlive(req.session.questionnaireId);
            const sessionResource = response.body.data[0].attributes;
            cookieExpiryService.set({
                alive: sessionResource.alive,
                created: sessionResource.created,
                duration: sessionResource.duration,
                expires: sessionResource.expires
            });
        }
    } catch (err) {
        return res.status(403).render('500.badToken.njk');
    }

    return next();
});

// Suppression necessary as 'return' is needed to call res.end() end prevent the redirect throwing an error.
// eslint-disable-next-line consistent-return
app.use(['/apply', '/download'], async (req, res, next) => {
    if (!req.session.questionnaireId) {
        // no: set it and redirect.
        try {
            const response = await qService.createQuestionnaire();
            req.session.questionnaireId = response.body.data.attributes.id;
            const initialSection = formHelper.removeSectionIdPrefix(
                response.body.data.attributes.routes.initial
            );
            const baseUrl = req.baseUrl === '/download' ? '/apply' : req.baseUrl;
            let redirectionUrl = `${baseUrl}/${initialSection}`;
            // query param passed from Tempus launch page
            if (req.query.isCica) {
                redirectionUrl = `${redirectionUrl}?isCica=true`;
            }
            return res.redirect(redirectionUrl);
        } catch (err) {
            return res.status(404).render('404.njk');
        }
    }
    next(); // <-- important!
});

app.use('/download', downloadRouter);
app.use('/apply', applicationRouter);
app.use('/session', sessionRouter);
app.use('/account', accountRouter);
app.use('/', indexRouter);

app.use((err, req, res, next) => {
    if (err.name === 'CRNNotRetrieved') {
        return res.status(500).render('500.MBDown.njk');
    }
    if (err.name === 'DCSUnavailable') {
        return res.status(500).render('500.DCSDown.njk');
    }
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).render('500.badToken.njk');
    }

    return next(err);
});

module.exports = app;
