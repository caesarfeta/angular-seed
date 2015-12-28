require.config({
	paths: {
		angular: 'bower_components/angular/angular',
		angularRoute: 'bower_components/angular-route/angular-route',
		angularMocks: 'bower_components/angular-mocks/angular-mocks',
		text: 'bower_components/requirejs-text/text'
	},
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps: ['angular'],
			'exports': 'angular.mock'
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