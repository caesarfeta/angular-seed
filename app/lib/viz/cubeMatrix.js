define([
'threejs',
'lib/viz/cube'
],
function( 
    THREE,
    cube ){
    
    var cubeMatrix = function( cubeTest ){
        var self = this;
        self.cubeTest = cubeTest;
        self.cubes = [];
    }
    
    cubeMatrix.prototype.build = function( matrix ){
        var self = this;
        var rows = matrix[0];
        var cols = matrix[1];
        for ( var r=0; r<rows; r++ ){
            self.cubes[r]=[];
            for ( var c=0; c<cols; c++ ){
                var cube = self.cubeTest.newCube();
                cube.mesh.position.x = cube.mesh.scale.x*r;
                cube.mesh.position.y = cube.mesh.scale.y*c;
                self.cubes[r][c] = cube;
            }
        }
    }
    
    return cubeMatrix
});