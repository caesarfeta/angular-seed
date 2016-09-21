define([
'threejs',
'lodash',
'lib/viz/cube'
],
function( 
    THREE,
    _,
    vizCube ){
    var charMatrix = function( config ){
        var self = this;
        _.merge( self, {
          cubes: [],
          scene: undefined
        })
        _.merge( self, config )
    }
    charMatrix.prototype.build = function( arr ){
        var self = this;
        
        // rows
        
        _.each( arr, function( chars, r ){
            self.cubes[r]=[];
            
            // columns
            
            _.each( chars.split(), function( char, c ){
                if ( char == ' ' ){
                  return
                }
                var cube = new vizCube();
                cube.mesh.position.x = cube.mesh.scale.x*c-(rows*cube.mesh.scale.x)/2;
                cube.mesh.position.z = cube.mesh.scale.z*r-(cols*cube.mesh.scale.z)/2;
                cube.mesh.position.y = 1;
                self.cubes[r][c] = cube;
                self.scene.add( cube.mesh );
            })
        })
    }
    return cubeMatrix
});