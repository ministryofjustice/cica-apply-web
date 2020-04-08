'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const clientSessions = require('client-sessions');
const csrf = require('csurf');
const nanoid = require('nanoid');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');

const app = express();

nunjucks
    .configure(
        [
            'node_modules/@ministryofjustice/frontend/',
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
    .addGlobal('gaTrackingId', process.env.CW_GA_TRACKING_ID);

app.use((req, res, next) => {
    res.locals.nonce = nanoid();

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
                imgSrc: ["'self'", 'data:', 'www.google-analytics.com'],
                objectSrc: ["'none'"]
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
        cookieName: 'cicaSession', // cookie name dictates the key name added to the request object
        secret: process.env.CW_COOKIE_SECRET, // should be a large unguessable string
        duration: 15 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 15 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
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
        sessionKey: 'cicaSession'
    })
);

// Suppression necessary as 'return' is needed to call res.end() end prevent the redirect throwing an error.
// eslint-disable-next-line consistent-return
app.use('/apply', async (req, res, next) => {
    // check if client sent cookie
    const cookie = req.cicaSession.questionnaireId;
    if (cookie === undefined) {
        // no: set it and redirect.
        try {
            const response = await qService.createQuestionnaire();
            req.cicaSession.questionnaireId = response.body.data.attributes.id;
            const initialSection = formHelper.removeSectionIdPrefix(
                response.body.data.attributes.routes.initial
            );
            return res.redirect(`${req.baseUrl}/${initialSection}`);
        } catch (err) {
            res.status(404).render('404.njk');
            next(err);
        }
    }
    next(); // <-- important!
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/assets',
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/govuk/assets'))
);

app.use('/apply', applicationRouter);
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
