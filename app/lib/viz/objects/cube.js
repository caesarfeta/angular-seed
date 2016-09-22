define([
'threejs',
'lodash',
],
function(
  THREE,
  _ ){
  
  // cube class extends mover
  
  var cube = function( config ){
    var self = this;
    _.merge( self, {
      color: 0xFFFFFF,
      shine: 25
    })
    _.merge( self, config )
    self.mesh = new THREE.Mesh( 
      new THREE.CubeGeometry( 1, .5, 1 ),
      new THREE.MeshPhongMaterial({ 
        color: self.color,
        specular: 0x555555,
        shininess: self.shine
      })
    )
    self.mesh.receiveShadow = true;
    self.mesh.castShadow = true;
    self.mesh.position.y = 1;
    self.scene.add( self.mesh );
  };
  
  return cube
});