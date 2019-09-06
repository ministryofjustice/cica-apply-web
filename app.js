'use strict';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const middleware = require('./middleware');
const errorHandler = require('./middleware/error-handler');

const app = express();

nunjucks.configure(
    [
        'node_modules/govuk-frontend/',
        'node_modules/govuk-frontend/components/',
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
app.use(middleware);

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

app.use('/assets', express.static(path.join(__dirname, '/node_modules/govuk-frontend/assets')));
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
    express.static(path.join(__dirname, '/node_modules/govuk-frontend/all.js'))
);
app.use('/', indexRouter);
app.use('/apply', applicationRouter);

app.use(errorHandler);

module.exports = app;
