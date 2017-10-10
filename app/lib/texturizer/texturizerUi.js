define([
'./module',
'../utils/utils',
], 
function(
  module,
  utils ){
  module
  .service( 'utilsTest', [
    function(){
      return utils
    }
  ])
  .service( 'texturizerUtils', [
    function(){
      var self = this
      self.drawDot = function( svg, coord, color ){
        color = ( !color ) ? 'black' : color
        var dot = document.createElementNS( "http://www.w3.org/2000/svg", "circle" )
        dot.setAttribute( 'cx', coord[0] )
        dot.setAttribute( 'cy', coord[1] )
        dot.setAttribute( 'fill', color )
        dot.setAttribute( 'r', 5 )
        svg.appendChild( dot )
      }
      self.notch = function( points, _height, _sideLength ){
        for ( var i=points.length-1; i>0; i-- ){
          
          // calc the sideLength
          
          var x = points[i-1][0] - points[i][0]
          var y = points[i-1][1] - points[i][1]
          var sideLength = ( !!_sideLength ) ? _sideLength : Math.sqrt( x*x + y*y )
          var height = ( !!_height ) ? _height : sideLength / 8
          
          // calc required angles for notch points
          
          var angle = Math.atan2( y, x )
          var normal = angle - Math.PI/2
          
          // get coordinates
          
          var red = [
            exactX( normal, height ) + points[i][0],
            exactY( normal, height ) + points[i][1]
          ]
          
          var blue = [
            getX( angle, 4, sideLength ) + red[0],
            getY( angle, 4, sideLength ) + red[1]
          ]
          
          var green = [
            getX( angle, 4, sideLength ) + points[i][0],
            getY( angle, 4, sideLength ) + points[i][1]
          ]
          
          var cyan = [
            getX( angle, 2, sideLength ) + red[0],
            getY( angle, 2, sideLength ) + red[1]
          ]
          
          var yellow = [
            getX( angle, 2, sideLength ) + points[i][0],
            getY( angle, 2, sideLength ) + points[i][1]
          ]
          
          var magenta = [
            getX( angle, 4, sideLength ) + yellow[0],
            getY( angle, 4, sideLength ) + yellow[1]
          ]
          
          var gray = [
            getX( angle, 4, sideLength ) + cyan[0],
            getY( angle, 4, sideLength ) + cyan[1]
          ]
          
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
        return points
      }
      function insertArrayAt( array, arrayToInsert, index ){
        Array.prototype.splice.apply( array, [ index, 0 ].concat( arrayToInsert ))
      }
      function exactX( angle, sideLength ){
        return Math.cos( angle )*sideLength
      }
      function exactY( angle, sideLength ){
        return Math.sin( angle )*sideLength
      }
      function getX( angle, denom, sideLength ){
        return ( Math.cos( angle )*sideLength ) / denom
      }
      function getY( angle, denom, sideLength ){
        return ( Math.sin( angle )*sideLength ) / denom
      }
      return self
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
          
        ].join(' ')
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