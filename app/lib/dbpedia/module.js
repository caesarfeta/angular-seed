define([
'angular',
'lib/common/atCommon',
'lib/common/imgKit/imgKit',
'lazy-image'
], 
function( angular ){
  return angular.module( 'dbpedia', [
    'atCommon',
    'imgKit',
    'afkl.lazyImage'
  ])
})