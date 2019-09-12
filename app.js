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

const app = express();

nunjucks.configure(
    [
        'node_modules/govuk-frontend/govuk/',
        'node_modules/govuk-frontend/govuk/components/',
        'index/',
        'questionnaire/',
        'page/'
    ],
    {
        autoescape: true,
        express: app
    }
);

app.use(helmet());
app.use(logger('dev'));
// https://expressjs.com/en/api.html#express.json
app.use(express.json());
// https://expressjs.com/en/api.html#express.urlencoded
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    clientSessions({
        cookieName: 'cicaSession', // cookie name dictates the key name added to the request object
        secret: process.env.CW_COOKIE_SECRET, // should be a large unguessable string
        duration: 15 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 15 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            ephemeral: true, // when true, cookie expires when the browser closes
            httpOnly: false, // when true, cookie is not accessible from javascript
            proxySecure: false // when true, cookie will only be sent over SSL. use key 'proxySecure' instead if you handle SSL not in your node process
        }
    })
);

const csrfProtection = csrf({
    cookie: false,
    sessionKey: 'cicaSession'
});

app.use(csrfProtection);

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
app.use('/', indexRouter);
app.use('/apply', applicationRouter);

app.use((err, req, res, next) => {
    if (err.name === 'EBADCSRFTOKEN') {
        return res.status(403).render('503.njk');
    }

    return next(err);
});

module.exports = app;
