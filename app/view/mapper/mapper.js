'use strict';

define([ 
'angular',
'angularRoute'
],
function( angular ){
	
	angular.module( 'myApp.view.mapper', [ 'ngRoute' ])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			var std = {
				template: '<div>mapper</div>',
				controller: 'viewMapperCtrl'
			};
			$routeProvider.when('/mapper', std );
			$routeProvider.when('/mapper/:id', std );
		}
	])

	.controller('viewMapperCtrl', [ function(){} ])
	
});