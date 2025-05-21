'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const {csrf} = require('csrf-csrf');
const {nanoid} = require('nanoid');
const {auth} = require('express-openid-connect');
const createQuestionnaireService = require('./questionnaire/questionnaire-service');
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');
const addressFinderRouter = require('./address-finder/routes');
const accountRouter = require('./account/routes');
const createCookieService = require('./cookie/cookie-service');
const createTemplateEngineService = require('./templateEngine');
const isQuestionnaireInstantiated = require('./questionnaire/utils/isQuestionnaireInstantiated');
const getQuestionnaireIdInSession = require('./questionnaire/utils/getQuestionnaireIdInSession');
const createAccountService = require('./account/account-service');

const app = express();

const templateEngineService = createTemplateEngineService(app);
templateEngineService.init();

async function keepAlive(req, res, next) {
    try {
        if (!req.originalUrl.startsWith('/session') && isQuestionnaireInstantiated(req.session)) {
            const accountService = createAccountService(req.session);
            const questionnaireService = createQuestionnaireService({
                ownerId: accountService.getOwnerId()
            });
            const questionnaireId = getQuestionnaireIdInSession(req.session);
            const cookieExpiryService = createCookieService({
                req,
                res,
                cookieName: 'sessionExpiry'
            });

            if (cookieExpiryService.isSet('expires') && cookieExpiryService.isExpired()) {
                res.clearCookie('session');
                cookieExpiryService.set('expires', '');
                return next();
            }
            const response = await questionnaireService.keepAlive(questionnaireId);
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
}

const oidcAuth = auth({
    authRequired: false,
    auth0Logout: false,
    idpLogout: true,
    baseURL: `${process.env.CW_URL}/account`,
    clientID: process.env.CW_GOVUK_CLIENT_ID,
    clientAuthMethod: 'private_key_jwt',
    clientAssertionSigningKey: process.env.CW_GOVUK_PRIVATE_KEY,
    idTokenSigningAlg: 'ES256',
    issuerBaseURL: process.env.CW_GOVUK_ISSUER_URL,
    secret: process.env.CW_COOKIE_SECRET,
    session: {
        name: 'session',
        rolling: true,
        // `CW_SESSION_DURATION` is represented in ms for consistency.
        rollingDuration: process.env.CW_SESSION_DURATION / 1000,
        cookie: {
            transient: true,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        }
    },
    authorizationParams: {
        response_type: 'code',
        scope: 'openid'
    },
    routes: {
        // alternative is described here:
        // https://github.com/auth0/express-openid-connect/blob/master/EXAMPLES.md#3-route-customization
        // seems somewhat convoluted for what we need the callback for.
        // https://github.com/auth0/express-openid-connect/blob/master/examples/custom-routes.js
        callback: '/signed-in',
        login: false,
        logout: false,
        postLogoutRedirect: '/signed-out'
    },
    afterCallback: async (req, res, session) => {
        return {
            ...session,
            questionnaireId: req.session.questionnaireId,
            ownerId: req.session.ownerId
        };
    }
});

app.use((req, res, next) => {
    res.locals.cspNonce = nanoid();
    res.set('Application-Version', process.env.npm_package_version);
    next();
});

app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            xXssProtection: false,
            directives: {
                baseUri: ["'self'"],
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'strict-dynamic'",
                    // https://content-security-policy.com/unsafe-inline/
                    // "it is only ok to use unsafe-inline when it is combined with the strict-dynamic csp directive."
                    "'unsafe-inline'",
                    (req, res) => `'nonce-${res.locals.cspNonce}'`,
                    'https:'
                ],
                imgSrc: ["'self'", 'data:', '*.google-analytics.com', 'www.googletagmanager.com'],
                objectSrc: ["'none'"],
                frameSrc: ['*.ccng.bt.com'],
                connectSrc: ["'self'", '*.google-analytics.com'],
                // https://www.therobinlord.com/ga4-is-being-blocked-by-content-security-policy/
                formAction: ["'self'", '*.account.gov.uk']
            }
        },
        xFrameOptions: {action: 'deny'},
        strictTransportSecurity: {
            maxAge: 60 * 60 * 24 * 365,
            includeSubDomains: true
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

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/assets',
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/assets'))
);
app.use(
    '/govuk-frontend/all.css',
    express.static(path.join(__dirname, '/public/stylesheets/all.css'))
);

app.use(
    '/govuk-frontend/all.js',
    express.static(
        path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js')
    )
);

app.use(
    '/govuk-frontend/govuk-frontend.min.js.map',
    express.static(
        path.join(__dirname, '/node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map')
    )
);

app.use(
    '/moj-frontend/all.js',
    express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/all.js'))
);

app.use(
    csrf({
        cookieOptions: {
            key: 'request-config',
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'Lax'
        }
    })
);

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Surrogate-Control': 'no-store'
    });
    next();
});

app.use('/address-finder', addressFinderRouter);
app.use('/download', oidcAuth, downloadRouter);
app.use('/apply', oidcAuth, keepAlive, applicationRouter);
app.use('/session', oidcAuth, sessionRouter);
app.use('/account', oidcAuth, accountRouter);
app.use('/', oidcAuth, indexRouter);

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

    // express-openid-connect error.
    if (err.name === 'AggregateError') {
        if (/^Issuer.discover\(\) failed/.test(err.message)) {
            return res.status(500).render('oidc-provider-unreachable.njk', {
                backTarget: req?.session?.referrer
            });
        }
    }

    // Page not found, can also be as a result of session timeout
    if (err.name === 'PageNotFound') {
        // timeout handler
        const sessionExpiryCookie = req.cookies.sessionExpiry;
        if (sessionExpiryCookie) {
            if (JSON.parse(sessionExpiryCookie)?.alive === 'timed-out') {
                return res.status(302).render('302.ApplicationTimedOut.njk');
            }
            // has the application been submitted
            if (JSON.parse(sessionExpiryCookie)?.alive === false) {
                return res.status(302).render('302.SubmittedApplicationTimedOut.njk');
            }
        }

        // end timeout handler
        return res.status(err.statusCode || 404).render('404.njk');
    }
    return next(err);
});

module.exports = app;
