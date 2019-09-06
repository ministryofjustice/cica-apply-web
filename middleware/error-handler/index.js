'use strict';

// Central error handler
// https://www.joyent.com/node-js/production/design/errors
// https://github.com/i0natan/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md
module.exports = async (err, req, res, next) => {
    const error = {errors: []};

    if (err.name === 'EBADCSRFTOKEN') {
        error.errors.push({
            status: 403,
            title: 'Your session has expired',
            detail: err.message
        });

        // return res.status(403).json(error);
        return res.status(403).render('404.njk');
    }

    // Non-operational error
    return next(err);
};
