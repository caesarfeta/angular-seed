'use strict';

define([
'angular',
'jquery',
'lodash',
'color-thief'
], 
function( 
	angular, 
	$,
	_,
	colorThief ){
	
	angular.module( 'atColor', [] )


	// color conversion functions
		
	.service( 'colorTo', [
		function(){
			this.hex = function( rgb ){
				return "#" +
				("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2],10).toString(16)).slice(-2)
			}
		}
	])


	// build a strip of color swatches
	
	.directive( 'swatchStrip', [
		
		'$http',
		'colorTo',
		
		function( 
			$http,
			colorTo ){
			return {
				scope: {
					swatchStrip: '@'
				},
				link: function( scope, elem ){
					var c = colorThief();
					var thief = new c.ColorThief();
					$( scope.swatchStrip ).load( function(){
						scope.palette = thief.getPalette( this, 20, 5 ).map( function( color ){
							return colorTo.hex( color );
						});
						console.log( scope.palette );
					})
				}
			}
		}
	])
	
});