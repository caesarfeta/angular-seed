'use strict';

define([ 
'angular',
'lib/viz/vizTest',
'lib/viz/cubeTest'
],
function( angular ){
	
	angular.module( 'myApp.view.canvas', [])

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