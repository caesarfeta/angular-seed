'use strict';

define([
'angular',
'jquery'
], 
function( angular, $ ){
	
	angular.module('atColor',[])
	
	// build a strip of color swatches
	
	.directive( 'swatchStrip', function(){
		return {
			scope: {
				swatchStrip: '='
			},
			link: function( scope, elem ){
				
			}
		}
	})
	
	// extract significant colors
	
	.service( 'colorExtract', function( url ){
		
	});
});