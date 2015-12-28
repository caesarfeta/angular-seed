'use strict';
	
define([ 
'angular',
'angularRoute'
],
function( angular ){

	angular.module( 'myApp.view2', ['ngRoute'])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.when('/view2', {
				templateUrl: 'view2/view2.html',
				controller: 'View2Ctrl'
			});
		}
	])

	.controller( 'View2Ctrl', [
		function(){}
	]);
	
});