var path 				= require('path');
var extractTextPlugin 	= require('extract-text-webpack-plugin');
var autoprefixer 		= require('autoprefixer');
var liveReloadPlugin 	= require('webpack-livereload-plugin');

// Plugins
var plugins = [
	new extractTextPlugin('../css/[name].css', { allChunks: true }),
	new liveReloadPlugin({ appendScriptTag: true })
]

// Loaders
var loaders = [
	{
		test: /\.scss$/,
		loader: extractTextPlugin.extract('style', 'css!sass!postcss')
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