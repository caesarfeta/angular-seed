define([
'./module',
'../utils/utils',
], 
function(
  module,
  utils ){
  module
  .service( 'utilsTest', [
    function(){
      return utils
    }
  ])
  .service( 'texturizerUtils', [
    function(){
      var self = this
      
      // angles to coordinates
      
      self.anglesToCoords = function( angles ){
        var angle = 0
        var x = 0
        var y = 0
        var items = _.clone( angles )
        items.unshift([ 0, 0 ])
        return items.map( function( item ){
          angle += 180 - item[ 0 ] // interior to exterior
          var l = item[ 1 ]
          var rad = angle / 180 * Math.PI
          x += Math.cos( rad ) * l
          y += Math.sin( rad ) * l
          return [ x, y ]
        })
      }
      
      // draw a colored dot
      
      self.drawDot = function( svg, coord, color ){
        color = ( !color ) ? 'black' : color
        var dot = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
        dot.setAttribute( 'cx', coord[0] )
        dot.setAttribute( 'cy', coord[1] )
        dot.setAttribute( 'fill', color )
        dot.setAttribute( 'r', 5 )
        svg.appendChild( dot )
      }
      
      // draw a line
      
      self.drawLine = function( svg, points ){
        var shape = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' )
        var d = points.map( function( point, i ){
          return (( !i ) ? 'M' : 'L' ) + point[0] + ' ' + point[1]
        }).join(' ')
        shape.setAttribute( 'd', d )
        shape.setAttribute( 'stroke-width', 1 )
        shape.setAttribute( 'stroke', 'black' )
        shape.setAttribute( 'fill', 'none' )
        svg.appendChild( shape )
      }
      
      // notch lines
      
      self.notch = function( points, _height, _sideLength ){
        for ( var i=points.length-1; i>0; i-- ){
          
          // calc the sideLength
          
          var x = points[i-1][0] - points[i][0]
          var y = points[i-1][1] - points[i][1]
          var sideLength = ( !!_sideLength ) ? _sideLength : Math.sqrt( x*x + y*y )
          var height = ( !!_height ) ? _height : sideLength / 8
          
          // calc required angles for notch points
          
          var angle = Math.atan2( y, x )
          var normal = angle - Math.PI/2
          
          // get coordinates
          
          var red = [
            exactX( normal, height ) + points[i][0],
            exactY( normal, height ) + points[i][1]
          ]
          
          var blue = [
            getX( angle, 4, sideLength ) + red[0],
            getY( angle, 4, sideLength ) + red[1]
          ]
          
          var green = [
            getX( angle, 4, sideLength ) + points[i][0],
            getY( angle, 4, sideLength ) + points[i][1]
          ]
          
          var cyan = [
            getX( angle, 2, sideLength ) + red[0],
            getY( angle, 2, sideLength ) + red[1]
          ]
          
          var yellow = [
            getX( angle, 2, sideLength ) + points[i][0],
            getY( angle, 2, sideLength ) + points[i][1]
          ]
          
          var magenta = [
            getX( angle, 4, sideLength ) + yellow[0],
            getY( angle, 4, sideLength ) + yellow[1]
          ]
          
          var gray = [
            getX( angle, 4, sideLength ) + cyan[0],
            getY( angle, 4, sideLength ) + cyan[1]
          ]
          
          insertArrayAt( points, [
            magenta,
            gray,
            cyan,
            yellow,
            green,
            blue,
            red
          ], i )
        }
        return points
      }
      function insertArrayAt( array, arrayToInsert, index ){
        Array.prototype.splice.apply( array, [ index, 0 ].concat( arrayToInsert ))
      }
      function exactX( angle, sideLength ){
        return Math.cos( angle )*sideLength
      }
      function exactY( angle, sideLength ){
        return Math.sin( angle )*sideLength
      }
      function getX( angle, denom, sideLength ){
        return ( Math.cos( angle )*sideLength ) / denom
      }
      function getY( angle, denom, sideLength ){
        return ( Math.sin( angle )*sideLength ) / denom
      }
      return self
    }
  ])
})