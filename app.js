'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const clientSessions = require('client-sessions');
const csrf = require('csurf');
const {nanoid} = require('nanoid');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');
const addressFinderRouter = require('./address-finder/routes');
const createCookieService = require('./cookie/cookie-service');
const createTemplateEngineService = require('./templateEngine');

const app = express();

const templateEngineService = createTemplateEngineService(app);
templateEngineService.init();

const sessionDuration = Number.parseInt(process.env.CW_SESSION_DURATION, 10);

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
                    '*.googletagmanager.com',
                    "'sha256-pvPw+upLPUjgMXY0G+8O0xUf+/Im1MZjXxxgOcBQBXU='" // hash of the inline script used for jQuery.
                ],
                imgSrc: ["'self'", 'data:', '*.google-analytics.com', 'www.googletagmanager.com'],
                objectSrc: ["'none'"],
                frameSrc: ['*.ccng.bt.com'],
                connectSrc: ["'self'", '*.google-analytics.com']
                // https://www.therobinlord.com/ga4-is-being-blocked-by-content-security-policy/
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
        duration: sessionDuration, // how long the session will stay valid in ms
        activeDuration: sessionDuration, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
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
app.use(
    '/moj-frontend/all.js',
    express.static(path.join(__dirname, '/node_modules/@ministryofjustice/frontend/moj/all.js'))
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

app.use('/address-finder', addressFinderRouter);
app.use('/download', downloadRouter);
app.use('/apply', applicationRouter);
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
