define([
'threejs',
'lodash',
'../cube'
],
function( 
  THREE,
  _,
  vizCube ){
  
  var charMatrix = function( config ){
    var self = this;
    _.merge( self, {
      cubes: [],
      scene: undefined,
      color: 0xFFFFFF,
      size: 1,
      matrix: [ 
        
        ' #', 
        '## ', 
        ' # ',
        ' # ',
        '###' 
        
      ]
    })
    _.merge( self, config )
    self.build()
  }
  
  charMatrix.prototype.build = function(){
    var self = this;
    
    // rows
    
    _.eachRight( self.matrix, function( chars, r ){
      r = self.matrix.length - r;
      self.cubes[r]=[];
      
      // columns
      
      _.each( chars.split(''), function( char, c ){
        if ( char == ' ' ){
          return
        }
        var cube = new vizCube({ 
          scene: self.scene, 
          color: self.color 
        })
        cube.mesh.position.x = cube.mesh.scale.x*c;
        cube.mesh.position.y = cube.mesh.scale.y*r;
        cube.mesh.position.z = 0;
        self.cubes[r][c] = cube;
      })
    })
  }
  return charMatrix
});