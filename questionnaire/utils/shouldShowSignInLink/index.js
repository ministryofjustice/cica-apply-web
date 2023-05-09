'use strict';

function shouldShowSignInLink(sectionId, uiSchema) {
    const defaultVisibility = true;
    const isVisible = uiSchema[sectionId]?.options?.signInLink?.visible;
    if (isVisible !== undefined) {
        return isVisible;
    }
    return defaultVisibility;
}

module.exports = shouldShowSignInLink;
