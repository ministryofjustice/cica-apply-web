'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const clientSessions = require('client-sessions');
const csrf = require('csurf');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const createErrorHandler = require('./services/error-handler');

const app = express();

nunjucks
    .configure(
        [
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

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
                    "'sha256-l1eTVSK8DTnK8+yloud7wZUqFrI0atVo6VlC6PJvYaQ='",
                    'www.googletagmanager.com',
                    'www.google-analytics.com',
                    "'sha256-JxKc3PDEbftP82Sl3MQrbaCswLzpU6eLZP8RfGY2xKk='"
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
    // no: set it and redirect.
    try {
        // check if client sent cookie
        const cookie = req.cicaSession.questionnaireId;
        if (cookie === undefined) {
            const response = await qService.createQuestionnaire();
            req.cicaSession.questionnaireId = response.body.data.attributes.id;
            const initialSection = formHelper.removeSectionIdPrefix(
                response.body.data.attributes.routes.initial
            );
            return res.redirect(`${req.baseUrl}/${initialSection}`);
        }
        next(); // <-- important!
    } catch (err) {
        next(err);
    }
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
app.use('/apply', applicationRouter);
app.use('/', indexRouter);

// Central error handler
// https://www.joyent.com/node-js/production/design/errors
// https://github.com/i0natan/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md
app.use((err, req, res) => {
    const errorHandler = createErrorHandler();
    const {status, templateName} = errorHandler.processError(err);
    return res.status(status).render(`${templateName}.njk`);
});

module.exports = app;
