require.config({
	paths: {
		jquery: 'bower_components/jQuery/dist/jquery',
		angular: 'bower_components/angular/angular',
		angularRoute: 'bower_components/angular-route/angular-route',
		angularMocks: 'bower_components/angular-mocks/angular-mocks',
		text: 'bower_components/requirejs-text/text',
		d3: 'bower_components/d3/d3.min',
		topojson: 'bower_components/topojson/topojson',
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		}
	}
});

require([
'angular',
'app'
], 
function( angular, app ){
	angular.element().ready( 
		function(){
			angular.bootstrap( document, [ 'myApp' ]);
		}
	);
});