define([
'angular',
'angularRoute',
'lib/specierch/specierch',
'lib/mapper/mapper',
'lib/canvas/canvas',
'lib/color-kit/color-kit',
'lib/version/version',
'lib/atPixels/atPixels.angular'
], 
function( angular ){
  
  // Declare app level module which depends on views, and components
  
  angular.module( 'myApp', [
    'ngRoute',
    'myApp.view.specierch',
    'myApp.view.canvas',
    'myApp.view.mapper',
    'myApp.view.colorKit',
    'myApp.version',
    'atPixels'
  ])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      $routeProvider.otherwise({ 
        redirectTo: '/specierch'
      })
    }
  ])
  
  angular.element().ready( 
    function(){
      
      // bootstrap the app manually
      
      angular.bootstrap( document, [ 'myApp' ])
    }
  )
})
