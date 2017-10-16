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
  .directive( 'texturizerArcs', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="arcs" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json
          function draw( svg, config ){
            var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
            var cx = 100
            var cy = 100
            var r = 30
            path.setAttribute( 'd', [
              
              `M ${ config.x - config.r + config.width }, ${ config.y + config.r + config.width }`,
              `m ${ 1 * config.r }, 0`,
              `a ${ config.r } ${ config.r }, 0 1,0 ${ config.r*2 },0`,
              `a ${ config.r } ${ config.r }, 0 1,0 ${ config.r*-2 },0`
              
            ].join(' '))
            path.setAttribute( 'stroke-width', config.width )
            path.setAttribute( 'stroke', 'black' )
            path.setAttribute( 'fill', 'none' )
            svg.appendChild( path )
          }
          draw(
            $( '#arcs', elem ).get( 0 ),
            config
          )
        }
      }
    }
  ])
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
  .directive( 'texturizerIregPoly', [
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
          var config = _.clone( scope.json )
          config = _.merge({
            x: 0,
            y: 0
          }, config )
          var svg = $( '#polys', elem ).get( 0 )
          if ( !!config.unit ){
            config.path = config.path.map( function( item ){
              item[ 1 ] *= config.unit
              return item
            })
          }
          var path = texturizerUtils.anglesToCoords( config.path )
          
          // notch the points
          
          if ( config.notch ){
            path = texturizerUtils.notch(
              _.reverse( path ),
              config.notchHeight
            )
          }
          path = texturizerUtils.toOrigin( path ).map( function( item ){
            return [
              item[ 0 ] + config.x,
              item[ 1 ] + config.y
            ]
          })
          
          // plot the points
          
          texturizerUtils.drawLine( svg, path )
        }
      }
    }
  ])
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
  .directive( 'texturizerBullseye', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="circles" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var n = scope.json.circles.length
          function drawCircles( svg, config ){
            var i = 0
            while( i < config.total ){
              drawCircle( svg, config, i )
              i++
            }
          }
          function drawCircle( svg, config, i ){
            var circle = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
            circle.setAttribute( 'cx', config.x )
            circle.setAttribute( 'cy', config.y )
            circle.setAttribute( 'r', config.width * config.space * i )
            circle.setAttribute( 'stroke-width', config.width )
            circle.setAttribute( 'stroke', 'black' )
            circle.setAttribute( 'fill', 'none' )
            svg.appendChild( circle )
          }
          var i = 0
          while ( i < scope.json.circles.length ){
            drawCircles(
              $( '#circles', elem ).get( 0 ),
              scope.json.circles[ i ],
              Math.abs( n-scope.json.circles.length )
            )
            i++
          }
        }
      }
    }
  ])
  .directive( 'texturizerSineWave', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="waves"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json
          function position( x, config ){
            return Math.sin( x / config.frequency ) * config.amplitude
          }
          function drawWave( svg, config, n ){
            config = _.merge({
              frequency: 0.25,
              amplitude: 1,
              unit: 1
            }, config )
            var i = 0
            while ( i < config.total ){
              var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
              var x = 0
              var data = []
              while ( x < config.width ){
                var pre = ( x == 0 ) ? 'M' : 'L'
                var y = position( x, config ) + i * config.space
                data.push( pre + ' ' + x + ' ' + y )
                x += config.unit
              }
              path.setAttribute( 'd', data.join(' ') )
              path.setAttribute( 'stroke', 'black' )
              path.setAttribute( 'stroke-width', 2 )
              path.setAttribute( 'fill', 'none' )
              svg.appendChild( path )
              i++
            }
          }
          var n = 0
          while( n < config.waves.length ){
            drawWave(
              $( '#waves', elem ).get( 0 ),
              config.waves[ n ],
              n
            )
            n++
          }
        }
      }
    }
  ])
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