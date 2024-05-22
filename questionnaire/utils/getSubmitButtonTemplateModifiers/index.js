'use strict';

function getSubmitButtonTemplateModifiers(sectionId, uiSchema, isAuthenticated) {
    let submitButtonTemplateModifiers = {
        text: isAuthenticated ? 'Save and continue' : 'Continue',
        preventDoubleClick: true
    };

    const submitButtonUiSchema = uiSchema?.[sectionId]?.options?.submitButton;
    if (submitButtonUiSchema) {
        submitButtonTemplateModifiers = {
            ...submitButtonTemplateModifiers,
            ...submitButtonUiSchema
        };
    }

    return JSON.stringify(submitButtonTemplateModifiers);
}

module.exports = getSubmitButtonTemplateModifiers;
