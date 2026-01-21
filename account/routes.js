'use strict';

const express = require('express');
const {requiresAuth} = require('express-openid-connect');
const createTemplateEngineService = require('../templateEngine');
const getValidReferrerOrDefault = require('./utils/getValidReferrerOrDefault');
const {getDashboardURI} = require('./utils/getActionURIs');
const createAccountService = require('./account-service');
const createQuestionnaireService = require('../questionnaire/questionnaire-service');
const getQuestionnaireIdInSession = require('../questionnaire/utils/getQuestionnaireIdInSession');
const createDashboardService = require('../dashboard/dashboard-service');
const getSignInReturnTo = require('./utils/getSignInReturnToURI');

const router = express.Router();

router.get('/sign-in/success', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        const {render} = templateEngineService;

        const questionnaireId = getQuestionnaireIdInSession(req.session);
        const questionnaireServiceUnauthenticated = createQuestionnaireService({
            ownerId: accountService.getOwnerId()
        });
        if (questionnaireId) {
            await questionnaireServiceUnauthenticated.postSection(questionnaireId, 'owner', {
                'owner-id': req.oidc.user.sub,
                'is-authenticated': true
            });
        }

        const questionnaireServiceAuthenticated = createQuestionnaireService({
            ownerId: req.oidc.user.sub
        });
        const questionnaireMetadata = await questionnaireServiceAuthenticated.getQuestionnaireMetadata(
            questionnaireId
        );

        const expiryDate = new Date(
            questionnaireMetadata.body.data[0].attributes.expires
        ).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Europe/London'
        });

        accountService.setOwnerId(req.oidc.user.sub);
        const html = render('authentication-success.njk', {
            nextPageUrl: getValidReferrerOrDefault(req?.session?.referrer),
            expiryDate,
            isAuthenticated: accountService.isAuthenticated(req),
            cspNonce: res.locals.cspNonce,
            userId: accountService.getOwnerId(req),
            externalId: req.session.externalId,
            sectionId: 'authentication-success'
        });
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/auth', (req, res) => {
    return res.oidc.login({
        returnTo: getSignInReturnTo(req.session),
        authorizationParams: {
            redirect_uri: `${process.env.CW_URL}/account/signed-in`
        }
    });
});

router.get('/sign-in', (req, res) => {
    res.oidc.logout({
        returnTo: '/auth'
    });
});

router.get('/signed-in', requiresAuth(), (req, res, next) => {
    try {
        return res.redirect('/account/sign-in/success');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/sign-out', (req, res) => {
    res.clearCookie('session', {path: '/'});
    res.clearCookie('sessionExpiry', {path: '/'});
    res.oidc.logout();
});

router.get('/signed-out', (req, res, next) => {
    try {
        return res.render('signed-out.njk', {sectionId: 'signed-out'});
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/dashboard', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        accountService.setOwnerId(req.oidc.user.sub);
        const dashboardService = createDashboardService(req.oidc.user.sub);
        const applicationData = await dashboardService.getApplicationData();
        const displayStartedApplications = applicationData.length > 0;

        const {render} = templateEngineService;
        const html = render('dashboard.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            applicationData,
            displayStartedApplications,
            cspNonce: res.locals.cspNonce,
            currentUrlPathname: '/account/dashboard',
            sectionId: 'dashboard'
        });
        res.clearCookie('sessionExpiry', {path: '/'});
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk', {sectionId: 'page-not-found'});
        return next(err);
    }
});

router.get('/dashboard/manage', requiresAuth(), async (req, res, next) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        accountService.setOwnerId(req.oidc.user.sub);
        const dashboardService = createDashboardService(req.oidc.user.sub);
        const actionData = await dashboardService.getActionData();
        const displayActions = actionData.length > 0;

        const {render} = templateEngineService;
        const html = render('manage-applications.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            actionData,
            displayActions,
            cspNonce: res.locals.cspNonce,
            currentUrlPathname: '/account/dashboard/manage'
        });
        res.clearCookie('sessionExpiry', {path: '/'});
        return res.send(html);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/dashboard/manage/:caseReferenceNumber', async (req, res) => {
    try {
        const templateEngineService = createTemplateEngineService();
        const accountService = createAccountService(req.session);
        const questionnaireService = createQuestionnaireService({
            ownerId: accountService.getOwnerId(),
            isAuthenticated: accountService.isAuthenticated(req)
        });
        const caseReferenceNumber = req.params.caseReferenceNumber.replace('-', '\\');

        const allQuestionnairesMetadata = await questionnaireService.getAllQuestionnairesMetadata();
        const metadataCollection = (allQuestionnairesMetadata.body.data || []).map(metadatum => {
            return {
                questionnaireId: metadatum.attributes['questionnaire-id'],
                created: metadatum.attributes.created,
                modified: metadatum.attributes.modified,
                submissionStatus: metadatum.attributes['submission-status']
            };
        });

        const toDoLinks = [];
        const informationLinks = [];
        let applicantFirstName;
        let applicantLastName;

        // TODO: would be better if we weren't calling so many endpoints and instead had one endpoint that got all the data
        // This would reduce time and also mean we could use a forEach instead, guaranteeing that the items remain in the same order
        await Promise.all(
            metadataCollection.map(async questionnaireMetadata => {
                const {questionnaireId} = questionnaireMetadata;

                // Check that the questionnaire matches the page's CRN
                const submissionData = await questionnaireService.getSubmission(questionnaireId);
                const questionnaireCaseReferenceNumber =
                    submissionData.body.data.attributes.caseReferenceNumber;
                if (questionnaireCaseReferenceNumber !== caseReferenceNumber) {
                    return;
                }

                const submitted = questionnaireMetadata['submission-status'] === 'COMPLETED';
                const letterUnopened =
                    questionnaireMetadata.modified === questionnaireMetadata.created;

                // Get metadata stored in questionnaire
                const templateMetadata = await questionnaireService.getTemplateMetadata(
                    questionnaireId
                );
                const {summaryBlocks} = templateMetadata.body.data.attributes;

                const currentToDoLinks = [];
                const currentInformationLinks = [];

                // Add all valid todo blocks to list
                Object.keys(summaryBlocks).forEach(block => {
                    const link = summaryBlocks[block].link.replace(
                        '||questionnaireId||',
                        questionnaireId
                    );
                    if (summaryBlocks[block].condition === 'unopened' && letterUnopened === true) {
                        currentToDoLinks.push(link);
                    } else if (
                        summaryBlocks[block].condition === 'viewed' &&
                        letterUnopened === false
                    ) {
                        currentInformationLinks.push(link);
                    } else if (summaryBlocks[block].condition === 'submitted' && submitted) {
                        currentInformationLinks.push(link);
                    }
                });

                const personalisationData = templateMetadata.body.data.attributes.personalisation;
                if (personalisationData) {
                    applicantFirstName = personalisationData['first-name'];
                    applicantLastName = personalisationData['last-name'];
                }
                // TODO: This section of code is checking that a questionnaire is valid/resumable. How do we want to handle errors for it?
                const resumableQuestionnaireResponse = await questionnaireService.getCurrentSection(
                    questionnaireId
                );
                const resumableQuestionnaire =
                    resumableQuestionnaireResponse.body?.data?.[0]?.relationships?.section?.data
                        ?.id !== undefined;

                // add questionnaire tasks to list of tasks for this CRN
                if (resumableQuestionnaire) {
                    toDoLinks.push(...currentToDoLinks);
                    informationLinks.push(...currentInformationLinks);
                }
            })
        );
        const actionToDo = toDoLinks.length > 0;
        const informationToShow = informationLinks.length > 0;

        // redirect if valid.
        const {render} = templateEngineService;
        const html = render('todo.njk', {
            csrfToken: req.csrfToken(),
            isAuthenticated: accountService.isAuthenticated(req),
            caseReferenceNumber,
            applicantFirstName,
            applicantLastName,
            actionToDo,
            informationToShow,
            toDoLinks,
            informationLinks,
            cspNonce: res.locals.cspNonce,
            currentUrlPathname: `/account/dashboard/manage/${caseReferenceNumber}`
        });
        return res.send(html);
    } catch (err) {
        return res.redirect('/dashboard');
    }
});

router.get('/secure-link-login', requiresAuth(), async (req, res, next) => {
    try {
        const accountService = createAccountService(req.session);
        const ownerId = req.query.uid;
        const questionnaireId = req.query.qid;
        const questionnaireServiceUnauthenticated = createQuestionnaireService({
            ownerId
        });
        if (questionnaireId) {
            await questionnaireServiceUnauthenticated.postSection(questionnaireId, 'owner', {
                'owner-id': req.oidc.user.sub,
                'is-authenticated': true
            });
            accountService.setOwnerId(req.oidc.user.sub);

            return res.redirect(`/apply/resume/${questionnaireId}`);
        }

        // Else, redirect dashboard
        return res.redirect('/account/dashboard');
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

router.get('/*', (req, res) => {
    res.redirect(getDashboardURI());
});

module.exports = router;
