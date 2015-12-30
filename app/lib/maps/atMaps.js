'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('atMaps',[])
	.directive('atWorldMap', function(){
		return {
			restrict: 'E',
			replace: true,
			scope: {},
			link: function( scope, elem ){
//				new Datamap({ element: elem });
			}
		}
	})
});