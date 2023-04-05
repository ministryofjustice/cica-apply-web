'use strict';

function getFormSubmitButtonText(sectionId, uiSchema, isAuthenticated) {
    const defaultText = isAuthenticated ? 'Save and continue' : 'Continue';
    const customText = uiSchema?.[sectionId]?.options?.buttonText;
    if (customText) {
        return customText;
    }
    return defaultText;
}

module.exports = getFormSubmitButtonText;
