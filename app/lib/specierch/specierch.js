define([ 
'angular',
'lib/dbpedia/dbpedia',
'lib/maps/atMaps'
],
function( 
  angular, 
  dbpedia ){
  'use strict';
  angular.module( 'myApp.view.specierch', [ 
    'ngRoute',
    'dbpedia',
    'atMaps'
  ])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      $routeProvider.when('/specierch', {
        template: [
          '<div class="specierch">',
            '<div scroll-stick class="controls">',
              '<p>Search for organisms with keywords like <span dbp-img-history></span>!',
                '<dbp-img-search></dbp-img-search>',
              '</p>',
            '</div>',
            '<dbp-species></dbp-species>',
          '</div>',
        ].join(' '),
        controller: 'SpecierchCtrl'
      })
    }
  ])
  .controller( 'SpecierchCtrl', [ function(){} ])
})