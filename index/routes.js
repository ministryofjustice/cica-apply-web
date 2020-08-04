'use strict';

const express = require('express');
const createDateHelper = require('./dateHelper');

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
    const dateHelper = createDateHelper();
    const currentTime = `2020-01-01T${dateHelper.getFullTime(new Date())}Z`;
    const liveChatStartTime = `2020-01-01T${process.env.CW_LIVECHAT_START_TIME}Z`;
    const liveChatEndTime = `2020-01-01T${process.env.CW_LIVECHAT_END_TIME}Z`;
    let liveChatActive = false;

    if (
        dateHelper.isBetween(currentTime, liveChatStartTime, liveChatEndTime) &&
        dateHelper.includesToday(process.env.CW_LIVECHAT_ACTIVE_DAYS)
    ) {
        liveChatActive = true;
    }

    if (liveChatActive) {
        res.render('start-chat.njk');
    } else {
        res.render('chat-disabled.njk');
    }
});

router.get('/chat', (req, res) => {
    const dateHelper = createDateHelper();
    const currentTime = `2020-01-01T${dateHelper.getFullTime(new Date())}Z`;
    const liveChatStartTime = `2020-01-01T${process.env.CW_LIVECHAT_START_TIME}Z`;
    const liveChatEndTime = `2020-01-01T${process.env.CW_LIVECHAT_END_TIME}Z`;
    let liveChatActive = false;

    if (
        dateHelper.isBetween(currentTime, liveChatStartTime, liveChatEndTime) &&
        dateHelper.includesToday(process.env.CW_LIVECHAT_ACTIVE_DAYS)
    ) {
        liveChatActive = true;
    }

    if (liveChatActive) {
        res.render('chat-iframe.njk');
    } else {
        res.render('chat-disabled.njk');
    }
});

router.get('*', (req, res) => {
    res.render('404.njk');
});

module.exports = router;
