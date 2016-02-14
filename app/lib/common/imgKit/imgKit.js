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
            
            '<div class="img-kit">',
              '<span class="launcher">',
                '<i ng-repeat="( key, url ) in toCanvas" ng-click="launch( key )" class="fa fa-{{ key }}"></i>',
              '</span>',
              '<ng-transclude></ng-transclude>',
            '</div>'
            
          ].join(''),
          replace: true,
          transclude: true,
          link: function( scope, elem ){
          
            scope.toCanvas = {
              'bomb': 'bomb'
            };
          
            scope.launch = function( key ){
              $location.path( '/canvas/'+scope.toCanvas[ key ] );
            };
          }
			}}
  ])
})