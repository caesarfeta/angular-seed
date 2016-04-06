define([
'angular',
'angularRoute',
'view/specierch/specierch',
'view/mapper/mapper',
'view/view2/view2',
'view/canvas/canvas',
'view/color-kit/color-kit',
'lib/version/version',
], 
function( angular ){
	
	angular.module( 'myApp.view.canvas' )
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			var std = {
				template: '<div canvas-cube-test />',
				controller: 'viewCanvasCtrl'
			};
			$routeProvider.when('/canvas', std );
			$routeProvider.when('/canvas/:id', std );
		}
	])
	
	angular.module( 'myApp.view.colorKit' )
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			var std = {
				templateUrl: 'view/color-kit/color-kit.html',
				controller: 'colorKitCtrl'
			};
			$routeProvider.when('/color-kit', std );
			$routeProvider.when('/color-kit/:go*', std );
		}
	])
	
	angular.module( 'myApp.view.mapper' )
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			var std = {
				templateUrl: 'view/mapper/mapper.html',
				controller: 'viewMapperCtrl'
			};
			$routeProvider.when('/mapper', std );
			$routeProvider.when('/mapper/:id', std );
		}
	])
	
	
	angular.module( 'myApp.view.specierch' )
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.when('/specierch', {
				templateUrl: 'view/specierch/specierch.html',
				controller: 'SpecierchCtrl'
			});
		}
	])

	// Declare app level module which depends on views, and components
	
	angular.module( 'myApp', [
		'ngRoute',
		'myApp.view.specierch',
		'myApp.view.canvas',
		'myApp.view.mapper',
		'myApp.view.colorKit',
		'myApp.view2',
		'myApp.version',
	])
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.otherwise({ 
				redirectTo: '/specierch'
			});
		}
	]);
	
	angular.element().ready( 
		function(){
			
			// bootstrap the app manually
			
			angular.bootstrap( document, ['myApp']);
		}
	);
})
