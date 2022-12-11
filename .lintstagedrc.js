const config = {
    '*.js': ['eslint --fix --color'],
    '*.{json,yml,yaml}': ['prettier --write']
};

module.exports = config;
