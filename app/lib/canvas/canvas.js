define([ 
'angular',
//'lib/viz/viz',
'angularRoute'
],
function( angular, viz ){
  angular.module( 'myApp.view.canvas', [ 'ngRoute' ])
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      var std = {
        //template: '<div canvas-cube-test />',
        template: [
          
          '<div i-canvas="iCanvas"></div>',
          '<div i-canvas-ctrl="iCanvas"></div>'
          
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
      $routeProvider.when('/canvas', std )
      $routeProvider.when('/canvas/:id', std )
    }
  ])
  
  // http://progur.com/2017/02/create-mandelbrot-fractal-javascript.html
  
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
            x: 0,
            y: 0
          },
          zoom: 600,
          width: 900,
          height: 400
        })
        _.merge( this, config )
        iCanvasSvc.register( this )
      }
      iCanvas.prototype.update = function(){
        $timeout( function(){} )
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
          var canvas = document.createElement('canvas')
          canvas.width = scope.iCanvas.width
          canvas.height = scope.iCanvas.height
          $( elem ).append( canvas )
          var ctx = canvas.getContext( '2d' )
          
          function inSet( x, y ){
            var real = x
            var imag = y
            for ( var i = 0; i < 10; i++ ){
              var tempReal = real*real - imag*imag + x
              var tempImag = 2 * real * imag + y
              real = tempReal
              imag = tempImag
            }
            return real*imag < 5
          }
          
          // redraw every second if config values change
          
          var draw = _.throttle( function(){
            for ( var x = 0; x < canvas.width; x++ ){
              for ( var y=0; y < canvas.height; y++ ){
                if ( inSet( x/scope.iCanvas.zoom - scope.iCanvas.pan.x, y/scope.iCanvas.zoom - scope.iCanvas.pan.y )){
                  ctx.fillRect( x, y, 1 , 1 ) // draw a black pixel
                }
              } 
            }
          }, 1000 )
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