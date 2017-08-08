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
      
      // specierch
      
      $routeProvider.when('/specierch', {
        template: [
          
          '<div class="specierch">',
            '<div scroll-stick class="controls">',
              '<p>Search for organisms with keywords like <span dbp-img-history></span>',
                '<dbp-img-search></dbp-img-search>',
              '</p>',
            '</div>',
            '<dbp-species></dbp-species>',
          '</div>',
          
        ].join(' '),
        controller: function(){}
      })
      
      // about
      
      $routeProvider.when( '/about', {
        template: [
          
          '<div style="margin-top:10px" class="about container">',
            '<img style="float:left; margin: 0 10px 10px 0" src="/app/assets/img/adam_tavares.jpg" />',
            '<p style="max-width: 800px">{{ ::blurb }}</p>',
            '<p>{{ ::contact }}</p>',
          '</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          function( $scope ){
            $scope.blurb = 'My name is Adam Tavares. I am a programmer, artist, and Nature enthusiast. I live in beautiful Providence, Rhode Island where I write software to explore data and generate beautiful images. I hope my site helps you uncover Nature\'s wonderful shapes, colors, and patterns.'
            $scope.contact = 'Contact me at adamtavares@gmail.com'
          }
        ]
      })
      
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
