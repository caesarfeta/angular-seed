define([
'threejs',
'lodash',
'lib/viz/cube'
],
function( 
    THREE,
    _,
    vizCube ){
    var cubeMatrix = function( config ){
        var self = this;
        _.merge( self, {
          cubes: [],
          scene: undefined
        })
        _.merge( self, config )
    }
    cubeMatrix.prototype.build = function( rows, cols ){
        var self = this;
        
        // rows
        
        _.times( rows, function( r ){
            self.cubes[r]=[];
            
            // columns
            
            _.times( cols, function( c ){
                var cube = new vizCube();
                cube.mesh.position.x = cube.mesh.scale.x*c-(rows*cube.mesh.scale.x)/2;
                cube.mesh.position.z = cube.mesh.scale.z*r-(cols*cube.mesh.scale.z)/2;
                cube.mesh.position.y = 1;
                cube.mesh.scale.y = Math.random() * 20;
                self.cubes[r][c] = cube;
                self.scene.add( cube.mesh );
            })
        })
    }
    return cubeMatrix
});