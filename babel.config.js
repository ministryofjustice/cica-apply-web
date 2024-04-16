'use strict';

const presets = [
    [
        '@babel/preset-env',
        {
            // debug: true,
            useBuiltIns: 'entry',
            corejs: 3.8,
            targets: {
                browsers: [
                    'last 2 versions', // Last 2 versions of all browsers
                    'ie >= 11', // Internet Explorer 11 and above
                    'not dead' // Exclude browsers that are considered "dead"
                ]
            }
        }
    ]
];

module.exports = {presets};
