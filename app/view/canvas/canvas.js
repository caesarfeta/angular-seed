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
			var std = {
				template: '<div canvas-cube-test />',
				controller: 'viewCanvasCtrl'
			};
			$routeProvider.when('/canvas', std );
			$routeProvider.when('/canvas/:id', std );
		}
	])

	.controller('viewCanvasCtrl', [ function(){} ])
	
	.directive('canvasCubeTest', [
		function(){
			return {
				restrict: 'EA',
				replace: true,
				link: [ 
					'$scope', 
					'$element', 
					function( scope, elem ){
						var viz = new cubeTest({ 
							elem: elem.get(0)
						});
					}
				]
			}
		}
	])
	
});