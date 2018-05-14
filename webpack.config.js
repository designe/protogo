/**
 *
 * Webpack config for Protogo library
 *
 * Author : jbear; JI-WOONG CHOI
 * Contact : http://jbear.co
 * Copyright @ jbear
 *
**/

module.exports = {
    entry: './protogo.js',
    output: {
        path: __dirname,
        filename: 'protogo.min.test.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
