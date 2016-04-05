'use strict';

define([ 
'angular',
'lib/viz/cubeTest'
],
function( angular, cubeTest ){
	
	angular.module( 'myApp.view.canvas', [])

	.controller('viewCanvasCtrl', [ function(){} ])
	
	.directive('canvasCubeTest', [
		function(){
			return {
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