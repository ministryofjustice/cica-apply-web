'use strict';

const express = require('express');
const createLiveChatHelper = require('./liveChatHelper');
const createAccountService = require('../account/account-service');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    const accountService = createAccountService(req.session);
    res.render('cookies.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

router.get('/contact-us', (req, res) => {
    const accountService = createAccountService(req.session);
    res.render('contact-us.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

router.get('/police-forces', (req, res) => {
    const accountService = createAccountService(req.session);
    res.render('police-forces.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

router.get('/accessibility-statement', (req, res) => {
    const accountService = createAccountService(req.session);
    res.render('accessibility-statement.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

router.get('/start-chat', (req, res) => {
    const accountService = createAccountService(req.session);
    if (process.env.CW_LIVECHAT_ALIVE !== 'true') {
        return res.render('chat-withdrawn.njk', {
            isAuthenticated: accountService.isAuthenticated(req)
        });
    }
    const liveChatHelper = createLiveChatHelper();
    if (
        process.env.CW_LIVECHAT_DISABLED !== 'true' &&
        liveChatHelper.isLiveChatActive(
            process.env.CW_LIVECHAT_START_TIMES,
            process.env.CW_LIVECHAT_END_TIMES
        )
    ) {
        return res.render('start-chat.njk', {
            isAuthenticated: accountService.isAuthenticated(req)
        });
    }
    return res.render('chat-disabled.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

router.get('/chat', (req, res) => {
    if (process.env.CW_LIVECHAT_ALIVE !== 'true') {
        return res.render('chat-withdrawn.njk');
    }
    const liveChatHelper = createLiveChatHelper();
    if (
        process.env.CW_LIVECHAT_DISABLED !== 'true' &&
        liveChatHelper.isLiveChatActive(
            process.env.CW_LIVECHAT_START_TIMES,
            process.env.CW_LIVECHAT_END_TIMES
        )
    ) {
        return res.render('chat-iframe.njk');
    }
    return res.render('chat-disabled.njk');
});

router.get('*', (req, res) => {
    const accountService = createAccountService(req.session);
    res.status(404).render('404.njk', {
        isAuthenticated: accountService.isAuthenticated(req)
    });
});

module.exports = router;
