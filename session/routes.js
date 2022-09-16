'use strict';

const express = require('express');
const qService = require('../questionnaire/questionnaire-service')();
const createCookieService = require('../cookie/cookie-service');
const addBuffer = require('./utils/addBuffer');

const router = express.Router();

router.route('/keep-alive').get(async (req, res) => {
    try {
        const response = await qService.keepAlive(req.session.questionnaireId);
        const sessionResource = response.body?.data?.[0]?.attributes;
        if (sessionResource) {
            const cookieService = createCookieService({
                req,
                res,
                cookieName: 'sessionExpiry'
            });
            cookieService.set('expires', addBuffer(sessionResource.expires));
        }
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

module.exports = router;
