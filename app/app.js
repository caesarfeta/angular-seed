'use strict';
	
define([
'angular',
'angularRoute',
'view/specierch/specierch',
'view/mapper/mapper',
'view/view2/view2',
'view/canvas/canvas',
'lib/version/version',
'lib/common/atCommon',
'lib/windowWrap/windowWrap',
'threejs'
], 
function( angular ){

	// Declare app level module which depends on views, and components
	
	angular.module( 'myApp', [
		'ngRoute',
		'myApp.view.specierch',
		'myApp.view.canvas',
		'myApp.view.mapper',
		'myApp.view2',
		'myApp.version',
		'atCommon',
		'windowWrap'
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
