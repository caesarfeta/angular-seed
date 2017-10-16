define([
'../module',
'../../utils/utils',
'lodash'
], 
function(
  module,
  utils,
  _ ){
  module
  .directive( 'texturizerSpiral', [
    'texturizerUtils',
    function( texturizerUtils ){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="spiral" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json
          var svg = $( '#spiral', elem ).get(0)
          var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
          var roundTo = function ( input, sigdigs ){
            return Math.round( input * Math.pow( 10, sigdigs )) / Math.pow( 10, sigdigs )
          }
          function flowerify( angle ){
            return Math.sin( angle * config.mutator.petals ) * config.mutator.amplitude
          }
          var mutators = {
            flower: function( coord, i, angle, circ ){
              coord[0] = ( flowerify( angle ) + circ ) * angle * Math.cos( angle ) + config.origin.x
              coord[1] = ( flowerify( angle ) + circ ) * angle * Math.sin( angle ) + config.origin.y
            }
          }
          var makeSpiralPoints = function( config ){
            var direction = config.clockwise ? 1 : -1
            var circ = config.padding / ( 2*Math.PI )
            var step = ( 2*Math.PI * config.revolutions ) / config.pointCount
            var points = [], angle, x, y
            for ( var i = 0; i <= config.pointCount; i++ ){
              angle = direction * step * i
              
              // mutator
              
              var coord = []
              if ( !!config.mutator ){
                mutators[ config.mutator.type ]( coord, i, angle, circ )
              }
              
              // default spiral
              
              else {
                coord[0] = roundTo(( circ * angle ) * Math.cos( angle ) + config.origin.x, 2 )
                coord[1] = roundTo(( circ * angle ) * Math.sin( angle ) + config.origin.y, 2 )
              }
              points.push( coord[0] + " " + coord[1] )
            }
            // points = texturizerUtils.toOrigin( points )
            
            // only an even amount of points
            
            if ( !points.length % 2 ){
              points.pop()
            }
            return( 'M ' + points.shift() + ' S ' + points.join(' ') )
          }
          path.setAttribute( 'd', makeSpiralPoints( config ))
          path.setAttribute( 'stroke-width', 1 )
          path.setAttribute( 'stroke', 'black' )
          path.setAttribute( 'fill', 'none' )
          svg.appendChild( path )
        }
      }
    }
  ])
})