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
  .directive( 'texturizerStackedBars', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="hinges" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var n = scope.json.total
          function drawRect( config ){
            if ( config.width == 0 ){
              var shape = document.createElementNS( "http://www.w3.org/2000/svg", "line" )
              shape.setAttribute( 'x1', config.x )
              shape.setAttribute( 'y1', config.y )
              shape.setAttribute( 'x2', config.x + config.width )
              shape.setAttribute( 'y2', config.y + config.height )
            }
            else {
              var shape = document.createElementNS( "http://www.w3.org/2000/svg", "rect" )
              shape.setAttribute( 'x', config.x )
              shape.setAttribute( 'y', config.y )
              shape.setAttribute( 'width', config.width )
              shape.setAttribute( 'height', config.height )
              shape.setAttribute( 'fill', config.fill )
            }
            shape.setAttribute( 'stroke', config.stroke )
            shape.setAttribute( 'stroke-width', '1px' )
            return shape
          }
          function drawHinge( svg, config, i ){
            config = _.merge({
              chunk: [ 1 ],
              stroke: 'black',
              fill: 'black'
            }, config )
            
            // work on that multi vertical line renderer
            
            var nLines = config.chunk[ i % config.chunk.length ]
            var offsetPercent = 0
            if ( Array.isArray( nLines )){
              offsetPercent = nLines[1]
              nLines = nLines[0]
            }
            
            // what's the individual line length?
            
            var lineLength = ( config.height - config.vSpace * nLines ) / nLines
            var n = 0
            while ( n < nLines ){
              
              // draw that rectangle
              
              var y = ( n*( lineLength + config.vSpace ) + lineLength*offsetPercent ) % config.height
              var x = i*( config.width + config.hSpace )
              
              // wrap rectangle if necessary
              
              var overlap = y + lineLength + config.vSpace - config.height
              var diff = ( overlap > 0 ) ? overlap : 0
              if ( !!diff){
                svg.appendChild(
                  drawRect({
                    x: i*( config.width + config.hSpace ),
                    y: 0,
                    width: config.width,
                    height: diff - config.vSpace,
                    fill: config.fill,
                    stroke: config.stroke
                  })
                )
              }
              
              // draw that thing
              
              svg.appendChild(
                drawRect({
                  x: x,
                  y: y,
                  width: config.width,
                  height: lineLength - diff,
                  fill: config.fill,
                  stroke: config.stroke
                })
              )
              n++
            }
          }
          while ( !!n ){
            drawHinge(
              $( '#hinges', elem ).get( 0 ),
              scope.json,
              Math.abs( n-scope.json.total )
            )
            n--
          }
        }
      }
    }
  ])
})