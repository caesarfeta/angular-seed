'use strict';
	
define([
'angular',
'angularRoute',
'view1/view1',
'view2/view2',
'lib/version/version'
], 
function( angular ){

	// Declare app level module which depends on views, and components
	
	angular.module( 'myApp', [
		'ngRoute',
		'myApp.view1',
		'myApp.view2',
		'myApp.version'
	])
	
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.otherwise({ 
				redirectTo: '/view1'
			});
		}
	]);
})
