'use strict';

function getSignedInURI(pathOnly = false) {
    const uri = '/account/signed-in';
    if (pathOnly) {
        return uri;
    }
    return `${process.env.CW_URL}${uri}`;
}

function getSignedOutURI(pathOnly = false) {
    const uri = '/account/signed-out';
    if (pathOnly) {
        return uri;
    }
    return `${process.env.CW_URL}${uri}`;
}

module.exports = {getSignedInURI, getSignedOutURI};
