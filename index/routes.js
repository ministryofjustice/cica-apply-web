'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('consent.njk');
});

router.get('/start-page', (req, res) => {
    res.render('start-page.njk');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk');
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us.njk');
});

router.get('/new-claim', (req, res) => {
    res.render('new-claim.njk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk');
});

router.get('/accessibility-statement', (req, res) => {
    res.render('accessibility-statement.njk');
});

router.get('*', (req, res) => {
    res.render('404.njk');
});

module.exports = router;
