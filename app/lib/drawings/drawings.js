define([
'angular',
'lodash',
'Masonry',
'../utils/utils'
],
function(
  angular,
  _,
  Masonry,
  utils ){
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
                item.id = utils.sha( item.label )
                return item
              })
              return yes( list )
            },
            function( e ){
              return no()
            }
          )
        })
      }
      self.withId = function( _id ){
        return $q( function( yes, no ){
            self.get().then(
              function( list ){
                var found = _.find( list, function( item ){
                  return item.id == _id
                })
                return ( !!found ) ? yes( found ) : no( found )
              }
            )
        })
      }
    }
  ])
  .directive( 'drawingFull', [
    'drawingsData',
    function( drawingsData ){
      return {
        scope: {
          drawingFull: '='
        },
        template: [
          
          '<div ng-if="!!item" class="container"><div class="row"><div class="cols12">',
            
            // files
            
            '<div ng-repeat="file in item.files">',
              '<a href="{{ ::file }}">',
                '<img max-width="100%" ng-src="./lib/drawings/img/{{ ::file }}" />',
              '</a>',
            '</div>',
            
            '<div class="lsysDisplay">',
              '<label>{{ ::item.label }}</label>',
              '<p>{{ ::item.description }}</p>',
                      '<div class="pull-right">{{ ::item.medium }}<span ng-if="!!item.date>, {{ ::item.date }}</span></div>',
          '</div>',
            
          '</div></div></div>'
          
        ].join(' '),
        link: function( scope, elem ){
          drawingsData.withId( scope.drawingFull ).then(
            function( item ){
              scope.item = item
            }
          )
        }
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
                      '<a href="" ng-click="goTo( item.id )">',
                        '<img style="width:320px" ng-src="./lib/drawings/img/thumb/{{ ::file }}" img-onload="masonry.layout() " />',
                      '</a>',
                    '</div>',
                    
                    '<div class="lsysDisplay">',
                      '<label>{{ ::item.label }}</label>',
                      '<p>{{ ::item.description }}</p>',
                      '<div class="pull-right">{{ ::item.medium }}<span ng-if="!!item.date">, {{ ::item.date }}</span></div>',
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
            scope.goTo = function( id ){
              $location.url( '/image/' + id )
            }
            function init( data ){
              scope.paginator = new paginator({
                list: data,
                perPage: 12,
                updateUrl: true,
                currentPage: scope.drawingsList,
                onClick: function(){
                  $timeout( function(){ relayout() })
                }
              })
            $timeout( function(){ relayout() })
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