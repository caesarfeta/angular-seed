define([
'threejs',
'../objects/cube'
],
function(
THREE,
Cube ){
  var cubeLight = function(){
    var self = this
    return self
  }
  cubeLight.prototype.make = function( scene ){
    var self = this
    self.light = new THREE.PointLight( 0xFFFFFF, 0.5 )
    self.light.castShadow = true
    self.light.position.z = 20
    self.light.shadow.mapSize.width = 1024
    self.light.shadow.mapSize.height = 1024
    self.light.shadow.camera.near = 2
    self.light.shadow.camera.far = 50
    scene.add( self.light )
    self.cube = new Cube()
    scene.add( self.cube )
  }
  cubeLight.prototype.run = function( i ){
    var self = this
    self.cube.position.x = self.light.position.x
    self.cube.position.y = self.light.position.y
    self.cube.position.z = self.light.position.z
  }
  return cubeLight
})