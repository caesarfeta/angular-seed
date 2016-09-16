define([
'threejs',
'lodash',
'lib/viz/cube'
],
function( 
    THREE,
    _,
    cube ){
    
    var cubeMatrix = function( cubeTest ){
        var self = this;
        self.cubeTest = cubeTest;
        self.cubes = [];
    }
    
    cubeMatrix.prototype.build = function( rows, cols ){
        var self = this;
        _.times( rows, function( r ){
            _.times( cols, function( c ){
                var cube = self.cubeTest.newCube();
                cube.mesh.position.x = cube.mesh.scale.x*c;
                cube.mesh.position.z = cube.mesh.scale.z*r;
                self.cubes[r][c] = cube;
            })
        })
    }
    
    return cubeMatrix
});