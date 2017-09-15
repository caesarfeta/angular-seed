define([
'../module',
'Masonry'
], 
function(
  module,
  Masonry ){
  module
  .directive( 'dbpFungiSearchBar', [
    'dbpediaSvc',
    '$timeout',
    function( dbpedia, $timeout ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<div style="padding:25px 0">',
            '<span>Filter fungi with </span>',
            '<input class="dbpedia-search-input"',
                   'type="text"',
                   'ng-model="dbpedia.fungi.search"',
                   'ng-enter="dbpedia.fungi.filter()"',
                   'placeholder="a keyword" />',
          '</div>'
        
        ].join(' '),
        link: function( scope, elem ){
          scope.dbpedia = dbpedia
          $( window ).scroll( _.throttle( function(){
            var tp = $( elem ).get(0).getBoundingClientRect().top
            if ( tp < 0 ){
              $( elem ).addClass( 'scrollStick' )
            }
            else if ( window.pageYOffset == 0 ){
              $( elem ).removeClass( 'scrollStick' )
            }
          }, 500, { leading: true }))
        
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
    'dbpediaSvc',
    function(
      $location,
      dbpediaSvc ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<div ng-model="item" class="item masonry-brick">',
            
            // link
            
            '<a href="{{ ::url( item.name ) }}" ng-if="!!item.count">',
              
              // name and species count
              
              '<div class="title">',
                '<h2 class="name" ng-bind-html="item.name | highlight:dbpedia.fungi.search"></h2>',
                '<span>{{ ::item.count }}</span>',
              '</div>',
              
              // match count
              
              '<img ng-src="{{ ::item.img }}" img-onload="masonry.layout()" />',
            '</a>',
            
            // no link
            
            '<div ng-if="!item.count">',
              '<h2>{{ ::item.name }}</h2>',
              '<img ng-src="{{ ::item.img }}" img-onload="masonry.layout()" />',
            '</div>',
            
            // comment
            
            '<div class="comment" ng-bind-html="item.comment | highlight:dbpedia.fungi.search"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.dbpedia = dbpediaSvc
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
            '<div dbp-fungi-search-bar></div>',
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