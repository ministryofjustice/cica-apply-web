'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const createTemplateEngineService = require('../templateEngine');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');
const {getDashboardURI} = require('./utils/getActionURIs');

const router = express.Router();

router.get('/sign-in/success', requiresAuth(), (req, res, next) => {
    try {
        const expiryDate = new Date(
            new Date().setDate(new Date().getDate() + 31)
        ).toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});

        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('authentication-success.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate
        });

        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/sign-in', (req, res) =>
    res.oidc.login({
        returnTo: '/account/sign-in/success',
        authorizationParams: {
            redirect_uri: `${process.env.CW_URL}/account/signed-in`
        }
    })
);

router.get('/signed-in', requiresAuth(), (req, res, next) => {
    try {
        return res.redirect('/account/sign-in/success');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/signed-out', (req, res, next) => {
    try {
        return res.redirect('https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const {render} = templateEngineService;
        const html = render('dashboard.njk');
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/*', (req, res) => {
    res.redirect(getDashboardURI());
});

module.exports = router;
