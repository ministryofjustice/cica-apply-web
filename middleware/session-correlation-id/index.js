'use strict';

const {ensureSessionCorrelationId} = require('../../session/correlation-id');

function sessionCorrelationId(req, res, next) {
    if (req.oidc?.isAuthenticated() && req.session) {
        ensureSessionCorrelationId(req.session);
        // Logout clears the session before the request-completion log is written.
        req.sessionLogContext = {
            ownerId: req.oidc.user?.sub || req.session.ownerId,
            sessionCorrelationId: req.session.sessionCorrelationId
        };
    }

    next();
}

module.exports = sessionCorrelationId;
