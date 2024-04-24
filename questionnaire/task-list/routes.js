'use strict';

const express = require('express');
const createQuestionnaireService = require('../questionnaire-service');
const createAccountService = require('../../account/account-service');
const formHelper = require('../form-helper');
const getQuestionnaireIdInSession = require('../utils/getQuestionnaireIdInSession');

const router = express.Router();

router.route('/').get(async (req, res, next) => {
    try {
        return res.redirect('/apply/task-list');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.route('/next').get(async (req, res, next) => {
    try {
        const accountService = createAccountService(req.session);
        const isAuthenticated = accountService.isAuthenticated(req);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated
        });

        const response = await questionnaireService.postSection(
            getQuestionnaireIdInSession(req.session),
            'p-task-list',
            {}
        );

        if (response.statusCode === 201) {
            const progressEntryResponse = await questionnaireService.getCurrentSection(
                getQuestionnaireIdInSession(req.session)
            );
            const nextSectionId = formHelper.removeSectionIdPrefix(
                progressEntryResponse.body.data[0].attributes.sectionId
            );

            return res.redirect(`/apply/${nextSectionId}`);
        }
        const err = Error(`Next section could not be retreived`);
        err.name = 'SectionNotFound';
        err.statusCode = 404;
        err.error = '404 Not Found';
        throw err;
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
