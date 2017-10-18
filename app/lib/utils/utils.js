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
  
  function slope( x1, y1, x2, y2 ){
    if ( x1 == x2 ){
      return false
    }
    return ( y1 - y2 ) / ( x1 - x2 )
  }
  
  function yInt( x1, y1, x2, y2 ){
    if ( x1 === x2 ){
      return y1 === 0 ? 0 : false
    }
    if ( y1 === y2 ){
      return y1
    }
    return y1 - slope( x1, y1, x2, y2 ) * x1
  }
  
  function lineIntersect( a, b, c, d ){
    var x11 = a[0]
    var y11 = a[1]
    var x12 = b[0]
    var y12 = b[1]
    var x21 = c[0]
    var y21 = c[1]
    var x22 = d[0]
    var y22 = d[1]
    var slope1, slope2, yint1, yint2, intx, inty;
    if ( x11 == x21 && y11 == y21 ){
      return [ x11, y11 ]
    }
    if ( x12 == x22 && y12 == y22 ){
      return [ x12, y22 ]
    }
    slope1 = slope( x11, y11, x12, y12 )
    slope2 = slope( x21, y21, x22, y22 )
    if ( slope1 === slope2 ){
      return false
    }
    yint1 = yInt( x11, y11, x12, y12 )
    yint2 = yInt( x21, y21, x22, y22 )
    if ( yint1 === yint2 ){
      return yint1 === false ? false : [ 0, yint1 ]
    }
    if ( slope1 === false ){
      return [ y21, slope2 * y21 + yint2 ]
    }
    if ( slope2 === false ){
      return [ y11, slope1 * y11 + yint1 ]
    }
    intx = ( slope1 * x11 + yint1 - yint2) / slope2
    return [ intx, slope1 * intx + yint1 ]
  }
  
  utils.math = {
    insertIntersects: function( points ){
      for ( var i=0; i<points.length-1; i+=2 ){
        var ii = !!points[i+1] ? i+1 : 0
        for ( var j=0; j<points.length-1; j+=2 ){
          var jj = !!points[j+1] ? j+1 : 0
          var intersect = lineIntersect( points[i], points[ii], points[j], points[jj] )
          if ( Number.isFinite( intersect[0] ) && Number.isFinite( intersect[1] )){
            console.log( intersect, i )
          }
        }
      }
    },
    circle :{
      nCoords: function( n, offset ){
        var angle = Math.PI*2 / n
        offset = angle * ( !!offset ) ? offset : 0
        var points = []
        for ( var i=0; i <= Math.PI*2; i+=angle ){
          points.push([ 
            Math.sin( i + offset ),
            Math.cos( i + offset )
          ])
        }
        return points
      }
    },
    lineIntersect: lineIntersect
  }
  
  // remove overlapping line segments from a path
  
  function check( coords, i, j, n ){
    if ( !!coords[j] &&
         !!coords[i] &&
         coords[j][0].toFixed(6) == coords[i][0].toFixed(6) &&
         coords[j][1].toFixed(6) == coords[i][1].toFixed(6) ){
      return check( coords, i+1, j+1, n+1 )
    }
    return n
  }
  
  utils.rmOverlap = function( coords ){
    coords = _.clone( coords )
    for ( var i=0; i<coords.length; i++ ){
      if ( !coords[i] ){
        continue
      }
      for ( var j=i+1; j<coords.length; j++ ){
        var n = check( coords, i, j, 0 )-1
        if ( n > 1 ){
          while ( n > 0 ){
            coords[ j + n ] = null
            n--
          }
          break
        }
      }
    }
    return coords
  }
  
  // get pixels per inch
  
  utils.dpi = function(){
    var div = document.body.appendChild( document.createElement( 'div' ))
    div.style.width = '1in'
    div.style.padding = '0'
    var dpi = div.offsetWidth
    div.parentNode.removeChild( div )
    return dpi
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