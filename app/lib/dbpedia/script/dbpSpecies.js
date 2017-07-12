define([
'../module',
], 
function( module ){
  module
  .directive( 'dbpSpecies', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: [
          
          '<div class="dbpedia-bio-species-bg" ng-show="on()">',
            '<div class="dbpedia-bio-species clearfix"',
                 'ng-repeat="species in dbpedia.img.result">',
              '<h2 class="name" ng-bind-html="species.name.value | highlight:dbpedia.img.search"></h2>',
              '<div img-kit="{{ species.img.value }}"><img ng-src="{{ species.img.value }}"/></div>',
              '<table class="taxonomy">',
                '<tr><td>Kingdom</td><td>{{ species.kingdom.value | shrinkLink }}</td></tr>',
                '<tr><td>Phylum</td><td>{{ species.phylum.value | shrinkLink }}</td></tr>',
                '<tr><td>Class</td><td>{{ species.class.value | shrinkLink }}</td></tr>',
                '<tr><td>Order</td><td>{{ species.order.value | shrinkLink }}</td></tr>',
                '<tr><td>Family</td><td>{{ species.family.value | shrinkLink }}</td></tr>',
                '<tr><td>Genus</td><td>{{ species.genus.value | shrinkLink }}</td></tr>',
                '<tr><td>Species</td><td>{{ species.species.value | shrinkLink }}</td></tr>',
              '</table>',
              '<div class="abstract" ng-bind-html="species.abstract.value | highlight:dbpedia.img.search"></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.dbpedia = dbpedia
          scope.on = function(){
            return dbpedia.img.result != null && dbpedia.img.result.length > 0 && !dbpedia.waiting
          }
        }
      }
    }
  ])
  .config([
     '$routeProvider',
      function( $routeProvider ){
        $routeProvider.when( '/fungi', {
          template: [
            
            '<div dbp-fungi-genus-list></div>'
            
          ].join(' '),
          controller: function(){}
        })
        $routeProvider.when( '/fungi/:genus*', {
          template: [
            
            '<div dbp-fungi-species-list></div>'
            
          ].join(' '),
          controller: [ 
            '$scope',
            '$routeParams',
            function( scope, $routeParams ){
              scope.genus = $routeParams.genus
            }
          ]
        })
      }
  ])
  .directive( 'dbpFungiSpeciesList', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        scope: true,
        template: [
          
          '<div class="container">',
            '<div ng-repeat="item in ::list()">',
              '<div dbp-fungi-item></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.list = function(){
            return _.filter( dbpedia.fungi.result, function( item ){
              return item.genus == scope.genus
            })
          }
        }
      }
    }
  ])
  .directive( 'dbpFungiItem', [
    '$location',
    function( $location ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<div class="col-xs-4">',
            '<a href="{{ ::url( item.name ) }}">',
              '<h2>{{ ::item.name }}</h2>',
              '<img ng-src="{{ ::item.img }}" style="width:100%" />',
            '</a>',
            '<p>{{ ::item.comment }}</p>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.url = function( name ){
            return $location.absUrl() + '/' + name
          }
        }
      }
    }
  ])
  .directive( 'dbpFungiGenusList', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        scope: {},
        template: [
          
          '<div ng-if="!!dbpedia.fungi.genus"',
               'class="container">',
            '<div ng-repeat="item in dbpedia.fungi.genus">',
              '<div dbp-fungi-item></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          dbpedia.fungi.http()
          scope.dbpedia = dbpedia
        }
      }
    }
  ])
})