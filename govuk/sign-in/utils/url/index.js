'use strict';

const {URL} = require('url');

function build(
    base,
    urlParts = {
        search: {}
    }
) {
    const builtUrl = new URL(base);
    Object.keys(urlParts.search).forEach(paramKey => {
        builtUrl.searchParams.set(paramKey, urlParts.search[paramKey]);
    });
    return builtUrl.toString();
}

module.exports = {
    build
};
