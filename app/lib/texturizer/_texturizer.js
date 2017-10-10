define([
'./module',
'../utils/utils',
'lodash'
], 
function(
  module,
  utils,
  _ ){
  module
  .directive( 'texturizerExplode', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="explode" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          function draw( svg, config ){
            var points = utils.math.circle.nCoords( config.total )
            _.each( points, function( point ){
              var r = _.clone( config.r ).sort()
              var space = r[1]
              var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' )
              path.setAttribute( 'd', [
                
                `M ${ point[0] * r[0] + space + config.x } ${ point[1] * r[0] + space + config.y }`,
                `L ${ point[0] * r[1] + space + config.x } ${ point[1] * r[1] + space + config.y }`
                
              ].join(' '))
              path.setAttribute( 'stroke-width', config.width )
              path.setAttribute( 'stroke', 'black' )
              path.setAttribute( 'fill', 'none' )
              svg.appendChild( path )
            })
          }
          _.each( scope.json.explosions, function( config ){
            draw(
              $( '#explode', elem ).get( 0 ),
              config
            )
          })
        }
      }
    }
  ])
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
    function(){
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
  .directive( 'texturizerBox', [
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
            width: '6',
            height: '3',
            depth: '3',
            thickness: '.25'
          })
          console.log( config )
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
            x: 200,
            y: 100,
            unit: 10
          }, config )
          var svg = $( '#polys', elem ).get( 0 )
          
          // convert degrees to radians and build relative coordinate array
          
          var angle = 0
          var x = 0
          var y = 0
          
          // start at origin
          
          config.path.unshift([ 0, 0 ])
          
          // get x,y coords from angles and line segment length pairs
          
          config.path = config.path.map( function( item ){
            angle += 180 - item[ 0 ] // interior to exterior
            var l = item[ 1 ]
            var rad =  angle / 180 * Math.PI
            x += Math.cos( rad ) * l * config.unit
            y += Math.sin( rad ) * l * config.unit
            item[0] = x + config.x
            item[1] = y + config.y
            return item
          })
          
          // notch the points
          
          if ( config.notch ){
            config.path = texturizerUtils.notch( _.reverse( config.path ), config.notchHeight )
          }
          
          // plot the points
          
          texturizerUtils.drawShape( svg, config.path )
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
            
            texturizerUtils.drawShape( svg, points )
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