'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('atCommon',[])
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
});