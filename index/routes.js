'use strict';

const express = require('express');
const createLiveChatHelper = require('./liveChatHelper');
const createTemplateEngineService = require('../templateEngine');

const templateEngineService = createTemplateEngineService();
const {render} = templateEngineService;

const router = express.Router();

router.get('/', (req, res) => {
    res.redirect(301, 'https://www.gov.uk/claim-compensation-criminal-injury/make-claim');
});

router.get('/cookies', (req, res) => {
    return res.send(render('cookies.njk'));
});

router.get('/contact-us', (req, res) => {
    return res.send(render('contact-us.njk'));
});

router.get('/police-forces', (req, res) => {
    return res.send(render('police-forces.njk'));
});

router.get('/accessibility-statement', (req, res) => {
    return res.send(render('accessibility-statement.njk'));
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
        return res.send(render('start-chat.njk'));
    }
    return res.send(render('chat-disabled.njk'));
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
        return res.send(render('chat-iframe.njk'));
    }
    return res.send(render('chat-disabled.njk'));
});

router.get('*', (req, res) => {
    res.status(404).send(render('404.njk'));
});

module.exports = router;
