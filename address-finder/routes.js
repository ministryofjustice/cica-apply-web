'use strict';

const express = require('express');

const addressFinder = require('./address-finder-service')();

const router = express.Router();

router.route('/postcode').get(async (req, res, next) => {
    try {
        const {postcode} = req.query;
        const response = await addressFinder.lookupPostcode(postcode);
        return res.status(response.status).send(response.data);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
