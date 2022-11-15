'use strict';

const express = require('express');
const createSignInService = require('../govuk/sign-in/index');

const router = express.Router();

router.get('/sign-in', async (req, res, next) => {
    try {
        const signInService = createSignInService();
        const redirectUri = `${req.protocol}://${req.get('host')}/account/signed-in`;
        const url = await signInService.getServiceUrl(redirectUri);
        return res.redirect(302, url);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
