'use strict';

function shouldShowSignInLink(sectionId, uiSchema, isAuthenticated, options) {
    let isVisible = !isAuthenticated;

    if (options?.signInLink?.visible !== undefined) {
        isVisible = options?.signInLink?.visible;
    } else if (uiSchema[sectionId]?.options?.signInLink?.visible !== undefined) {
        isVisible = uiSchema[sectionId]?.options?.signInLink?.visible;
    }

    return isVisible;
}

module.exports = shouldShowSignInLink;
