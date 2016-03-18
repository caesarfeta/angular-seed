'use strict';

define([
'angular',
'jquery',
'color-thief'
], 
function( angular, $, ColorThief ){
	
	angular.module( 'atColor', [] )
	
	// build a strip of color swatches
	
	.directive( 'swatchStrip',[
		'$http',
		function( $http ){
			return {
				scope: {
					swatchStrip: '@'
				},
				link: function( scope, elem ){
					
					var colorThief = new ColorThief();
					$http.get( scope.swatchStrip ).then(
						function( data ){
							console.log( data )
						}
					);
					
				}
			}
		}
	])
});