'use strict';

function isValidExternalId(externalId) {
    if (typeof externalId !== 'string') {
        return false;
    }
    if (!externalId.startsWith('urn:uuid:')) {
        return false;
    }
    const uuid = externalId.replace('urn:uuid:', '');
    const uuidRegex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;
    return uuidRegex.test(uuid);
}

module.exports = isValidExternalId;
