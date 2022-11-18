'use strict';

const {URL} = require('url');

function build(
    base,
    urlParts = {
        search: {}
    }
) {
    const builtUrl = new URL(base);
    if (Object.keys(urlParts.search).length) {
        builtUrl.search = new URLSearchParams(urlParts.search).toString();
    }
    return builtUrl.toString();
}

module.exports = {
    build
};
