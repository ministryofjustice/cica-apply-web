'use strict';

const express = require('express');
const signInService = require('../govuk/sign-in/index')();

const router = express.Router();

router.get('/sign-in', async (req, res) => {
    try {
        // const redirectUri = req.protocol + '://' + req.get('host') + '/account/save';
        const redirectUri = 'http://127.0.0.1:6987/loggedIn';
        const url = await signInService.getServiceUrl(redirectUri);
        res.redirect(302, url);
    } catch (err) {
        console.log({err});
        next(err);
    }
});

router.get('*', (req, res) => {
    res.status(404).render('404.njk');
});

module.exports = router;
