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
	
	angular.module( 'myApp.view.specierch', [ 'ngRoute', 'dbpedia', 'atMaps' ])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.when('/specierch', {
				templateUrl: 'view/specierch/specierch.html',
				controller: 'SpecierchCtrl'
			});
		}
	])

	.controller('SpecierchCtrl', [ 
		function(){}
	]);
});