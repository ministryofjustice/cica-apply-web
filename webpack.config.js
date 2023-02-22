'use strict';

const path = require('path');

module.exports = {
    mode: 'development',
    entry: [path.resolve(__dirname, 'src/js/scripts.babel.generated.js')],
    output: {
        path: path.resolve(__dirname, 'public/dist/js/'),
        filename: 'bundle.js'
    },
    devtool: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/core-js/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    }
};
