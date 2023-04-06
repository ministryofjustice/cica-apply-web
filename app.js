'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const csrf = require('csurf');
const {nanoid} = require('nanoid');
const {auth} = require('express-openid-connect');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');
const addressFinderRouter = require('./address-finder/routes');
const createCookieService = require('./cookie/cookie-service');
const createTemplateEngineService = require('./templateEngine');
const isQuestionnaireInstantiated = require('./questionnaire/utils/isQuestionnaireInstantiated');

const app = express();

const templateEngineService = createTemplateEngineService(app);
templateEngineService.init();

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
        if (!req.originalUrl.startsWith('/session') && isQuestionnaireInstantiated(req.session)) {
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

const oidcConfig = {
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
        absoluteDuration: process.env.CW_SESSION_DURATION,
        name: 'session',
        cookie: {
            transient: true,
            httpOnly: true // ,
            // secure: true
        },
        rolling: true,
        rollingDuration: process.env.CW_SESSION_DURATION // Is this correct?
    },
    authorizationParams: {
        response_type: 'code',
        scope: 'openid'
    },
    routes: {
        callback: '/signed-in',
        login: '/sign-in',
        logout: '/sign-out',
        postLogoutRedirect: '/signed-out'
    },
    afterCallback: async (req, res, session) => {
        return {
            ...session,
            questionnaireId: req.session.questionnaireId
        };
    }
};

app.use(
    csrf({
        cookie: true,
        sessionKey: 'session'
    })
);

app.use('/address-finder', addressFinderRouter);
app.use('/download', downloadRouter);
app.use('/apply', auth(oidcConfig), applicationRouter);
app.use('/session', sessionRouter);
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
