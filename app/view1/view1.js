'use strict';

define([ 
'angular',
'lib/dbpedia/dbpedia',
'angularRoute',
'lib/maps/atMaps'
],
function( 
	angular, 
	dbpedia ){
	
	angular.module( 'myApp.view1', [ 'ngRoute', 'dbpedia', 'atMaps' ])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.when('/view1', {
				templateUrl: 'view1/view1.html',
				controller: 'View1Ctrl'
			});
		}
	])

	.controller('View1Ctrl', [ 
		function(){}
	]);
});