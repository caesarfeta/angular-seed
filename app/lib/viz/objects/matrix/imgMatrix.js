define([
'threejs',
'lodash',
'lib/js/urlToRgb',
'../cube'
],
function( 
  THREE,
  _,
  urlToRgb,
  vizCube ){
  
  var imgMatrix = function( config ){
    var self = this;
    _.merge( self, {
      cubes: [],
      scene: undefined,
      url: undefined
    })
    _.merge( self, config )
    if ( !self.url ){
      throw 'missing url'
    }
    urlToRgb.get( self.url )
    .then( 
      function( imgData ){
        console.log( imgData )
      }
    );
  }
  imgMatrix.prototype.build = function(){
    var self = this;
  }
  return imgMatrix
});