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
  .directive( 'texturizerRegPoly', [
    'texturizerUtils',
    function( texturizerUtils ){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="polys" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json
          _.each( config.nSides, function( n ){
            drawPoly(
              $( '#polys', elem ).get( 0 ),
              scope.json,
              n
            )
          })
          function drawPoly( svg, config, n ){
            var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
            
            // get the unit circle points for n segments
            
            var points = utils.math.circle.nCoords( n )
            
            // find radius of the circle that contains polygon
            
            var r = config.sideLength / ( 2 * Math.sin( Math.PI / n ))
            
            // postion the points
            
            points = points.map( function( point, i ){
              return [
                point[0]*r + 250,
                point[1]*r + 250
              ]
            })
            
            // notch these for press connection
            
            if ( config.notch ){
              points = texturizerUtils.notch( points, config.notchHeight )
            }
            
            // set the svg attributes
            
            texturizerUtils.drawLine( svg, points )
          }
        }
      }
    }
  ])
})