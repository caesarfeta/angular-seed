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
  
  // find the greatest common denominator of an array of numbers
  
  utils.gcd = function( input ){
    if ( toString.call( input ) !== "[object Array]" ){
      return false
    }
    var len, a, b;
    len = input.length;
    if ( !len ){
      return null
    }
    a = input[ 0 ]
    for ( var i = 1; i < len; i++ ){
      b = input[ i ]
      a = gcd_two_numbers( a, b )
    }
    return a
  }
  
  function gcd_two_numbers( x, y ){
    if (( typeof x !== 'number' ) || ( typeof y !== 'number' )){
      return false
    }
    x = Math.abs( x )
    y = Math.abs( y )
    while( y ){
      var t = y
      y = x % y
      x = t
    }
    return x
  }
  
  return utils
})