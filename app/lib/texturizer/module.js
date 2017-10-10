define([
'angular',
'angularSvgDownload',
'bootstrap'
], 
function( angular ){
  return angular.module( 'texturizer', [
    'hc.downloader'
  ])
})