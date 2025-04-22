'use strict';

const validToken = 'b2a86644-e996-4abf-8ef1-2dc3458fff17';
const defaults = {
    templateName: 'sexual-assault',
    templateVersion: undefined
};

function getFeatureFlagOptions(cookies) {
    const { featureFlag } = cookies;

    if (!featureFlag) {
        return {
            templateName: defaults.templateName,
            templateVersion: defaults.templateVersion
        };
    }

    let data;
    try {
        data = JSON.parse(featureFlag);
    } catch {
        const error = new Error('Malformed featureFlag cookie');
        error.name = 'BadRequest';
        error.statusCode = 400;
        throw error;
    }

    if (data.bearerAuth !== validToken) {
        const error = new Error('Invalid bearer token in featureFlag cookie');
        error.name = 'UnauthorizedError';
        error.statusCode = 401;
        throw error;
    }

    return {
        templateName: defaults.templateName || data.templateName,
        templateVersion: defaults.templateVersion || data.templateVersion
    };
}

module.exports = getFeatureFlagOptions;
