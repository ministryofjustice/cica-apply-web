'use strict';

const express = require('express');
const formHelper = require('./form-helper');
const qService = require('./questionnaire-service')();

const router = express.Router();

router.route('/').get(async (req, res, next) => {
    try {
        const response = await qService.getCurrentSection(req.cicaSession.questionnaireId);
        const responseBody = response.body;
        const initialSection = formHelper.removeSectionIdPrefix(
            responseBody.data[0].attributes.sectionId
        );
        res.redirect(`${req.baseUrl}/${initialSection}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        next(err);
    }
});

router.route('/previous/:section').get(async (req, res, next) => {
    try {
        const response = await qService.getPrevious(
            req.cicaSession.questionnaireId,
            req.params.section
        );
        const {sectionId} = response.body.data.attributes;
        if (sectionId.startsWith('p-')) {
            const prev = `${req.baseUrl}/${formHelper.removeSectionIdPrefix(sectionId)}`;
            return res.redirect(prev);
        }
        return res.redirect(`/apply/${sectionId}`);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router
    .route('/:section')
    .get(async (req, res, next) => {
        try {
            const sectionDetails = await qService.getSection(
                req.cicaSession.questionnaireId,
                req.params.section
            );
            const html = formHelper.getSectionHtml(sectionDetails);
            res.send(html);
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const body = formHelper.processRequest(req.body, req.params.section);
            const response = await qService.postSection(
                req.cicaSession.questionnaireId,
                req.params.section,
                body
            );
            const responseBody = response.body;
            const hasNextSection = responseBody.data[0].relationships.section.links.next;
            const nextSectionInclude = responseBody.included.filter(
                includes => includes.type === 'sections'
            );
            if (hasNextSection) {
                const nextSectionId = nextSectionInclude[0].attributes.id;
                const nextSection = formHelper.getNextSection(nextSectionId, req.query.next);
                res.redirect(`${req.baseUrl}/${nextSection}`);
            } else {
                const errorsInclude = responseBody.included.filter(
                    include => include.type === 'errors'
                );
                const html = formHelper.getSectionHtml(responseBody, body, errorsInclude);
                res.send(html);
            }
        } catch (err) {
            res.status(err.statusCode || 404).render('404.njk');
            next(err);
        }
    });

router.route('/submission/confirm').post(async (req, res, next) => {
    try {
        await qService.postSubmission(req.cicaSession.questionnaireId);
        const response = await qService.getSubmissionStatus(
            req.cicaSession.questionnaireId,
            Date.now()
        );
        if (response.submitted) {
            return res.redirect('/apply/confirmation');
        }
        const err = Error(`The service is currently unavailable`);
        err.name = 'HTTPError';
        err.statusCode = 503;
        err.error = '503 Service unavailable';
        res.status(err.statusCode).render('503.njk');
        return next(err);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
