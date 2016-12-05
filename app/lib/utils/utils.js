define([ 
'lodash'
],
function( _ ){
  'use strict'
  var utils = {}
  utils.nTimes = function( n, func ){
    var array = []
    for ( var i=1; i<=n; i++ ){
      array.push( null )
    }
    return array.map( function( ignore, i ){
      return func( i )
    })
  }
  return utils
})