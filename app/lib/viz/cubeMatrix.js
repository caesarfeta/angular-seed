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
                cube.mesh.position.x = cube.mesh.scale.x*c-(rows*cube.mesh.scale.x)/2;
                cube.mesh.position.z = cube.mesh.scale.z*r-(cols.cube.mesh.scale.z)/2;
                cube.mesh.position.y = 1;
                cube.mesh.scale.y = Math.rand() * 20;
                self.cubes[r][c] = cube;
            })
        })
    }
    return cubeMatrix
});