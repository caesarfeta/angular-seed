define([ 
'angular',
//'lib/viz/viz',
'lib/lsys/lsys',
'angularRoute'
],
function( angular, viz ){
  angular.module( 'myApp.view.canvas', [
    'ngRoute',
    'lsys'
  ])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      
      // plexvas
      
      var plexvas = {
        template: [
          
          '<div class="container">',
            '<div class="row">',
              '<div class="col-xs-9" i-canvas="iCanvas"></div>',
              '<div class="col-xs-3" i-canvas-ctrl="iCanvas"></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          'iCanvas',
          function(
            $scope,
            iCanvas ){
            $scope.iCanvas = new iCanvas()
          }]
      }
      $routeProvider.when('/plexvas', plexvas )
      $routeProvider.when('/plexvas/:id', plexvas )
      
      // lsys
      
      var lsys = {
        template: [
          
          '<div lsys="lsys">Gotcha</div>'
          
        ].join(' '),
        controller: [
          '$scope',
          function( scope ){
            scope.lsys = {
              i: 12,
              angle: 90,
              rules:[ 
                'FX', 
                'X=X+YF+',
                'Y=-FX-Y'
              ],
              delay: function( a, b, i ){
                return i * b / 5000
              }
            }
          }
        ]
      }
      $routeProvider.when('/lsys', lsys )
    }
  ])
  
  // http://progur.com/2017/02/create-mandelbrot-fractal-javascript.html
  // http://math.hws.edu/eck/jsdemo/jsMandelbrot.html
  
  .service( 'iCanvasSvc', [
    function(){
      var self = this
      self.list = []
      self.register = function( iCanvas ){
        if ( !_.find( self.list, iCanvas )){
          self.list.push( iCanvas )
        }
      }
    }
  ])
  .factory( 'iCanvas', [
    'iCanvasSvc',
    '$timeout',
    function(
      iCanvasSvc,
      $timeout ){
      var iCanvas = function( config ){
        _.merge( this, {
          id: _.uniqueId(),
          pan: {
            x: 3,
            y: 1.25
          },
          cycle: 10,
          zoom: 175,
          width: 900,
          height: 600,
          real: 'ix*ix - iy*iy + x',
          imaginary: '2 * ix*iy + y',
          palette: [ '#000', '#FF0', '#F0F', '#0FF' ]
        })
        _.merge( this, config )
        iCanvasSvc.register( this )
      }
      iCanvas.prototype.update = function(){
        $timeout( function(){} )
      }
      iCanvas.prototype.transX = function( x ){
        return x / this.zoom - this.pan.x
      }
      iCanvas.prototype.transY = function( y ){
        return y / this.zoom - this.pan.y
      }
      return iCanvas
    }
  ])
  .directive( 'iCanvasCtrl', [
    function(){
      return {
        scope: {
          iCanvasCtrl: '='
        },
        template: [
          
          '<form>',
            '<div class="form-group">',
              '<label>x</label>',
              '<input type="number" ng-model="ctrl.pan.x" step="{{ step( ctrl.pan.x ) }}" />',
            '</div>',
            '<div class="form-group">',
              '<label>y</label>',
              '<input type="number" ng-model="ctrl.pan.y" step="{{ step( ctrl.pan.y ) }}" />',
            '</div>',
            '<div class="form-group">',
              '<label>zoom</label>',
              '<input type="number" ng-model="ctrl.zoom" step="{{ step( ctrl.zoom ) }}" />',
            '</div>',
            '<div class="form-group">',
              '<label>cycle</label>',
              '<input type="number" ng-model="ctrl.cycle" />',
            '</div>',
          '</form>'
          
        ].join(' '),
        link: function( scope ){
          scope.ctrl = scope.iCanvasCtrl
          scope.step = function( i ){
            var str = i.toString()
            
            // calculate optimal step
            
            return ( str.indexOf('.') == -1 ) ?
              Math.pow( 10, str.length-2 ) : 
              Math.pow( 10, str.split('.')[1].length*-1 )
          }
        }
      }
    }
  ])
  .directive( 'iCanvas', [
    function(){
      return {
        scope: {
          iCanvas: '='
        },
        link: function( scope, elem ){
          var ctrl = scope.iCanvas
          var canvas = document.createElement('canvas')
          canvas.width = ctrl.width
          canvas.height = ctrl.height
          $( elem ).append( canvas )
          var ctx = canvas.getContext( '2d' )
          
          // is that point "blowing up?"
          
          function mandelbrot( x, y ){
            var ix = x
            var iy = y
            var n = 0
            for ( var i = 0; i < ctrl.cycle; i++ ){
              var tempReal = ix*ix - iy*iy + x
              var tempImag = 2 * ix*iy + y
              ix = tempReal
              iy = tempImag
              if ( ix*iy > 5 ){
                n=i/ctrl.cycle
              }
            }
            return n
          }
          
          // redraw if config values change
          
          function rect( x, y, ci ){
            ctx.fillStyle = ctrl.palette[ Math.floor( ctrl.palette.length * ci ) ] || _.last( ctrl.palette )
            ctx.fillRect( x, y, 1, 1 )
          }
          var draw = _.debounce( function(){
            for ( var x = 0; x < canvas.width; x++ ){
              for ( var y = 0; y < canvas.height; y++ ){
                rect( x, y, mandelbrot( ctrl.transX( x ), ctrl.transY( y )))
              } 
            }
          }, 100 )
          scope.$watch( 'iCanvas', draw, true )
        }
      }
    }
  ])
  .directive('canvasCubeTest', [
    function(){
      return {
        replace: true,
        link: function( scope, elem ){
          window.viz = new viz({ 
            elem: elem.get(0)
          })
        }
      }
    }
  ])
})