'use strict';

const express = require('express');
const createLiveChatHelper = require('./liveChatHelper');

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    res.render('cookies.njk');
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us.njk');
});

router.get('/police-forces', (req, res) => {
    res.render('police-forces.njk');
});

router.get('/accessibility-statement', (req, res) => {
    res.render('accessibility-statement.njk');
});

router.get('/start-chat', (req, res) => {
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
        return res.render('start-chat.njk');
    }
    return res.render('chat-disabled.njk');
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
    res.status(404).render('404.njk');
});

module.exports = router;
