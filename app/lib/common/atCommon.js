'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('atCommon',[])
	
	// run function on input enter
	
	.directive('ngEnter', function(){
		return function( scope, elem, attrs ){
			elem.bind( "keydown keypress", function( e ){
				if ( e.which === 13 ){
					scope.$apply(
						function(){
							scope.$eval( attrs.ngEnter );
						}
					);
					e.preventDefault();
				}
			})
		}
	})
	
	// shrink a resource link
	
	.filter('shrinkLink', function(){
		return function( input ){
			if ( input == undefined ){ return '...' }
			if ( input.indexOf( 'http' ) == 0 ){
				return input.substr( input.lastIndexOf('/') + 1 )
			}
			return input
		}
	})
});