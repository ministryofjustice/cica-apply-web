'use strict';

const got = require('got');
const merge = require('lodash.merge');

function requestService() {
    function post(options) {
        let opts = {
            method: 'POST',
            headers: {
                accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            json: true,
            body: options.body,
            throwHttpErrors: false
        };
        opts = merge(opts, options);
        return got(opts.url, opts);
    }

    function get(options) {
        let opts = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json'
            },
            json: true,
            throwHttpErrors: false
        };
        opts = merge(opts, options);
        return got(opts.url, opts);
    }

    return Object.freeze({
        post,
        get
    });
}

module.exports = requestService;
