define([ 
'angular',
'lib/dbpedia/dbpedia',
'lib/maps/atMaps'
],
function( 
	angular, 
	dbpedia ){
	
	angular.module( 'myApp.view.specierch', [ 'ngRoute', 'dbpedia', 'atMaps' ])
	.controller('SpecierchCtrl', [ 
		function(){}
	]);
});