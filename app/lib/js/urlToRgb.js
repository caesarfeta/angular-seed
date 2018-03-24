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
  
  // cache img data
  
  self.cache = {};
  function itemFromUrl( url ){
    if ( !( url in self.cache )){
        var item = { 
        img: new Image(),
        data: undefined
      }
      item.img.crossOrigin = 'anonymous';
      self.cache[ url ] = item;
    }
    return self.cache[ url ]
  }
  
  // get the img data
  
  self.get = function( url ){
    return self.$q( function( yes, no ){
      var item = itemFromUrl( url )
      if ( !!item.data ){
        return yes( item.data )
      }
      item.img.onload = function(){
        self.canvas.setAttribute( 'width', item.img.width );
        self.canvas.setAttribute( 'height', item.img.height );
        self.ctx.drawImage( item.img, 0, 0 );
        item.img.data = self.ctx.getImageData( 0, 0, self.canvas.width, self.canvas.height );
        return yes( item.img.data )
      }
      item.img.onerror = function( error ){
        return no( error )
      }
      //item.img.src = 'http://localhost:5000/' + url;
      item.img.src = url
    })
  }
  return self
})