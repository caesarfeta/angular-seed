define([
'threejs',
'lodash',
'lib/js/urlToRgb',
'lib/js/Culuh',
'../cube'
],
function( 
  THREE,
  _,
  urlToRgb,
  Culuh,
  vizCube ){
  
  var imgMatrix = function( config ){
    var self = this;
    _.merge( self, {
      cubes: [[]],
      scene: undefined,
      url: undefined,
      img: undefined,
      size: 0.25
    })
    _.merge( self, config )
    if ( !self.url ){
      throw 'missing url'
    }
    var culuh = new Culuh();
    function toHex( int ){
      return culuh.intToHex( int )
    }
    urlToRgb.get( self.url )
    .then( 
      function( imgData ){
        self.img = imgData;
        var pix = imgData.data;
        var width = imgData.width;
        var lastRow = 0;
        for( var i=0; i<pix.length; i+=4 ){
          var color = parseInt('0x'+toHex( pix[i] )+toHex( pix[i+1] )+toHex( pix[i+2] ));
          var c = i/4%width;
          var r = Math.floor(i/(width*4));
          if ( r > lastRow ){
            self.cubes[r]=[];
            lastRow = r;
          }
          var cube = new vizCube({ 
            scene: self.scene,
            color: color,
            size: self.size
          })
          cube.mesh.position.x = self.size*c;
          cube.mesh.position.z = self.size*r;
          cube.mesh.position.y = 0;
          self.cubes[r][c] = cube;
        }
      }
    );
  }
  imgMatrix.prototype.build = function(){
    var self = this;
  }
  return imgMatrix
});