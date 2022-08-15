'use strict';

const express = require('express');
const qService = require('../questionnaire/questionnaire-service')();

const router = express.Router();

router.route('/').get(async (req, res, next) => {
    try {
        const response = await qService.getSessionData(req.cicaSession.questionnaireId);
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.route('/keep-alive').get(async (req, res, next) => {
    try {
        const response = await qService.keepAlive(req.cicaSession.questionnaireId);
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

module.exports = router;
