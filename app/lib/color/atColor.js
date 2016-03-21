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
				template:[ 
					'<span>',
						'<span ng-if="error">{{ error }}</span>',
						'<span ng-if="palette" ng-repeat="color in palette" color-swatch="color"></span>',
					'</span>'
				].join(''),
				link: function( scope, elem ){
					
					function refresh(){ $timeout( function(){} )};
					
					// get a color thief instance
					
					var c = colorThief();
					var thief = new c.ColorThief();
					
					// build the palette once the image is loaded
					
					scope.palette = null;
					var image = new Image();
					image.crossOrigin = "anonymous";
					image.onload = function(){
							
						try { scope.palette = thief.getPalette( this, 10, 5 ) }
						catch( e ){ 
							// console.log( e );
							scope.error = 'error retrieving palette';
							refresh();
							return
						}
						
						scope.palette.map( function( color ){
							return colorTo.hex( color );
						});
						refresh();
					}
					image.src = "http://localhost:5000/" + scope.swatchStrip;
				}
			}
		}
	])
	
});