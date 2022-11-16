'use strict';

const express = require('express');

const addressFinder = require('./address-finder-service')();

const router = express.Router();

router.route('/postcode').get(async (req, res, next) => {
    try {
        const {postcode} = req.query;
        const response = await addressFinder.lookupPostcode(postcode);
        // this works from the front end
        return res.status(response.statusCode).send(response.body);
    } catch (err) {
        res.status(err.statusCode || 404).render('404.njk');
        return next(err);
    }
});

module.exports = router;
