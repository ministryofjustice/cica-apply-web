const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet');
const nunjucks = require('nunjucks');

const indexRouter = require('./index/routes');
const questionnaireRouter = require('./questionnaire/routes');

const middleware = require('./middleware');

const app = express();

nunjucks.configure(
    [
        'node_modules/govuk-frontend/',
        'node_modules/govuk-frontend/components/',
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
app.use(middleware);
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
app.use('/apply', questionnaireRouter);

// Central error handler
// https://www.joyent.com/node-js/production/design/errors
// https://github.com/i0natan/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md
app.use(async (err, req, res, next) => {
    const error = {errors: []};

    if (err.statusCode === 400) {
        error.errors.push({
            status: 400,
            title: err.error,
            detail: err.message
        });

        return res.status(400).render('error.njk', {error});
    }

    if (err.statusCode === 403) {
        error.errors.push({
            status: 403,
            title: err.error,
            detail: err.message
        });

        return res.status(403).render('error.njk', {error});
    }

    if (err.statusCode === 404) {
        error.errors.push({
            status: 404,
            title: err.error,
            detail: err.message
        });

        return res.status(404).render('error.njk', {error});
    }

    if (err.statusCode === 409) {
        error.errors.push({
            status: 409,
            title: err.error,
            detail: err.message
        });

        return res.status(409).render('error.njk', {error});
    }

    if (err.name === 'UnauthorizedError') {
        error.errors.push({
            status: 401,
            title: err.error,
            detail: err.message
        });

        return res.status(401).render('error.njk', {error});
    }

    if (err.name === 'EBADCSRFTOKEN') {
        error.errors.push({
            status: 403,
            title: err.error,
            detail: err.message
        });

        return res.status(403).render('error.njk', {error});
    }

    // Non-operational error
    return next(err);
});

module.exports = app;
