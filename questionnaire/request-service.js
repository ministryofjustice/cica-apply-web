'use strict';

const axios = require('axios');
const merge = require('lodash.merge');

function requestService() {
    function post(options) {
        let opts = {
            method: 'POST',
            headers: {
                accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            validateStatus: () => true // never throw errors
        };
        opts = merge(opts, options);
        return axios(opts);
    }

    function get(options) {
        let opts = {
            method: 'GET',
            headers: {
                accept: 'application/vnd.api+json',
                'Content-Type': 'application/vnd.api+json'
            },
            validateStatus: () => true // never throw errors
        };
        opts = merge(opts, options);
        return axios(opts);
    }

    return Object.freeze({
        post,
        get
    });
}

module.exports = requestService;
