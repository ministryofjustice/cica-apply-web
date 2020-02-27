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

router.get('/transition', (req, res) => {
    res.render('transition.njk');
});

router.get('/new-claim', (req, res) => {
    res.render('new-claim.njk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk');
});

router.get('/transition-not-british-citizen', (req, res) => {
    res.render('transition-not-british-citizen.njk');
});

router.get('/transition-not-sa', (req, res) => {
    res.render('transition-not-sa.njk');
});

router.get('/transition-someone-else', (req, res) => {
    res.render('transition-someone-else.njk');
});

router.get('/transition-under-18', (req, res) => {
    res.render('transition-under-18.njk');
});

router.get('*', (req, res) => {
    res.render('404.njk');
});

module.exports = router;
