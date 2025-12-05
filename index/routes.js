'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk', {sectionId: 'cookies'});
});

router.get('/contact-us', (req, res) => {
    res.redirect(301, 'https://contact-the-cica.form.service.justice.gov.uk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk', {sectionId: 'police-forces'});
});

router.get('/accessibility-statement', (req, res) => {
    res.render('accessibility-statement.njk', {sectionId: 'accessibility-statement'});
});

router.get('*', (req, res) => {
    res.status(404).render('404.njk', {sectionId: 'page-not-found'});
});

module.exports = router;
