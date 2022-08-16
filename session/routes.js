'use strict';

const express = require('express');
const qService = require('../questionnaire/questionnaire-service')();

const router = express.Router();

router.route('/').get(async (req, res) => {
    try {
        const response = await qService.getSessionData(req.session.questionnaireId);
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

router.route('/keep-alive').get(async (req, res) => {
    try {
        const response = await qService.keepAlive(req.session.questionnaireId);
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

module.exports = router;
