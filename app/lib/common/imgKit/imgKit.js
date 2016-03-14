'use strict';

define([
'angular',
'jquery'
], 
function( angular, $ ){
  
  angular.module( 'imgKit', [] )
  
  // run function on input enter
  
  .directive( 'imgKit', [ 
      '$location', 
      function( $location ){ return {
          template: [
            
            '<div ng-click="click()" class="img-kit">',
              '<span ng-show="isOn" class="launcher">',
                '<i ng-repeat="( key, url ) in toCanvas" ng-click="launch( key )" class="fa fa-{{ key }}"></i>',
              '</span>',
              '<ng-transclude></ng-transclude>',
            '</div>'
            
          ].join(''),
          replace: true,
          transclude: true,
          link: function( scope, elem ){
            
            scope.isOn = false;
            scope.click = function(){
              scope.isOn = !scope.isOn;
            };
          
            scope.toCanvas = {
              'bomb': 'bomb'
            };
          
            scope.launch = function( key ){
              $location.path( '/canvas/'+scope.toCanvas[ key ] );
            };
          }
      }}
  ])
	
	.service( 'imgData', [
		function(){
			this.process = function( src ){
				
			}
		}
	])
})