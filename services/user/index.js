'use strict';

const createTokenService = require('../token');

function createUserService() {
    const tokenService = createTokenService();

    function isAuthenticated() {
        // ?
    }

    function getUserId() {
        return tokenService.getIdToken().sub;
    }

    return Object.freeze({
        isAuthenticated,
        getUserId
    });
}

module.exports = createUserService;
