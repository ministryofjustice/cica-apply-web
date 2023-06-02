'use strict';

function shouldShowSignInLink(sectionId, uiSchema, isAuthenticated) {
    const defaultVisibility = !isAuthenticated;
    const isVisible = uiSchema[sectionId]?.options?.signInLink?.visible;
    if (isVisible !== undefined) {
        return isVisible;
    }
    return defaultVisibility;
}

module.exports = shouldShowSignInLink;
