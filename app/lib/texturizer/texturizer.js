define([
'angular',
'../utils/utils',
'lodash',
'angularSvgDownload'
], 
function(
  angular,
  utils,
  _ ){
  angular.module( 'texturizer', [
    'hc.downloader'
  ])
  .service( 'utilsTest', [
    function(){
      return utils
    }
  ])
  .service( 'texturizerOptions', [
    function(){
      return [
        {
          "id": "explode",
          "renderer": "texturizer-explode",
          "explosions": [
            {
              "x": 0,
              "y": 0,
              "total": 100,
              "r": [
                200,
                300
              ],
              "width": 1
            },
            {
              "x": 100,
              "y": 100,
              "total": 50,
              "r": [
                100,
                200
              ],
              "width": 1
            },
            {
              "x": 250,
              "y": 250,
              "total": 100,
              "r": [
                50,
                175
              ],
              "width": 1
            }
          ]
        },
        {
          id: 'arcs',
          renderer: 'texturizer-arcs',
          x: 0,
          y: 0,
          r: 30,
          width: 5
        },
        {
          id: 'bullseye',
          renderer: 'texturizer-bullseye',
          circles: [
            {
              total: 20,
              width: 2,
              space: 2,
              x: 200,
              y: 200
            }
          ]
        },
        {
          id: 'slim bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 100,
          width: 2,
          hSpace: 2,
          vSpace: 5,
          chunk: [ 1, 2, 3 ]
        },
        {
          id: 'chunky bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 300,
          width: 10,
          hSpace: 2,
          vSpace: 5,
          chunk: [ 2, 1 ]
        },
        {
          id: 'offset bars',
          renderer: 'texturizer-stacked-bars',
          total: 250,
          height: 300,
          width: 5,
          hSpace: 2,
          vSpace: 5,
          chunk: [
            [ 1, 0.1 ],
            [ 1, 0.5 ],
            [ 1, 0.25 ],
            [ 1, 0.75 ],
            [ 1, 0.9 ]
          ]
        },
        {
          id: 'jagged wave',
          renderer: 'texturizer-jagged-wave',
          waves: [
            {
              "total": 100,
              "width": 400,
              "unit": 15,
              "space": 15,
             "amplitude": 50
            }
          ]
        },
        {
          id: 'regular polygons',
          renderer: 'texturizer_reg_poly',
          sideLength: 100,
          nSides: [ 3, 4, 5, 6, 8 ]
        },
        {
          id: 'regular polygons notch',
          renderer: 'texturizer_reg_poly',
          sideLength: 100,
          notch: true,
          nSides: [ 3, 4, 5, 6, 8 ]
        },
        {
          id: 'jagged waves',
          renderer: 'texturizer-jagged-wave',
          waves: [
            {
              "total": 100,
              "width": 400,
              "unit": 15,
              "space": 15,
              "amplitude": 50
            },
            {
              "total": 100,
              "width": 400,
              "unit": 15,
              "space": 18,
              "amplitude": 50
            }
          ]
        }
      ]
    }
  ])
  .directive( 'texturizerExplode', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="800" height="800">',
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
               'width="800" height="800">',
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
  .directive( 'texturizerStarter', [
    'texturizerOptions',
    function( texturizerOptions ){
      return {
        scope: true,
        template: [
          
          '<div class="btn-group" uib-dropdown>',
            
            // button
            
            '<button id="single-button"',
                    'type="button"',
                    'class="btn btn-sm"',
                    'uib-dropdown-toggle>',
              'starter <span class="caret"></span>',
            '</button>',
            
            // menu
            
            '<ul class="dropdown-menu"',
                'uib-dropdown-menu',
                'role="menu">',
              '<li role="menuitem"',
                  'ng-repeat="opt in options track by $index">',
                '<a href="" ng-click="change( opt.id )">{{ opt.id }}</a>',
              '</li>',
            '</ul>',
          '</div>',
          
        ].join(''),
        link: function( scope ){
          scope.options = texturizerOptions
          scope.change = function( id ){
            scope.config.json = JSON.stringify( 
              _.find( scope.options, function( item ){
                return item.id == id
              } 
            ), ' ', 2 )
            scope.update()
          }
        }
      }
    }
  ])
  .directive( 'texturizerCtrl', [
    function(){
      return {
        scope: true,
        template: [
          
          '<textarea ng-enter="update()"',
                    'ng-model="config.json">',
          '</textarea>'
          
        ].join(' ')
      }
    }
  ])
  .directive( 'texturizerRegPoly', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="800" height="800">',
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
            
            // scale and position the polygon
            
            function pos( p ){
              return p*r+250
            }
            
            function drawDot( svg, coord ){
              var dot = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
              dot.setAttribute( 'cx', coord[0] )
              dot.setAttribute( 'cy', coord[1] )
              dot.setAttribute( 'fill', 'black' )
              dot.setAttribute( 'r', 1 )
              svg.appendChild( dot )
            }
            
            // notch these for press connection
            
            if ( !!config.notch ){
              for ( var i=1; i<points.length; i++ ){
                
                // coordinate 1
                
                var angle = Math.atan2( 
                  points[i-1][1] - points[i][1],
                  points[i-1][0] - points[i][0]
                )
                var normal = angle - Math.PI/2
                var coord = [
                  ( Math.cos( normal )*config.sideLength ) / 8 + pos( points[i][0] ),
                  ( Math.sin( normal )*config.sideLength ) / 8 + pos( points[i][1] )
                ]
                drawDot( svg, coord )
                
                // coordinate 2
                
                var coord1 = [
                  ( Math.cos( angle )*config.sideLength ) / 4 + coord[0],
                  ( Math.sin( angle )*config.sideLength ) / 4 + coord[1]
                ]
                drawDot( svg, coord1 )
                
                var reverseNormal = normal + Math.PI
                var coord2 = [
                  ( Math.cos( reverseNormal )*config.sideLength ) / 8 + coord1[0],
                  ( Math.sin( reverseNormal )*config.sideLength ) / 8 + coord1[1]
                ]
                drawDot( svg, coord2 )
              }
            }
            
            // set the svg attributes
            
            var d = points.map( function( point, i ){
              return (( !i ) ? 'M' : 'L' ) + pos( point[0] ) + ' ' + pos( point[1] )
            }).join(' ')
            path.setAttribute( 'd', d )
            path.setAttribute( 'stroke-width', 1 )
            path.setAttribute( 'stroke', 'black' )
            path.setAttribute( 'fill', 'none' )
            svg.appendChild( path )
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
               'width="800" height="800">',
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
  .directive( 'texturizerJaggedWave', [
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
          var n = 0
          function position( x, config ){
            return ( Math.sin( Math.sqrt( x * config.frequency ) - config.offset )) * x * 0.1 * config.amplitude
          }
          function drawWave( svg, config, n ){
            config = _.merge({
              offset: 0,
              frequency: 0.25,
              amplitude: 1
            }, config )
            var i = 0
            while ( i < config.total ){
              var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
              var x = 0
              var data = []
              while( x < config.width ){
                var pre = ( x == 0 ) ? 'M' : 'L'
                var y = Math.sin( x ) * config.amplitude + i * config.space + config.amplitude*2
                data.push( pre + ' ' + x * config.unit + ' ' + y )
                x++
              }
              path.setAttribute( 'd', data.join(' ') )
              path.setAttribute( 'stroke', 'black' )
              path.setAttribute( 'stroke-width', 2 )
              path.setAttribute( 'fill', 'none' )
              svg.appendChild( path )
              i++
            }
          }
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
            '<g id="hinges" fill="black"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var n = scope.json.total
          function drawRect( config ){
            var rect = document.createElementNS( "http://www.w3.org/2000/svg", "rect" )
            rect.setAttribute( 'x', config.x )
            rect.setAttribute( 'y', config.y )
            rect.setAttribute( 'width', config.width )
            rect.setAttribute( 'height', config.height )
            return rect
          }
          function drawHinge( svg, config, i ){
            config = _.merge({
              chunk: [ 1 ] 
            }, config )
            
            // work on that multi vertical line renderer
            
            var nLines = config.chunk[ i % config.chunk.length ]
            var offsetPercent = 0
            if ( Array.isArray( nLines)){
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
                    height: diff - config.vSpace
                  })
                )
              }
              
              // draw that thing
              
              svg.appendChild(
                drawRect({
                  x: x,
                  y: y,
                  width: config.width,
                  height: lineLength - diff
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
  .directive( 'texturizerSvg', [
    '$compile',
    function( $compile ){
      return {
        scope: true,
        link: function( scope, elem ){
          scope.$watch(
            function(){ return scope.run },
            function(){
              if ( !scope.config.json ){
                return
              }
              scope.json = JSON.parse( scope.config.json )
              
              // do something fancy here
              
              elem.html(
                $compile( '<div ' + scope.json.renderer + '></div>' )( scope )
              )
            }
          )
        }
      }
    }
  ])
  .directive( 'texturizer', [
    function(){
      return {
        scope: true,
        template: [
          
          '<div class="texturizer">',
            
            // controls
            
            '<div texturizer-starter></div>',
            '<div texturizer-ctrl></div>',
            
            // download button
            
            '<button class="btn btn-sm"',
                    'svg-download title="texturizer">',
              'Save SVG',
            '</button>',
            
            // svg
            
            '<div texturizer-svg></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.config = {
            json: null
          }
          scope.run = 0
          scope.update = function(){
            scope.run += 1
          }
        }
      }
    }
  ])
})