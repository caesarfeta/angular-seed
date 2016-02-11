'use strict';

define([ 
'angular',
'lib/viz/vizTest',
'lib/viz/cubeTest',
'angularRoute'
],
function( angular ){
	
	angular.module( 'myApp.view.canvas', [ 'ngRoute' ])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			$routeProvider.when('/canvas', {
				templateUrl: 'view/canvas/canvas.html',
				controller: 'viewCanvasCtrl'
			});
		}
	])

	.controller('viewCanvasCtrl', [ 
		function(){}
	]);
});