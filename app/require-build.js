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
		'angular' : {'exports' : 'angular'},
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
	}
});
require(['app']);