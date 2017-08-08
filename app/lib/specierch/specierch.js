define([ 
'angular',
'lib/dbpedia/dbpedia',
'lib/maps/atMaps'
],
function( 
  angular, 
  dbpedia ){
  'use strict';
  angular.module( 'myApp.view.specierch', [ 
    'ngRoute',
    'dbpedia',
    'atMaps'
  ])
})