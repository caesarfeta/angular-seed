define([
'angular',
'jquery'
], 
function( 
  angular, 
  $ ){
  
  angular.module( 'imgKit', [] )
  
  // run function on input enter
  
  .directive( 'imgKit', [ 
      '$location', 
      function( $location ){ return {
          scope: {
              'imgKit': '@'
          },
          template: [
            
            '<div ng-click="click()" class="img-kit">',
              '<span ng-show="isOn" class="launcher">',
                '<i ng-repeat="( key, url ) in toCanvas" ng-click="launchCanvas( key )" class="fa fa-{{ key }}"></i>',
                '<i ng-click="launchColorKit( imgKit )" class="fa fa-paint-brush"></i>',
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
            
            scope.launchColorKit = function( url ){
                $location.path( '/color-kit/go' ).search( 'img', url);
            }
          
            scope.toCanvas = {
              'bomb': 'bomb'
            };
          
            scope.launchCanvas = function( key ){
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