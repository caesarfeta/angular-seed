define([ 
'lodash',
'../jsSHA'
],
function(
  _,
  jsSHA ){
  'use strict'
  
  // hashing utility
  
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
  utils.dump = function( obj ){
    return JSON.stringify( obj, ' ', 2 )
  }
  utils.range = function( i ){
    return i ? utils.range( i-1 ).concat( i ) : []
  }
  utils.sha = function( string ){
    var sha = new jsSHA( 'SHA-1', 'TEXT' )
    sha.setHMACKey( 'abc', 'TEXT' )
    sha.update( string )
    return sha.getHMAC( 'HEX' )
  }
  return utils
})