define([
'angular',
'./atPixels',
'../utils/utils'
], 
function( 
  angular,
  atPixels,
  utils ){
  'use strict';
  return angular.module( 'atPixels', [])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      $routeProvider.when('/pixels', {
        template: [
          '<div at-pixels-sample></div>'
        ].join(' '),
        controller: 'atPixelsCtrl'
      })
    }
  ])
  .controller( 'atPixelsCtrl', [ function(){} ])
  .directive( 'atPixelsGrid',[
    function(){
      return {
        scope: {
          atPixelsGrid: '='
        },
        replace: true,
        template: [
            
            '<div ng-repeat="row in ::rows track by $index">',
              '<span ng-repeat="pixel in ::row track by $index"',
                    'style="display:inline-block"',
                    'ng-style="::css( pixel )"></span>',
            '</div>',
          
        ].join(' '),
        link: function( scope ){
          scope.css = function( pixel ){
            return {
              'background-color': 'yellow',
              width: atPixelsGrid.config.size + 'px',
              height: atPixelsGrid.config.size + 'px'
            }
          }
          var clear = scope.$watch( 
            function(){ return scope.atPixelsGrid },
            function( n ){
              if ( !!n ){
                clear()
                scope.rows = _.chunk( 
                  scope.atPixelsGrid.grid.active().pixels,
                  scope.atPixelsGrid.grid.active().cols
                )
              }
            }
          )
        }
      }
    }
  ])
  .directive( 'atPixelsEdit',[
    function(){
      return {
        scope: {
          atPixelsEdit: '='
        },
        replace: true,
        template: [
          
        ].join(' ')
      }
    }
  ])
  .directive( 'atPixelsSample', [
    function(){
      return {
        scope: {},
        template: [
          
          '<span at-pixels-grid="sample"></span>'
          
        ].join(' '),
        link: function( scope ){
          var grid = new atPixels.Grid()
          grid.addFrame({
            cols: 16,
            pixels: utils.nTimes( 16*16, function( i ){
              return i
            })
          })
          scope.sample = {
            grid: grid,
            config: {
              size: 3
            }
          }
        }
      }
    }
  ])
})