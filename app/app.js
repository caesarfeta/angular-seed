define([
'angular',
'angularRoute',
'lib/specierch/specierch',
'lib/lsys/lsys',
'lib/threeD/threeD',
'lib/texturizer/texturizer',
'lib/vizque/vizque',
'lib/drawings/drawings'
], 
function( angular ){
  
  // Declare app level module which depends on views, and components
  
  angular.module( 'myApp', [
    'ngRoute',
    'myApp.view.specierch',
    'lsys',
    'threeD',
    'texturizer',
    'vizque',
    'drawings'
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
      
      $routeProvider.when( '/fungi/:page?', {
        template: [
          
          '<div class="fungi">',
              '<div dbp-fungi-genus-list></div>',
          '</div>'
          
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
      $routeProvider.when( '/fungi/filter/:filter/:page?', {
        template: [
          
          '<div class="fungi">',
            '<div dbp-fungi-genus-list></div>',
          '</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          '$routeParams',
          function(
            $scope,
            $routeParams ){
              $scope.filter = ( !!$routeParams.filter ) ? $routeParams.filter : ''
              $scope.page = ( !!$routeParams.page ) ? $routeParams.page : 1
          }
        ]
      })
      $routeProvider.when( '/fungi/genus/:genus*/:filter?', {
        template: [
          
          '<div class="fungi">',
            '<div dbp-fungi-species-list></div>',
          '</div>'
          
        ].join(' '),
        controller: [ 
          '$scope',
          '$routeParams',
          function(
            scope,
            $routeParams ){
            scope.genus = $routeParams.genus
            scope.filter = $routeParams.filter
          }
        ]
      })
      
      // specierch
      
      $routeProvider.when('/specierch/:term?/:page?', {
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
        controller: [
          '$scope',
          '$routeParams',
          'dbpediaSvc',
          '$location',
          function(
            scope,
            $routeParams,
            dbpedia,
            $location ){
            scope.term = ( !!$routeParams.term ) ? $routeParams.term : undefined
            scope.page = ( !!$routeParams.page ) ? $routeParams.page : undefined
            scope.dbpedia = dbpedia
            scope.reload = function(){
              $location.path( '/specierch/' + dbpedia.img.search )
            }
            if ( !!scope.term ){
              dbpedia.img.search = scope.term
              dbpedia.img.http().then( function(){
                if ( !!scope.page ){
                  dbpedia.img.paginator.currentPage = scope.page
                }
              })
            }
            else {
              scope.reload()
            }
          }
        ]
      })
      
      // threeD
      
      $routeProvider.when( '/threed/:id', {
        template: [
          
          '<div three-d="{{ ::id }}"></div>'
          
        ].join(' '),
        controller: [
          '$scope',
          '$routeParams',
          function( $scope, $routeParams ){
            $scope.id = $routeParams.id
          }
        ]
      })
      
      $routeProvider.when( '/threed/list/:page', {
        template: [
          
          '<div three-d-list="page"></div>'
          
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
      
      $routeProvider.when( '/image/:id', {
        template: [
          
          '<div drawing-full="id"></div>'
          
        ].join(' '),
        controller: [
          '$scope',
          '$routeParams',
          function(
            $scope,
            $routeParams ){
            $scope.id = ( !!$routeParams.id ) ? $routeParams.id : 1
          }
        ]
      })
      
      $routeProvider.when( '/images/list/:page', {
        template: [
          
          '<div class="fungi">',
            '<div drawings-list="page"></div>',
          '</div>'
          
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
      
      $routeProvider.when( '/texturizer', {
        template: [
          
          '<div texturizer></div>'
          
        ].join(' '),
        controller: [ function(){} ]
      })
      
      $routeProvider.when( '/vizque', {
        template: [
          
          '<div vizque></div>'
          
        ].join(' '),
        controller: [
          'vizque',
          '$scope',
          function(
            vizque,
            scope ){
            scope.vizque = vizque
          }
        ]
      })
      
      // about
      
      $routeProvider.when( '/about', {
        template: [
          
          '<div class="about container">',
            '<img src="assets/img/adam_tavares.jpg" />',
            '<div class="blurb">',
              '<p>My name is Adam Tavares. I live in lovely Providence, Rhode Island where I draw funny pictures and write code to explore data and generate patterns and structures. When I\'m not at my desk I\'m exploring forests and playing capoeira.</p>',
              '<p class="text-center">Contact me &mdash; <a href="mailto://adamtavares@gmail.com" target="_blank">adamtavares@gmail.com</a></p>',
              '<p class="text-center">See my photos and videos &mdash; <a href="http://instagram.com/adam.tavares" target="_blank">instagram.com/adam.tavares</a></p>',
              '<p class="text-center">I hope this site made you laugh and helped you discover Nature\'s wonderful shapes, colors, and patterns</p>',
            '</div>',
          '</div>'
          
        ].join(' ')
      })
      
      $routeProvider.otherwise({ 
        redirectTo: '/images/list/1'
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
