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
	
	.directive( 'colorSwatch',[
		function(){
			return {
				scope: {
					colorSwatch: '='
				},
				template: '<span ng-style="style()"></span>',
				link: function( scope, elem ){
					console.log( scope );
					scope.style = function(){
						return {
							display: 'inline-block',
							width: '25px',
							height: '25px',
							'background-color': scope.colorSwatch
						}
					}
				}
			}
		}
	])


	// build a strip of color swatches
	
	.directive( 'swatchStrip', [
		
		'$http',
		'colorTo',
		'$timeout',
		
		function( 
			$http,
			colorTo,
			$timeout ){
			
			return {
				scope: {
					swatchStrip: '@'
				},
				template: '<span ng-if="palette" ng-repeat="color in palette" color-swatch="color"></span>',
				link: function( scope, elem ){
					var c = colorThief();
					var thief = new c.ColorThief();
					scope.palette = null;
					$( scope.swatchStrip ).load( function(){
						scope.palette = thief.getPalette( this, 10, 5 ).map( function( color ){
							return colorTo.hex( color );
						});
						$timeout( function(){} );
					})
				}
			}
		}
	])
	
});