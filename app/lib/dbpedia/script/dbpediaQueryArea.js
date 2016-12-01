define([
'../module',
], 
function( module ){
  'use strict';
  module.directive( 'dbpediaQueryArea', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        restrict: 'E',
        replace: true,
        template: '<textarea class="dbpedia-query-area" ng-model="search" ng-enter="run()"></textarea>',
        link: function( scope, elem ){
          scope.search = '';
          scope.run = function(){
            dbpedia.query.http( scope.search );
          }
        }
      }
    }
  ])
})