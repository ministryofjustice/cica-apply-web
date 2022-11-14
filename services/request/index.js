'use strict';

const got = require('got');
const merge = require('lodash.merge');

function post(url, options) {
    let opts = {
        url,
        method: 'POST',
        headers: {
            accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        throwHttpErrors: false
    };
    opts = merge(opts, options);
    return got(opts);
}

function get(url, options) {
    let opts = {
        url,
        method: 'GET',
        headers: {
            accept: 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
        },
        responseType: 'json',
        throwHttpErrors: false
    };
    opts = merge(opts, options);
    return got(opts);
}

module.exports = {
    post,
    get
};
