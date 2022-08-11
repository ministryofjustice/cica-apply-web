'use strict';

function isFilePath(string) {
    return /^([a-zA-Z0-9/-]*[.*].{0,4})$/.test(string);
}

module.exports = isFilePath;
