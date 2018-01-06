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
    '$location',
    '$timeout',
    function(
      dbpedia,
      $location,
      $timeout ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<div class="fungi-search-bar">',
            '<span class="input-spacer"></span>',
            '<div class="floater">',
              
              // input
              
              '<input class="dbpedia-search-input"',
                     'type="text"',
                     'ng-model="filter"',
                     'ng-enter="runFilter()"',
                     'placeholder="keyword" />',
              
              // button
              
              '<button class="btn btn-sm"',
                      'ng-click="runFilter()">',
                'filter',
              '</button>',
              
            '</div>',
            '<span class="clearfix"></span>',
          '</div>'
        
        ].join(' '),
        link: function( scope, elem ){
          scope.dbpedia = dbpedia
          scope.clear = function(){
            $location.path( '/fungi' )
          }
          scope.runFilter = function(){
            if ( !scope.filter ){
              scope.clear()
              return
            }
            $location.path( '/fungi/filter/' + scope.filter )
          }
          $( window ).scroll( _.throttle( function(){
            var tp = $( '.floater', elem ).get(0).getBoundingClientRect().top
            if ( tp < 0 ){
              $( '.floater', elem ).addClass( 'scrollStick' )
            }
            else if ( window.pageYOffset == 0 ){
              $( '.floater', elem ).removeClass( 'scrollStick' )
            }
          }, 500, { leading: true }))
        
        }
      }
    }
  ])
  .directive( 'dbpFungiSpeciesList', [
    'dbpediaSvc',
    '$timeout',
    'paginator',
    function(
      dbpedia,
      $timeout,
      paginator ){
      return {
        scope: true,
        template: [
          
          '<div>',
            '<spinner spin-id="dbpedia-http"></spinner>',
            '<div class="container">',
              '<div ng-repeat="item in paginator.items()">',
                '<div dbp-fungi-item></div>',
              '</div>',
            '</div>',
            '<div paginator="paginator"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.fungi = dbpedia.fungi
          function init(){
            scope.paginator = new paginator({
              list: _.filter( dbpedia.fungi.result, function( item ){
                return item.genus == scope.genus
              }),
              perPage: 12,
              onClick: function(){
                $timeout( function(){ relayout() })
              }
            })
          }
          if ( !dbpedia.fungi.result && !dbpedia.fungi.ready ){
            dbpedia.fungi.http().then( init )
          }
          else {
            init()
          }
          function relayout(){
            scope.masonry = new Masonry( $( '.container', elem ).get(0), {
              itemSelector: '.masonry-brick',
              columnWidth: 350
            })
          }
          $timeout( function(){ relayout() })
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
                '<h2 class="name" ng-bind-html="item.name | highlight:filter"></h2>',
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
            
            '<div class="comment" ng-bind-html="item.comment | highlight:filter"></div>',
            
            // wikipedia link
            
            '<a class="fa fa-external-link wiki-link"',
               'href="{{ item.url }}"',
               'title="{{ item.url }}">',
            '</a>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.dbpedia = dbpediaSvc
          scope.url = function( name ){
            var url = $location.absUrl()
            var i = url.indexOf( '#' ) + 1
            var newUrl = url.substring( 0, i ) + '/fungi/genus/' + name
            if ( !!scope.filter ) {
              newUrl = newUrl + '/' + scope.filter
            }
            return newUrl
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
        scope: true,
        template: [
          
          '<div dbp-fungi-search-bar></div>',
          '<div class="container">',
            '<spinner spin-id="dbpedia-http"></spinner>',
            '<div ng-if="!!dbpedia.fungi.genus"',
                 'class="list">',
              '<div ng-repeat="item in dbpedia.fungi.paginator.items()">',
                '<div dbp-fungi-item></div>',
              '</div>',
            '</div>',
            
            // paginator
            
            '<div paginator="dbpedia.fungi.paginator"></div>',
            
            // shoutout
            
            '<div pedia-shoutout></div>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          function init(){
            scope.masonry = new Masonry( $( '.list', elem ).get(0), {
              itemSelector: '.masonry-brick',
              columnWidth: 350
            })
          }
          dbpedia.fungi.http( scope.filter ).then( function(){
            dbpedia.fungi.paginator.currentPage = scope.page
            $timeout( function(){
              init()
            })
          })
          scope.dbpedia = dbpedia
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