'use strict';

if( window.__karma__ ){
	var allTestFiles = [];
	var TEST_REGEXP = /spec\.js$/;
	var pathToModule = function( path ){
		return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
	};

	Object.keys( window.__karma__.files ).forEach(
		function( file ){
			if ( TEST_REGEXP.test(file) ){
				
				// Normalize paths to RequireJS module names.
				
				allTestFiles.push( pathToModule( file ));
			}
		}
	);
}

require.config({
	paths: {
		jquery: 'bower_components/jquery/dist/jquery',
		jqueryUi: 'bower_components/jquery-ui/jquery-ui.min',
		angular: 'bower_components/angular/angular',
		angularRoute: 'bower_components/angular-route/angular-route',
		angularMocks: 'bower_components/angular-mocks/angular-mocks',
		bootstrap: 'bower_components/angular-bootstrap/ui-bootstrap.min',
		'colorpicker.module': 'bower_components/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.min',
		text: 'bower_components/requirejs-text/text',
		d3: 'bower_components/d3/d3',
		topojson: 'bower_components/topojson/topojson',
		threejs: 'bower_components/threejs/build/three',
		stats: 'bower_components/Physijs/examples/js/stats',
		lodash: 'bower_components/lodash/dist/lodash'
	},
	shim: {
		'angular' : {
			deps:['jquery'],
			'exports' : 'angular'
		},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
		'bootstrap': {
			deps:['angular']
		},
		'colorpicker.module': {
			deps:['bootstrap']
		},
		'topojson': {'exports': 'topojson'},
		'threejs': {'exports': 'THREE'},
		'stats': {'exports': 'Stats'},
		'lodash': {'exports': 'lodash' },
		'jqueryUi': {
			deps: ['jquery']
		}
	},
	priority: [
		"angular"
	],
	deps: window.__karma__ ? allTestFiles : [],
	callback: window.__karma__ ? window.__karma__.start : null,
	baseUrl: window.__karma__ ? '/base/app' : '',
});
require(['app']);