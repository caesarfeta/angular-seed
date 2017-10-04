define([
'angular',
'../utils/utils',
'lodash',
'ace/ace',
'angularSvgDownload',
'bootstrap'
], 
function(
  angular,
  utils,
  _,
  ace ){
  angular.module( 'texturizer', [
    'hc.downloader'
  ])
  .service( 'utilsTest', [
    function(){
      return utils
    }
  ])
  .directive( 'texturizerModal', [
    function(){
      return {
        restrict: 'E',
        scope: true,
        transclude: true,
        template: [
          
          // modal
          
          '<div class="modal right fade"',
               'id="modalWindow">',
            '<div class="modal-dialog modal-sm">',
              '<div class="modal-content">',
                
                // close button
                
                '<div class="modal-header">',
                  '<button type="button"',
                          'ng-click="close()"',
                          'class="close pull-left">',
                    '&times;',
                  '</button>',
                '</div>',
                
                // body
                
                '<div class="modal-body">',
                  '<ng-transclude></ng-transclude>',
                '</div>',
                
              '</div>',
            '</div>',
          '</div>',
          
          // trigger
          
          '<button',
            'type="button"',
            'ng-click="open()"',
            'class="btn btn-sm">',
              'tweak',
          '</button>',
          
        ].join(' '),
        link: function( scope, elem ){
          scope.open = function(){
            $( '#modalWindow', elem ).modal( 'show' )
          }
          scope.close = function(){
            $( '#modalWindow', elem ).modal( 'hide' )
          }
        }
      }
    }
  ])
  .service( 'texturizerOptions', [
    function(){
      return [
        {
          "id": "wobble spiral",
          "renderer": "texturizer-spiral",
          "origin": {
            "x": 400,
            "y": 400
          },
          "revolutions": 40,
          "pointCount": 1024,
          "clockwise": false,
          "padding": 6
        },
        {
          "id": "spiral flower",
          "renderer": "texturizer-spiral",
          "mutator": {
            "type": "flower",
            "petals": 5,
            "amplitude": 0.5
          },
          "origin": {
            "x": 350,
            "y": 400
          },
          "revolutions": 20,
          "pointCount": 4096,
          "clockwise": false,
          "padding": 15
        },
        {
          "id": "spiral",
          "renderer": "texturizer-spiral",
          "origin": {
            "x":100,
            "y":100
          },
          "revolutions": 20,
          "pointCount": 2048,
          "clockwise": false,
          "padding": 4
        },
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
              width: 1,
              space: 20,
              x: 400,
              y: 400
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
          id: 'sine wave',
          renderer: 'texturizer-sine-wave',
          waves: [
            {
              "frequency": 10,
              "total": 100,
              "width": 400,
              "unit": 2,
              "space": 15,
              "amplitude": 50
            }
          ]
        },
        {
          "id": "sine waves",
          "renderer": "texturizer-sine-wave",
          "waves": [
            {
              "frequency": 10,
              "total": 100,
              "width": 800,
              "unit": 2,
              "space": 15,
              "amplitude": 50
            },
            {
              "frequency": 50,
              "total": 50,
              "width": 800,
              "unit": 2,
              "space": 60,
              "amplitude": 80
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
  .directive( 'texturizerStarter', [
    'texturizerOptions',
    '$timeout',
    function(
      texturizerOptions,
      $timeout ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<span class="btn-group" uib-dropdown>',
            
            // button
            
            '<button id="single-button"',
                    'type="button"',
                    'class="btn btn-sm"',
                    'uib-dropdown-toggle>',
              '{{ id }}&nbsp;',
              '<span class="caret"></span>',
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
          '</span>',
          
        ].join(''),
        link: function( scope ){
          scope.options = texturizerOptions
          $timeout( function(){
            var opt = _.first( scope.options )
            scope.id = opt.id
            scope.config.json = JSON.stringify( opt, ' ', 2 )
            scope.update()
          })
          scope.change = function( id ){
            var opt = _.find( scope.options, function( item ){
              return item.id == id
            })
            scope.id = opt.id
            scope.config.json = JSON.stringify( opt, ' ', 2 )
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
          
          '<div>',
            
            // config area
            
            '<textarea ng-enter="update()"',
                      'id="texturizer-ctrl"',
                      'ng-model="config.json">',
            '</textarea>',
            
            // error
            
            '<div ng-if="!!error.msg" class="alert alert-danger">',
              '{{ error.msg }}',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          /*
          var editor = ace.edit( 'texturizer-ctrl' )
          editor.setTheme( 'ace/theme/monokai' )
          editor.getSession().setMode( 'ace/mode/javascript' )
          */
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
            
            if ( config.pointCount % 2 ){
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
    function(){
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
          console.log( config )
        }
      }
    }
  ])
  .directive( 'texturizerRegPoly', [
    function(){
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
            function drawDot( svg, coord, color ){
              color = ( !color ) ? 'black' : color
              var dot = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
              dot.setAttribute( 'cx', coord[0] )
              dot.setAttribute( 'cy', coord[1] )
              dot.setAttribute( 'fill', color )
              dot.setAttribute( 'r', 5 )
              svg.appendChild( dot )
            }
            
            // notch these for press connection
            
            function insertArrayAt( array, arrayToInsert, index ){
              Array.prototype.splice.apply( array, [ index, 0 ].concat( arrayToInsert ))
            }
            
            function getX( angle, denom ){
              return ( Math.cos( angle )*config.sideLength ) / denom
            }
            
            function getY( angle, denom ){
              return ( Math.sin( angle )*config.sideLength ) / denom
            }
            
            // postion the points
            
            points = points.map( function( point, i ){
              return [
                point[0]*r,
                point[1]*r
              ]
            })
            if ( !!config.notch ){
              for ( var i=points.length-1; i>0; i-- ){
                
                // calc required angles for notch points
                
                var angle = Math.atan2( 
                  points[i-1][1] - points[i][1],
                  points[i-1][0] - points[i][0]
                )
                var normal = angle - Math.PI/2
                
                // get coordinates
                
                var red = [
                  getX( normal, 8 ) + points[i][0],
                  getY( normal, 8 ) + points[i][1]
                ]
                // drawDot( svg, [ red[0]+250, red[1]+250 ], 'red' )
                
                var blue = [
                  getX( angle, 4 ) + red[0],
                  getY( angle, 4 ) + red[1]
                ]
                // drawDot( svg, [ blue[0]+250, blue[1]+250 ], 'blue' )
                
                var green = [
                  getX( angle, 4 ) + points[i][0],
                  getY( angle, 4 ) + points[i][1]
                ]
                // drawDot( svg, [ green[0]+250, green[1]+250 ], 'green' )
                
                var cyan = [
                  getX( angle, 2 ) + red[0],
                  getY( angle, 2 ) + red[1]
                ]
                // drawDot( svg, [ cyan[0]+250, cyan[1]+250 ], 'cyan' )
                
                var yellow = [
                  getX( angle, 2 ) + points[i][0],
                  getY( angle, 2 ) + points[i][1]
                ]
                // drawDot( svg, [ yellow[0]+250, yellow[1]+250 ], 'yellow' )
                
                var magenta = [
                  getX( angle, 4 ) + yellow[0],
                  getY( angle, 4 ) + yellow[1]
                ]
                // drawDot( svg, [ magenta[0]+250, magenta[1]+250 ], 'magenta' )
                
                var gray = [
                  getX( angle, 4 ) + cyan[0],
                  getY( angle, 4 ) + cyan[1]
                ]
                // drawDot( svg, [ gray[0]+250, gray[1]+250 ], 'gray' )
                
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
            }
            
            // set the svg attributes
            
            var d = points.map( function( point, i ){
              return (( !i ) ? 'M' : 'L' ) + ( point[0] + 250 ) + ' ' + ( point[1] + 250 )
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
            var rect = document.createElementNS( "http://www.w3.org/2000/svg", "rect" )
            rect.setAttribute( 'x', config.x )
            rect.setAttribute( 'y', config.y )
            rect.setAttribute( 'stroke', 'black' )
            rect.setAttribute( 'stroke-width', '1px' )
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
              
              // parse the JSON config
              
              scope.error.msg = null
              try {
                scope.json = JSON.parse( scope.config.json )
              }
              catch( e ){
                scope.error.msg = "Could not parse JSON"
              }
              
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
            '<span class="pull-right">',
              '<texturizer-modal>',
              
                // starter button
                
                '<div texturizer-starter></div>',
                
                // controls
                
                '<div texturizer-ctrl></div>',
              '</texturizer-modal>',
              
              // download button
              
              '<button class="btn btn-sm"',
                      'ng-class="{ disabled: !config.json }"',
                      'svg-download title="texturizer">',
                'download',
              '</button>',
            '</span>',
            
            // svg
            
            '<div texturizer-svg></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.config = {
            json: null
          }
          scope.run = 0
          scope.error = {
            msg: null
          }
          scope.update = function(){
            scope.run += 1
          }
        }
      }
    }
  ])
})