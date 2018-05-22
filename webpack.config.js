/**
 *
 * Webpack config for CHOI-TRIE library
 *
 * Author : jbear; JI-WOONG CHOI
 * Contact : http://jbear.co
 * Copyright @ jbear
 *
**/
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './protogo.js',
    output: {
        path: __dirname,
        filename: 'protogo.min.js'
    },
	optimization: {
		minimizer: [
			new UglifyJsPlugin({ 
			cache: true,
			uglifyOptions: {
				compress: {
					drop_console:true
				}	
			}	
			} )
		]
	},
    mode: 'production',
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
