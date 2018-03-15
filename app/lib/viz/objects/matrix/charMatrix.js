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
    var self = this
    _.merge( self, {
      cubes: [],
      color: 0xFFFFFF,
      size: 1,
    })
    _.merge( self, config )
    if ( !self.matrix ){
      self.matrix = [ '#' ]
    }
    self.build()
  }
  charMatrix.prototype.explode = function(){
    var self = this
    console.log( 'TODO: explode' )
  }
  charMatrix.prototype.remove = function(){
    console.log( 'TODO: remove' )
  }
  charMatrix.prototype.build = function(){
    var self = this
    self.group = new THREE.Group()
    // rows
    
    _.eachRight( self.matrix, function( chars, r ){
      r = self.matrix.length - r
      self.cubes[r]=[]
      
      // columns
      
      _.each( chars.split(''), function( char, c ){
        if ( char == ' ' ){
          return
        }
        var cube = new vizCube({ 
          color: self.color 
        })
        cube.position.x = cube.scale.x*c
        cube.position.y = cube.scale.y*r
        cube.position.z = 0
        self.cubes[r][c] = cube
        self.group.add( cube )
      })
    })
  }
  return charMatrix
})