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
				template: '<div canvas-cube-test />',
				controller: 'viewCanvasCtrl'
			});
		}
	])

	.controller('viewCanvasCtrl', [ function(){} ])
	
	.directive('canvasCubeTest', [
		function(){
			return {
				restrict: 'EA',
				replace: true,
				link: function( scope, elem ){
					var viz = new cubeTest({ 
						elem: elem.get(0)
					});
				}
			}
		}
	])
});