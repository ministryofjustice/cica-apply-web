'use strict';

function getDashboardURI(pathOnly = false) {
    const uri = '/account/dashboard';
    if (pathOnly) {
        return uri;
    }
    return `${process.env.CW_URL}${uri}`;
}

module.exports = {getDashboardURI};
