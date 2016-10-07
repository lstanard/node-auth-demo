var css         	= require('./scss/main.scss');

var angular     	= require('angular');
var ngRoute     	= require('angular-route');
var ngResource  	= require('angular-resource');
var ngAnimate       = require('angular-animate');
var ngDialog 		= require('ng-dialog');
var _ 				= require('lodash');

// Angular application
var todoApp     	= angular.module('todo', ['ngRoute', 'ngResource', 'ngAnimate', 'ngDialog']);
var config      	= require('./config.js')(todoApp);
var services    	= require('./services.js')(todoApp);
var directives  	= require('./directives.js')(todoApp);
var controllers 	= require('./controllers.js')(todoApp);
