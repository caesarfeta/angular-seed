'use strict';

define([ 
'angular',
'components/dbpedia/dbpedia',
'components/dbpedia/dbpediaRelated',
'angularRoute',
],
function( 
	angular, 
	dbpedia, 
	dbpediaRelated ){
	
	angular.module( 'myApp.view1', [ 'ngRoute', 'dbpedia' ])

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
		'dbpedia',
		'dbpediaRelated',
		function( dbpedia, dbpediaRelated ){
			dbpedia.img( 'gold' );
			dbpediaRelated.check();
		}
	]);
});