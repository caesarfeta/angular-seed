define([
'angular',
'lodash'
],
function(
  angular,
  _ ){
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
    function(
      drawingsData,
      paginator,
      $location ){
        return {
          scope: {
            drawingsList: '='
          },
          template: [
            
            '<div ng-if="!!paginator.items()">',
              '<div class="lsysCard"',
                   'ng-repeat="item in paginator.items()">',
                
                // files
                
                '<div ng-repeat="file in item.files">',
                  '<a>',
                    '<img style="width:290px" ng-src="{{ ::file }}" />',
                  '</a>',
                '</div>',
                
                '<div class="lsysDisplay">',
                  '<label>{{ ::item.label }}</label>',
                  '<p>{{ ::item.description }}</p>',
                  '<div class="pull-right">{{ ::item.medium }}, {{ ::item.date }}</div>',
                '</div>',
                
              '</div>',
              
              // paginator buttons
              
              '<div class="clearfix"></div>',
              '<div paginator="paginator"></div>',
              
            '</div>'
            
          ].join(' '),
          link: function( scope, elem ){
            drawingsData.get().then(
              function( list ){
                scope.paginator = new paginator({
                  list: list,
                  perPage: 12,
                  updateUrl: true,
                  currentPage: scope.drawingsList
                })
              }
            )
          }
        }
      }
  ])
})