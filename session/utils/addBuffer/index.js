'use strict';

const SESSION_DURATION_BUFFER = 30000;

function addBuffer(duration, buffer = SESSION_DURATION_BUFFER) {
    return duration - buffer;
}

module.exports = addBuffer;
