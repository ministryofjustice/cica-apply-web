'use strict';

const {randomUUID} = require('crypto');

function createSessionCorrelationId() {
    return randomUUID();
}

function ensureSessionCorrelationId(session) {
    if (!session.sessionCorrelationId) {
        Object.assign(session, {sessionCorrelationId: createSessionCorrelationId()});
    }

    return session.sessionCorrelationId;
}

module.exports = {
    createSessionCorrelationId,
    ensureSessionCorrelationId
};
