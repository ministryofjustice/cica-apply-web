'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const createTemplateEngineService = require('../templateEngine');
const createDashboardService = require('../dashboard/dashboard-service');

const {getDashboardURI} = require('./utils/getActionURIs');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');
const isAuthenticated = require('./utils/isAuthenticated');

const router = express.Router();

router.get('/sign-in/success', requiresAuth(), (req, res, next) => {
    try {
        const expiryDate = new Date(
            new Date().setDate(new Date().getDate() + 31)
        ).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});

        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('authenticated-user-landing-page.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate,
            isAuthenticated: isAuthenticated(req)
        });
        // delete req.session.referrer;
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
        return next(err);
    }
});

router.get('/signed-out', (req, res, next) => {
    try {
        if (isAuthenticated(req)) {
            return res.redirect('/account');
        }
        return res.render('signed-out.njk');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
        return next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const dashboardService = createDashboardService();
        const templateData = await dashboardService.getTemplateData(req.oidc.user.sub);
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            nonce: res.locals.nonce,
            userData: templateData,
            isAuthenticated: isAuthenticated(req)
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {
            isAuthenticated: isAuthenticated(req)
        });
        return next(err);
    }
});

router.get('/*', (req, res) => {
    if (req?.session?.referrer) {
        res.redirect('/account/sign-in/success');
    }
    res.redirect(getDashboardURI(true));
});

module.exports = router;
