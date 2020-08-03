'use strict';

const presets = [
    [
        '@babel/preset-env',
        {
            // debug: true,
            useBuiltIns: 'entry',
            corejs: 3,
            targets: {
                browsers: [
                    'defaults',
                    // 'maintained node versions',
                    'last 2 versions',
                    'ie >= 9',
                    'Safari >= 12',
                    'ios_saf >= 10',
                    'iOS >= 10'
                ]
            }
        }
    ]
];

module.exports = {presets};
