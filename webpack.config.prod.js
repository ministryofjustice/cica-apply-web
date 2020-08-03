'use strict';

const config = require('./webpack.config');

delete config.devtool;

module.exports = config;

// 'use strict';

// const TerserPlugin = require('terser-webpack-plugin');

// const config = require('./webpack.config');

// delete config.devtool;

// config.mode = 'production';

// config.optimization = {
//     minimize: true,
//     minimizer: [
//         // https://webpack.js.org/plugins/terser-webpack-plugin/#terseroptions
//         new TerserPlugin({
//             terserOptions: {
//                 compress: false,
//                 mangle: false,
//                 output: {
//                     comments: true
//                 },
//                 keep_classnames: true,
//                 keep_fnames: true
//             },
//             extractComments: false
//         })
//     ]
// };

// module.exports = config;
