define([
'angular'
], 
function( angular ){
  angular.module( 'texturizer', [])
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
            
            '<ul class="dropdown-menu" uib-dropdown-menu role="menu">',
              '<li role="menuitem" ng-repeat="opt in options track by $index">',
                '<a href="" ng-click="change( opt.id )">{{ opt.id }}</a>',
              '</li>',
            '</ul>',
          '</div>',
          
        ].join(''),
        link: function( scope ){
          scope.options = [
            {
              id: 'circles',
              renderer: 'texturizer-bullseye',
              total: 250,
              width: 2,
              space: 2,
            },
            {
              id: 'slim hinge',
              renderer: 'texturizer-living-hinge',
              total: 250,
              height: 100,
              width: 2,
              hSpace: 2,
              vSpace: 5,
              chunk: [ 1, 2 ]
            },
            {
              id: 'chunky hinge',
              renderer: 'texturizer-living-hinge',
              total: 250,
              height: 300,
              width: 10,
              hSpace: 2,
              vSpace: 5,
              chunk: [ 2 ]
            },
            {
              id: 'offset hinge',
              renderer: 'texturizer-living-hinge',
              total: 250,
              height: 300,
              width: 10,
              hSpace: 2,
              vSpace: 5,
              chunk: [ 1, [ 1, 0.5 ]]
            },
            {
              id: 'sine wave',
              renderer: 'texturizer-sine-wave',
              origin: {
                x: -Math.PI,
                y: 0
              },
              amplitude: 1,       // wave amplitude
              rarity: 0.5,        // point spacing
              freq: 0.5,          // angular frequency
              phase: Math.PI * 2, // phase angle
              tweak: [
                [ 0, 0 ],
                [ 0.512286623256592433, 0.512286623256592433 ],
                [ 1.002313685767898599, 1 ],
                [ Math.PI/2, 1]
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
          var n = scope.json.total
          function drawCircle( svg, config, i ){
            var circle = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
            circle.setAttribute( 'cx', 400 )
            circle.setAttribute( 'cy', 400 )
            circle.setAttribute( 'r', config.width * config.space * i )
            circle.setAttribute( 'stroke-width', config.width )
            circle.setAttribute( 'stroke', 'black' )
            circle.setAttribute( 'fill', 'none' )
            svg.appendChild( circle )
          }
          while ( !!n ){
            drawCircle(
              $( '#circles', elem ).get( 0 ),
              scope.json,
              Math.abs( n-scope.json.total )
            )
            n--
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
            '<g id="circles" fill="black" stroke-width=".02" ></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json.tweak
          var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
          approximateCubicBezier(
            $( '#sines', elem ).get( 0 ),
            config,
            'stroke:black;'
          )
          function approximateCubicBezier( svg, controls, style ){
            var data = ''
            var controlStart = controls[0], 
                control1 = controls[1], 
                control2 = controls[2], 
                controlEnd = controls[3],
                x, y,
                x1, y1,
                x2, y2,
                quarterX = controlEnd[0],
                startX = -(4 * quarterX),
                negateY = false;
                
            function negateYs(){
              if ( negateY ){
                y = -y
                y1 = -y1
                y2 = -y2
              }
            }
            
            for ( x = startX; x<6; ){
              if ( x === startX ){
                y = controlStart[1]
                x1 = x + control1[0]
                y1 = control1[1]
                negateYs()
                data = 'M' +[x,y]+ ' C' +[x1,y1]+ ' '
              }
              else {
                
                // x1/y1 are always "mirrors" of the previous x2/y2,
                // so we can use the simpler "S" syntax instead of a new "C":
                
                data += ' S'
              }
              
              // Going from y=0 to y=+-1:
              
              x2 = x + control2[0]
              y2 = control2[1]
              x += quarterX
              y = controlEnd[1]
              negateYs()
              data += [x2,y2] + ' ' + [x,y]
              
              //Going from y=+- back to y=0:
              
              x2 = (x + quarterX) - control1[0]
              y2 = control1[1]
              x += quarterX
              y = controlStart[1]
              negateYs()
              data += ' S' + [x2,y2] + ' ' + [x,y]
              negateY = !negateY
            }
            
            // draw the line
            
            path.setAttribute( 'd', data )
            path.setAttribute( 'style', style )
            svg.appendChild( path )
          }
        }
      }
    }
  ])
  .directive( 'texturizerLivingHinge', [
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