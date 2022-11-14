'use strict';

const url = require('url');

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

function getRefererURI(refererURL = 'http://cw.com/apply') {
    const parsedUrl = url.parse(refererURL);
    return parsedUrl.pathname;
}

function isValidRedirectionURI(uri) {
    return uri.startsWith('/apply');
}

module.exports = {getSignedInURI, getSignedOutURI, getRefererURI, isValidRedirectionURI};
