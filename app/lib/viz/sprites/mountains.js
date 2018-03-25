define([
'threejs'
],
function(
  THREE ){
var self = {}
self.make = function( scene ){
  var geo = new THREE.PlaneGeometry( 20, 20, 9, 9 )
  for ( var i=0, l=geo.vertices.length; i<l; i++ ){
    var z = Math.random() * 2000
    geo.vertices[i].z = z / 65535 * 25
  }
  var mat = new THREE.MeshPhongMaterial({
    color: 0xdddddd,
    wireframe: false
  })
  self.mesh = new THREE.Mesh( geo, mat )
  self.mesh.receiveShadow = true
  self.mesh.castShadow = true
  
  scene.add( self.mesh )
}
return self
})