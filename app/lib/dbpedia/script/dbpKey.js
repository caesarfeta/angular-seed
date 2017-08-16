define([
'../module'
], 
function( module ){
  'use strict';
  module.directive( 'dbpKey', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: true,
        template: '<a href ng-click="click()" ng-transclude></a>',
        link: function( scope, elem ){
          scope.click = function(){
            dbpedia.img.search = elem.text()
            scope.reload()
          }
        }
      }
    }
  ])
})