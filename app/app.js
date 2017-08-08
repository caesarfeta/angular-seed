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
      
      var plexvas = {
        template: [
          
          '<div class="container">',
            '<div class="row">',
              '<div class="col-xs-9" i-canvas="iCanvas"></div>',
              '<div class="col-xs-3" i-canvas-ctrl="iCanvas"></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          'iCanvas',
          function(
            $scope,
            iCanvas ){
            $scope.iCanvas = new iCanvas()
          }]
      }
      $routeProvider.when('/plexvas', plexvas )
      $routeProvider.when('/plexvas/:id', plexvas )
      
      // lsys
      
      $routeProvider.when( '/lsys/:id', {
        template: [
          
          '<div lsys-sketch="id"></div>'
          
        ].join(' '),
        controller: [
          '$scope',
          '$routeParams',
          function( $scope, $routeParams ){
            $scope.id = $routeParams.id
          }
        ]
      })
      
      $routeProvider.when( '/lsys/list/:page', {
        template: [
          
          '<div lsys-lib="page"></div>'
          
        ].join(' '),
        controller: [
          '$scope',
          '$routeParams',
          function(
            $scope,
            $routeParams ){
              $scope.page = ( !!$routeParams.page ) ? $routeParams.page : 1
          }
        ]
      })
      
      // fungi
      
      $routeProvider.when( '/fungi', {
        template: [
          
          '<div class="fungi">',
              '<div dbp-fungi-genus-list></div>',
          '</div>'
          
        ].join(' '),
        controller: function(){}
      })
      
      $routeProvider.when( '/fungi/:genus*', {
        template: [
          
          '<div class="fungi">',
            '<div dbp-fungi-species-list></div>',
          '</div>'
          
        ].join(' '),
        controller: [ 
          '$scope',
          '$routeParams',
          function( scope, $routeParams ){
            scope.genus = $routeParams.genus
          }
        ]
      })
      
      // about
      
      $routeProvider.when( '/about', {
        template: [
          
          '<div style="margin-top:10px" class="about container">',
            '<div class="row">',
              '<div class="col-md-3 col-xs-12">',
                '<img src="http://placehold.it/200x200" />',
              '</div>',
              '<div class="col-md-9 col-xs-12">',
                '<p>{{ ::blurb }}</p>',
                '<p>{{ ::contact }}</p>',
              '</div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          function( $scope ){
            $scope.blurb = 'My name is Adam Tavares. I am a programmer, artist, and Nature enthusiast. I write software to explore data and generate mathematical art. I hope my site helps you explore Nature\'s wonderful shapes, colors, and patterns.'
            $scope.contact = 'Contact me at adamtavares@gmail.com.'
          }
        ]
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
