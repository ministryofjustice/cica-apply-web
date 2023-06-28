'use strict';

const express = require('express');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const createAccountService = require('../account/account-service');
const createCookieService = require('../cookie/cookie-service');
const getQuestionnaireIdInSession = require('../questionnaire/utils/getQuestionnaireIdInSession');

const router = express.Router();

router.route('/keep-alive').get(async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const qService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const questionnaireId = getQuestionnaireIdInSession(req.session);
        const response = await qService.keepAlive(questionnaireId);
        const sessionResource = response.body?.data?.[0]?.attributes;
        if (sessionResource) {
            const cookieService = createCookieService({
                req,
                res,
                cookieName: 'sessionExpiry'
            });
            cookieService.set('expires', sessionResource.expires);
        }
        res.json(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
    }
});

module.exports = router;
