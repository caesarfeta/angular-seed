define([
'angular',
'lodash',
],
function(
  angular,
  _ ){
  angular.module( 'posters', [])
  .service( 'postersData', [
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
          $http.get( './lib/posters/posters.json' ).then(
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
})