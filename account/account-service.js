'use strict';

const crypto = require('crypto');

function createAccountService(session) {
    const currentSession = session;

    function URN_UUID() {
        return `urn:uuid:${crypto.randomUUID()}`;
    }

    function generateOwnerId() {
        const ownerId = URN_UUID();
        currentSession.ownerId = ownerId;
        return ownerId;
    }

    function getOwnerId() {
        if (!currentSession?.ownerId) {
            return generateOwnerId();
        }
        return currentSession?.ownerId;
    }

    function setOwnerId(id) {
        currentSession.ownerId = id;
    }

    function isAuthenticated(req) {
        return !!(req?.oidc.isAuthenticated() || req?.isAuthenticated);
    }

    return Object.freeze({
        getOwnerId,
        setOwnerId,
        isAuthenticated
    });
}

module.exports = createAccountService;
