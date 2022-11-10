'use strict';

const fs = require('fs');
const path = require('path');

function createAccountsDAL() {
    function getBDBasePath() {
        return path.resolve(__dirname, '../../', 'stuff/db/');
    }
    function getFullPath(property) {
        return `${getBDBasePath()}/${property}.txt`;
    }
    function get(property) {
        return fs.readFileSync(getFullPath(property), 'utf8');
    }

    function set(property, value) {
        fs.writeFileSync(getFullPath(property), value);
    }

    return Object.freeze({
        get,
        set
    });
}

module.exports = createAccountsDAL;
