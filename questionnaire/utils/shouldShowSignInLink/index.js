'use strict';

function shouldShowSignInLink(isAuthenticated, options) {
    let isVisible = !isAuthenticated;

    if (options?.signInLink?.visible !== undefined) {
        isVisible = options?.signInLink?.visible;
    }

    return isVisible;
}

module.exports = shouldShowSignInLink;
