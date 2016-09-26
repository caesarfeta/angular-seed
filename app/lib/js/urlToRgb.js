define([ 
'angular',
], 
function( angular ){
  var self = this;
  angular.injector([ 'ng' ]).invoke([ '$q', function( $q ){
    self.$q = $q;
  }])
  self.canvas = document.createElement( 'canvas' );
  self.ctx = self.canvas.getContext( '2d' );
  self.get = function( url ){
    return self.$q( function( yes, no ){
      self.image = new Image();
      self.image.crossOrigin = 'anonymous';
      self.image.onload = function(){
        self.canvas.setAttribute( 'width', self.image.width );
        self.canvas.setAttribute( 'height', self.image.height );
        self.ctx.drawImage( self.image, 0, 0 );
        return yes( self.ctx.getImageData( 0, 0, self.canvas.width, self.canvas.height ))
      }
      self.image.onerror = function( error ){
        return no( error )
      }
      self.image.src = 'http://localhost:5000/' + url;
    })
  }
  return self
})