'use strict';

function shouldShowLinks({sectionId, uiSchema, isAuthenticated}) {
    const defaultVisibility = {
        showSignInLink: !isAuthenticated,
        showBackLink: true
    };
    const uiSchemaLinks = uiSchema[sectionId]?.options?.links;
    if (uiSchemaLinks) {
        return {
            ...defaultVisibility,
            ...uiSchemaLinks
        };
    }
    return defaultVisibility;
}

module.exports = shouldShowLinks;
