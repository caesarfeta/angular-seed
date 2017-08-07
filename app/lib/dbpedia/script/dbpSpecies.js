define([
'../module',
'Masonry'
], 
function(
  module,
  Masonry ){
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
              '<div img-kit="{{ species.img.value }}">',
                '<img ng-src="{{ species.img.value }}"/>',
              '</div>',
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
  .directive( 'dbpFungiSpeciesList', [
    'dbpediaSvc',
    '$timeout',
    function(
      dbpedia,
      $timeout ){
      return {
        scope: true,
        template: [
          
          '<div>',
            '<spinner spin-id="dbpedia-http"></spinner>',
            '<div class="container">',
              '<div ng-repeat="item in list">',
                '<div dbp-fungi-item></div>',
              '</div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.fungi = dbpedia.fungi
          function init(){
            scope.list = _.filter( dbpedia.fungi.result, function( item ){
              return item.genus == scope.genus
            })
          }
          if ( !dbpedia.fungi.result && !dbpedia.fungi.ready ){
            dbpedia.fungi.http().then( init )
          }
          else {
            init()
          }
          $timeout( function(){
            scope.masonry = new Masonry( $( '.container', elem ).get(0), {
              itemSelector: '.masonry-brick',
              columnWidth: 350
            })
          })
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
          
          '<div ng-model="item" class="item masonry-brick">',
            
            // link
            
            '<a href="{{ ::url( item.name ) }}" ng-if="!!item.count">',
              '<div class="title">',
                '<h2 class="name">{{ ::item.name }}</h2>',
                '<span>{{ ::item.count }}</span>',
              '</div>',
              '<img ng-src="{{ ::item.img }}" img-onload="masonry.layout()" />',
            '</a>',
            
            // no link
            
            '<div ng-if="!item.count">',
              '<h2>{{ ::item.name }}</h2>',
              '<img ng-src="{{ ::item.img }}" img-onload="masonry.layout()" />',
            '</div>',
            
            // comment
            
            '<div class="comment">{{ ::item.comment }}</div>',
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
    '$timeout',
    function(
      dbpedia,
      $timeout ){
      return {
        scope: {},
        template: [
          
          '<div class="container">',
            '<spinner spin-id="dbpedia-http"></spinner>',
            '<div ng-if="!!dbpedia.fungi.genus"',
                 'class="list">',
              '<div ng-repeat="item in dbpedia.fungi.paginator.items()">',
                '<div dbp-fungi-item></div>',
              '</div>',
            '</div>',
            '<div paginator="dbpedia.fungi.paginator"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          function init(){
            scope.masonry = new Masonry( $( '.list', elem ).get(0), {
              itemSelector: '.masonry-brick',
              columnWidth: 350
            })
          }
          dbpedia.fungi.http().then( function(){
            $timeout( function(){
              init()
              scope.$watch(
                function(){ return dbpedia.fungi.paginator.currentPage },
                function( n ){ 
                  $timeout( function(){ init() })
                }
              )
            })
          })
          scope.dbpedia = dbpedia
        }
      }
    }
  ])
  .directive( 'imgOnload', [
    function(){
      return {
        scope: {
          imgOnload: '&'
        },
        restrict: 'A',
        link: function( scope, elem ){
          elem.bind( 'load', function(){
            scope.imgOnload()
          })
        }
      }
    }
  ])
  .directive( 'moreText', [
    function(){
      return {
        transclude: true,
        restrict: 'E',
        template: [
          
          '<div>',
            
            // text
            
            '<span ng-if="!!open">',
              '<ng-transclude></ng-transclude>',
            '</span>',
            
            // more or less
            
            '<a ng-click="open=!open">',
              '<span ng-if="!open">more &#9660;</span>',
              '<span ng-if="!!open">&#9650; less</span>',
            '</a>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.open = false
        }
      }
    }
  ])
})