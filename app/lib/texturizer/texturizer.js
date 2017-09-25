define([
'angular',
'../utils/utils'
], 
function(
  angular,
  utils ){
  angular.module( 'texturizer', [])
  .service( 'utilsTest', [
    function(){
      return utils
    }
  ])
  .directive( 'texturizerStarter', [
    function(){
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
          scope.options = [
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
              id: 'sine wave',
              renderer: 'texturizer-sine-wave',
              waves: [
                {
                  total: 10,
                  width: 400,
                  unit: 10,
                  space: 5
                }
              ]
            }
          ]
          
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
  .directive( 'texturizerSineWave', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="waves" fill="black" stroke-width=".02" ></g>',
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
              var j = 0
              var data = []
              while( j < config.width / config.unit ){
                var pre = ( j == 0 ) ? 'M' : 'L'
                var y = Math.sin( j ) * config.amplitude + i * config.space
                console.log( y )
                data.push( pre + ' ' + j * config.unit + ' ' + y )
                j++
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
            '<div texturizer-starter></div>',
            '<div texturizer-ctrl></div>',
            '<div texturizer-svg></div>',
          '</div>'
          
        ].join(''),
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