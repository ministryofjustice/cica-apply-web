'use strict';

const path = require('path');
const fs = require('fs');

// poor man's globber.
function getArrayOfFileNamesAt(dirPath) {
    return fs
        .readdirSync(dirPath)
        .map(fileName => {
            if (!fileName.endsWith('.js')) {
                return false;
            }
            return `${dirPath}/${fileName}`;
        })
        .filter(Boolean);
}

module.exports = {
    mode: 'development',
    entry: [
        path.resolve(__dirname, 'node_modules/govuk-frontend/govuk/all.js'),
        path.resolve(__dirname, 'src/js/scripts.babel.generated.js'),
        ...getArrayOfFileNamesAt(path.resolve(__dirname, 'src/js/vendor'))
    ],
    output: {
        path: path.resolve(__dirname, 'public/dist/js/'),
        filename: 'bundle.js'
    },
    devtool: 'none',
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
