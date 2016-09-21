define([
'threejs',
],
function( THREE ){

    // cube class extends mover

    var cube = function(){
        var self = this;
        self.mesh = new THREE.Mesh( 
            new THREE.CubeGeometry( 1, .5, 1 ),
            new THREE.MeshPhongMaterial({ 
                color: 0xFFFFFF,
                specular: 0x555555,
                shininess: 25
            })
        )
        self.mesh.receiveShadow = true;
        self.mesh.castShadow = true;
        self.mesh.position.y = 1;
    };
    
    return cube
});