define([],
function(){
    
    // cube - mover connector
    
    var cubeMover = function( cube ){
        this.cube = cube
    };
    
    cubeMover.prototype.update = function( pos ){
        this.cube.mesh.position.x = pos.x;
        this.cube.mesh.position.y = pos.y;
        this.cube.mesh.position.z = pos.z;
    }
    
    return cubeMover
});