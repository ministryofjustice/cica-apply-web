const config = require('../../.eslintrc.js');

config.parserOptions = {
    ecmaVersion: 9,
    sourceType: "module",
    ecmaFeatures: {
        modules: true
    }
};

config.globals = {
    window: true,
    document: true,
    gtag: true,
    accessibleAutocomplete: true
};

module.exports = config;