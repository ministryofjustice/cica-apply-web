'use strict';

const crypto = require('crypto');

function createAccountService(session) {
    const currentSession = session;

    function URN_UUID() {
        return `urn:uuid:${crypto.randomUUID()}`;
    }

    function getOwnerId() {
        return currentSession?.ownerId;
    }

    function generateOwnerId() {
        if (getOwnerId()) {
            return getOwnerId();
        }
        const ownerId = URN_UUID();
        currentSession.ownerId = ownerId;
        return ownerId;
    }

    function isAuthenticated(req) {
        return !!(req?.oidc.isAuthenticated() || req?.isAuthenticated);
    }

    return Object.freeze({
        getOwnerId,
        generateOwnerId,
        isAuthenticated
    });
}

module.exports = createAccountService;
