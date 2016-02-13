'use strict';

define([
'angular',
'jquery'
], 
function( angular, $ ){
	
	angular.module( 'imgKit', [] )
	
	// run function on input enter
	
	.directive( 'imgKit', function(){
			return {
				template: '<div class="img-kit-menu"><ng-transclude></ng-transclude></div>',
				replace: true,
				transclude: true,
				link: function( scope, elem ){
					
				}
			}
	})
})
	