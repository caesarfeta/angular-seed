define([
'threejs',
'lodash',
'jquery'
],
function( THREE, _ ){
  var player = function( config ){
    var self = this;
    
    // defaults
    
    _.merge( self, {
      x: 3,
      width: 20
    })
    _.merge( self, config )
    
    // build it
    
    self.mesh = new THREE.Mesh( 
      new THREE.CubeGeometry( self.x, 1, .5 ),
      new THREE.MeshPhongMaterial({ 
        color: 0xAAAAAA,
        specular: 0x555555,
        shininess: 25
      })
    )
    self.mesh.receiveShadow = true
    self.mesh.castShadow = true
    self.scene.add( self.mesh )
    
    // mouse movement
    
    var mouseRatio = 0.5
    $( self.elem ).mousemove( function( e ){
      mouseRatio = e.offsetX / $( self.elem ).width()
      self.mesh.position.x = mouseRatio * self.width - self.width / 2
    })
  }
  player.prototype.isTouching = function( mesh ){
    var self = this
    var bbox1 = new THREE.Box3().setFromObject( self.mesh )
    var bbox2 = new THREE.Box3().setFromObject( mesh )
    return bbox1.intersectsBox( bbox2 )
  }
  return player
})