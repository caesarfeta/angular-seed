'use strict';
	
define([
'angular',
'angularRoute',
'view/specierch/specierch',
'view/view2/view2',
'view/canvas/canvas',
'lib/version/version',
'lib/common/atCommon'
], 
function( angular ){

	// Declare app level module which depends on views, and components
	
	angular.module( 'myApp', [
		'ngRoute',
		'myApp.view.specierch',
		'myApp.view2',
		'myApp.view.canvas',
		'myApp.version',
		'atCommon'
	])
	
	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.otherwise({ 
				redirectTo: '/specierch'
			});
		}
	]);
})
