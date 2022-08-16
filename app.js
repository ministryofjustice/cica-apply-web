'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const session = require('express-session');
const csrf = require('csurf');
const {nanoid} = require('nanoid');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');

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
    .addGlobal('CW_SESSION_DURATION', process.env.CW_SESSION_DURATION)
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
                imgSrc: ["'self'", 'data:', 'www.google-analytics.com'],
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
    session({
        name: 'cicaSession',
        secret: process.env.CW_COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.APP_ENV === 'prod',
            httpOnly: true
        }
    })
);

app.use(
    csrf({
        cookie: false
    })
);

app.use('/apply', async (req, res, next) => {
    // download too?
    if (req?.session?.questionnaireId) {
        const response = await qService.keepAlive(req.session.questionnaireId);
        const sessionData = response.body.data;
        const sessionDuration = sessionData[0].attributes.duration;
        const bufferDuration = 30000;
        req.session.cookie.maxAge = sessionDuration - bufferDuration;
    }
    next();
});

// Suppression necessary as 'return' is needed to call res.end() end prevent the redirect throwing an error.
// eslint-disable-next-line consistent-return
app.use(['/apply', '/download'], async (req, res, next) => {
    // check if client sent cookie
    const cookie = req?.session?.questionnaireId;
    if (cookie === undefined) {
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
