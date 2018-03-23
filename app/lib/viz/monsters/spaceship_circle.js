define([
'../ascii_3d'
],
function(
  ascii ){
var self = this
self.monsters = []
self.make = function( n, scene ){
  for ( var i=0; i<n; i++ ){
    self.monsters[i] = ascii( 'b', 'pattern_pow' )
    self.monsters[i].scale.set( .25, .25, .25 )
    self.monsters[i].position.x += Math.sin( i )*2
    self.monsters[i].position.y += Math.cos( i )*2
    self.monsters[i].position.z += Math.sin( i )*0.25 + 1
    scene.add( self.monsters[i] )
  }
}
self.run = function( i ){
  _.each( self.monsters, function( monster, z ){
    monster.position.x += Math.sin( z+i*.05 )*.25
    monster.position.y += Math.cos( z+i*.05 )*.25
  })
}
return self
})