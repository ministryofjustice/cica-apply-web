'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk');
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us.njk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk');
});

router.get('/accessibility-statement', (req, res) => {
    res.render('accessibility-statement.njk');
});

router.get('/start-chat', (req, res) => {
    res.render('start-chat.njk');
});

router.get('/chat', (req, res) => {
    res.render('chat-iframe.njk');
});

router.get('*', (req, res) => {
    res.render('404.njk');
});

module.exports = router;
