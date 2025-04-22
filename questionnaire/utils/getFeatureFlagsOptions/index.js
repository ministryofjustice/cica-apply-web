'use strict';

function getFeatureFlagsOptions(cookies) {
    const {featureFlags} = cookies;

    if (!featureFlags) {
        return {
            templateName: undefined,
            templateVersion: undefined
        };
    }

    let data;
    try {
        data = JSON.parse(featureFlags);
    } catch {
        const error = new Error('Malformed featureFlags cookie');
        error.name = 'BadRequest';
        error.statusCode = 400;
        throw error;
    }

    if (data.bearerAuth !== process.env.FEATURE_FLAGS_TOKEN) {
        const error = new Error('Invalid bearer token in featureFlags cookie');
        error.name = 'UnauthorizedError';
        error.statusCode = 401;
        throw error;
    }

    return {
        templateName: data.templateName,
        templateVersion: data.templateVersion
    };
}

module.exports = getFeatureFlagsOptions;
