'use strict';

function getTokenHeader(token) {
    return JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
}

module.exports = getTokenHeader;
