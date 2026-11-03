'use strict';

const {ensureSessionCorrelationId} = require('../../session/correlation-id');

function sessionCorrelationId(req, res, next) {
    if (req.oidc?.isAuthenticated() && req.session) {
        ensureSessionCorrelationId(req.session);
    }

    next();
}

module.exports = sessionCorrelationId;
