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
const passport = require('passport');
const {Issuer, Strategy} = require('openid-client');
const formHelper = require('./questionnaire/form-helper');
const qService = require('./questionnaire/questionnaire-service')();
const indexRouter = require('./index/routes');
const applicationRouter = require('./questionnaire/routes');
const downloadRouter = require('./download/routes');
const sessionRouter = require('./session/routes');
const accountRouter = require('./account/routes');
const createCookieService = require('./cookie/cookie-service');
const authorisation = require('./authorisation');

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

let client;

passport.use(
    'oidc',
    new Strategy({Issuer}, (tokenSet, userinfo, done) => {
        return done(null, tokenSet.claims());
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const issuer = awit Issuer.discover(process.env.CW_GOVUK_ISSUER_URL);

client = new issuer.Client({
    client_id: 'oidcCLIENT',
    client_secret: 'client_super_secret',
    redirect_uris: ['http://localhost:8080/login/callback'],
    response_types: ['code']
});

passport.use(
    'oidc',
    new Strategy({client, passReqToCallback: true}, (req, tokenSet, userinfo, done) => {
        console.log('tokenSet', tokenSet);
        console.log('userinfo', userinfo);
        // do whatever you want with tokenset and userinfo
        req.session.tokenSet = tokenSet;
        req.session.userinfo = userinfo;

        return done(null, tokenSet.claims());
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
