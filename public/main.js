var css         	= require('./scss/main.scss');

var angular     	= require('angular');
var ngRoute     	= require('angular-route');
var ngResource  	= require('angular-resource');
var _ 				= require('lodash');

// Angular application
var todoApp     	= angular.module('todo', ['ngRoute', 'ngResource']);
var config      	= require('./config.js')(todoApp);
var services    	= require('./services.js')(todoApp);
var directives  	= require('./directives.js')(todoApp);
var controllers 	= require('./controllers.js')(todoApp);
