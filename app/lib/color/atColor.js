'use strict';

define([
'angular',
'jquery',
'color-thief'
], 
function( angular, $, ColorThief ){
	
	angular.module( 'atColor', [] )
	
	// build a strip of color swatches
	
	.directive( 'swatchStrip', function(){
		return {
			scope: {
				swatchStrip: '='
			},
			link: function( scope, elem ){
				var colorTheif = new ColorThief();
				console.log( colorTheif );
			}
		}
	})
});