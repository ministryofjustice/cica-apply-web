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
        res.status(404).render('404.njk');
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
        return res.redirect(`/${sectionId}`);
    } catch (err) {
        res.status(404).render('404.njk');
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
            console.log(sectionDetails.body);
            const html = formHelper.getSectionHtml(sectionDetails.body);
            res.send(html);
        } catch (err) {
            res.status(404).render('404.njk');
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
            res.status(404).render('404.njk');
            next(err);
        }
    });

module.exports = router;
