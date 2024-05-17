'use strict';

const express = require('express');
const qTransformer = require('q-transformer')();
const createQuestionnaireService = require('../questionnaire-service');
const createAccountService = require('../../account/account-service');
const formHelper = require('../form-helper');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const accountService = createAccountService(req.session);
        const isAuthenticated = accountService.isAuthenticated(req);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated
        });
        const response = await questionnaireService.getTaskList(req.session.questionnaireId);
        const taskListResource = response.body.data[0];

        const transformation = qTransformer.transform({
            schemaKey: taskListResource.type,
            schema: taskListResource.attributes
        });
        const html = formHelper.renderSection({
            transformation,
            isFinal: false,
            csrfToken: req.csrfToken(),
            cspNonce: res.locals.cspNonce,
            isAuthenticated,
            userId: accountService.getOwnerId(),
            analyticsId: req.session.analyticsId
        });

        return res.send(html);
    } catch (err) {
        return res.status(err.statusCode || 404).render('404.njk');
    }
});

module.exports = router;
