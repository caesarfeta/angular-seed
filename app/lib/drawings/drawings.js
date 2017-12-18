define([
'angular',
'lodash',
'Masonry'
],
function(
  angular,
  _,
  Masonry ){
  angular.module( 'drawings', [])
  .service( 'drawingsData', [
    '$http',
    '$q',
    function(
      $http,
      $q ){
      var self = this
      var list = undefined
      self.get = function( yes, no ){
        return $q( function( yes, no ){
          if ( !!list ){
            return yes( list )
          }
          $http.get( './lib/drawings/drawings.json' ).then(
            function( r ){
              list = r.data.map( function( item ){
                return item
              })
              return yes( list )
            },
            function( e ){
              console.log( e )
            }
          )
        })
      }
    }
  ])
  .directive( 'drawingsList', [
    'drawingsData',
    'paginator',
    '$location',
    '$timeout',
    function(
      drawingsData,
      paginator,
      $location,
      $timeout ){
        return {
          scope: {
            drawingsList: '='
          },
          template: [
            
            '<div>',
              
              // drawings container
              
              '<div class="container">',
                '<div ng-if="!!paginator.items()">',
                  '<div class="item masonry-brick"',
                       'ng-repeat="item in paginator.items()"',
                       'ng-if="!item.hide">',
                    
                    // files
                    
                    '<div ng-repeat="file in item.files">',
                      '<a>',
                        '<img style="width:320px" ng-src="{{ ::file }}" img-onload="masonry.layout() " />',
                      '</a>',
                    '</div>',
                    
                    '<div class="lsysDisplay">',
                      '<label>{{ ::item.label }}</label>',
                      '<p>{{ ::item.description }}</p>',
                      '<div class="pull-right">{{ ::item.medium }}, {{ ::item.date }}</div>',
                    '</div>',
                    
                  '</div>',
                '</div>',
              '</div>',
              
              // paginator
              
              '<div class="clearfix"></div>',
              '<div paginator="paginator"></div>',
              
            '</div>'
            
          ].join(' '),
          link: function( scope, elem ){
            function init( data ){
              scope.paginator = new paginator({
                list: data,
                perPage: 12,
                onClick: function(){
                  $timeout( function(){ relayout() })
                }
              })
            }
            drawingsData.get().then( function( data ){
              init( data )
            })
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
})