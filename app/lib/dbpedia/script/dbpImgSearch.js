define([
'../module',
], 
function( module ){
  'use strict';
  module
  .directive( 'dbpImgSearchBar', [
    '$timeout',
    function( $timeout ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<input class="dbpedia-search-input"',
                 'type="text"',
                 'ng-model="dbpedia.img.search"',
                 'ng-enter="reload()"',
                 'placeholder="keyword" />',
          
        ].join(' '),
        link: function( scope, elem ){
          $( window ).scroll( _.throttle( function(){
            var tp = $( elem ).get(0).getBoundingClientRect().top
            if ( tp < 0 ){
              $( elem ).addClass( 'scrollStick' )
            }
            else if ( window.pageYOffset == 0 ){
              $( elem ).removeClass( 'scrollStick' )
            }
          }, 500, { leading: true }))
          
        }
      }
    }
  ])
  .directive( 'dbpImgSearch', [
    function(){
      return {
        restrict: 'E',
        replace: true,
        scope: true,
        template: [
          
          '<span>',
            '<div dbp-img-search-bar></div>',
            '<spinner spin-id="dbpedia-http"></spinner>',
          '</span>'
          
        ].join(' ')
      }
    }
  ])
})