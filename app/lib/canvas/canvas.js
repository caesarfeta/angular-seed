define([ 
'angular',
'lib/viz/viz',
'angularRoute'
],
function( angular, viz ){
  angular.module( 'myApp.view.canvas', [ 'ngRoute' ])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      var std = {
        template: '<div canvas-cube-test />',
        controller: 'viewCanvasCtrl'
      }
      $routeProvider.when('/canvas', std )
      $routeProvider.when('/canvas/:id', std )
    }
  ])
  .controller('viewCanvasCtrl', [ function(){} ])
  .directive('canvasCubeTest', [
    function(){
      return {
        replace: true,
        link: function( scope, elem ){
          window.viz = new viz({ 
            elem: elem.get(0)
          })
        }
      }
    }
  ])
})