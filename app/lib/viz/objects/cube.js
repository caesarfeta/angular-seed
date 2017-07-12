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
      shine: 25,
      size: 1
    })
    _.merge( self, config )
    self.mesh = new THREE.Mesh( 
      new THREE.CubeGeometry( self.size, self.size, self.size ),
      new THREE.MeshPhongMaterial({ 
        color: self.color,
        specular: 0x555555,
        shininess: self.shine
      })
    )
    self.mesh.receiveShadow = true;
    self.mesh.castShadow = true;
    self.scene.add( self.mesh );
  };
  
  return cube
});