'use strict';

define([ 
'angular',
'lib/viz/cubeTest',
'angularRoute'
],
function( angular, cubeTest ){
	
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
		function(){
			var viz = new cubeTest({ 
				elem: document.getElementById('canvas-container')
			});
		}
	]);
});