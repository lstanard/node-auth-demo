var path 				= require('path');
var extractTextPlugin 	= require('extract-text-webpack-plugin');
var autoprefixer 		= require('autoprefixer');

// Plugins
var plugins = [
	new extractTextPlugin('../css/[name].css', { allChunks: true })
]

// Loaders
var loaders = [
	{
		test: /\.scss$/,
		loader: extractTextPlugin.extract('style', 'css!sass!postcss')
	},
	{
		test: /\.svg/,
		loader: 'svg-url-loader'
	}
]

module.exports = {
	entry: {
		"main": "./public/main.js"
	},
	plugins: plugins,
	output: {
		path: __dirname + '/public/assets/js/',
		filename: "[name].entry.js"
	},
	module: {
		loaders: loaders
	},
	postcss: function () {
		return [autoprefixer];
	}
};