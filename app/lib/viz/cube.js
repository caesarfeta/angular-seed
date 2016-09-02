define([
'threejs',
'lib/viz/mover',
'lib/viz/cubeMover',
],
function( THREE, mover, cubeMover ){

    // cube class extends mover

    var cube = function(){
        this.geometry = new THREE.CubeGeometry( 1, 1, 1 );
        this.material = new THREE.MeshPhongMaterial({ 
            color: 0x00FF00,
            specular: 0x555555,
            shininess: 25
        });
        
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mover = new mover( new cubeMover( this ));
    };
    
    cube.prototype.update = function(){
        this.mover.update();
    };
    
    return cube
});