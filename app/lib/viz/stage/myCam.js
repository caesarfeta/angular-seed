define([
'threejs'
],
function(
THREE ){
  var myCam = function(){
    return this
  }
  myCam.prototype.make = function( scene ){
    var self = this
    self.scene = scene
    var d = 5
    var aspect = window.innerWidth / window.innerHeight
    self.camera = new THREE.OrthographicCamera()
    self.reset()
    
    // position and point the camera to the center of the scene
    
    self.camera.position.x = 0
    self.camera.position.y = 0
    self.camera.position.z = 15
    self.camera.lookAt( self.scene.position )
  }
  myCam.prototype.run = function( i ){
    var self = this
    
    // move that camera
    
    var c = 100
    self.camera.position.x = ( Math.sin( i*.009 ) + 0 ) * c
    self.camera.position.z = ( Math.cos( i*.009 ) + 0.25 ) * c
    self.camera.position.y = ( Math.sin( i*.009 ) + 0 ) * c
    // self.camera.position.y = 0
    self.camera.position.z = 50
    self.camera.lookAt( self.scene.position )
  }
  myCam.prototype.reset = function(){
    var self = this
    self.camera.left = window.innerWidth / -2
    self.camera.right = window.innerWidth / 2
    self.camera.top = window.innerHeight / 2
    self.camera.bottom = window.innerHeight / -2
    self.camera.near = 0.1
    self.camera.far = 1500
    self.camera.zoom = 25
    self.camera.updateProjectionMatrix()
  }
  return myCam
})