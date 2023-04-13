'use strict';

const urls = {
    start: '/apply/start'
};

function getRedirectionUrl(type) {
    const redirectionUrl = urls[type];
    return redirectionUrl;
}

module.exports = getRedirectionUrl;
