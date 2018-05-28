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

export default () => (
{
    entry: './protogo.js',
    output: {
        path: __dirname,
        filename: 'protogo.min.js',
	libraryTarget: 'window',
	globalObject: 'this',
	library: 'Protogo'
    },
	optimization: {
		minimizer: [
			new UglifyJsPlugin({ 
			uglifyOptions: {
				mangle:{
					keep_fnames:true,
				},
				compress: {
					keep_fnames:true,
					dead_code:true,
					unused:true,
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
}
);
