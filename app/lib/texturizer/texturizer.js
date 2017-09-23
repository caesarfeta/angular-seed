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
              '<li role="menuitem">',
                '<a href="" ng-click="change( \'livingHinge\' )">living hinge</a>',
                '<a href="" ng-click="change( \'sineWave\' )">sine wave</a>',
              '</li>',
            '</ul>',
          '</div>',
          
        ].join(''),
        link: function( scope ){
          var config = {
            livingHinge: { 
              id: 'living hinge'
            },
            sineWave: {
              id: 'sine wave',
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
          }
          scope.change = function( id ){
            scope.config.json = JSON.stringify( config[ id ], ' ', 2 )
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
  .directive( 'texturizerSineWave', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="400"',
               'viewBox="-7.5 -1.5 15 3"',
               'preserveAspectRatio="xMidYMid slice">',
            '<g id="sines" fill="none" stroke-width=".02" ></g>',
          '</svg>',
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json.tweak
          approximateCubicBezier(
            $( '#sines', elem ).get( 0 ),
            config,
            'stroke:black;'
          )
          function approximateCubicBezier( svg, controls, style ){
            var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
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
                $compile( '<div texturizer-sine-wave></div>' )( scope )
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