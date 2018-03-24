define([
'../ascii_3d'
],
function(
  ascii ){
var self = {}
self.monsters = []
self.make = function( scene ){
  _.each( 'abcd'.split(''), function( n, i ){
    self.monsters[i] = ascii( n, 'explosions' )
    self.monsters[i].scale.set( .25, .25, .25 )
    self.monsters[i].position.x += Math.sin( i )*2
    self.monsters[i].position.y += Math.cos( i )*2
    self.monsters[i].position.z += i*0.25
    console.log( scene )
    scene.add( self.monsters[i] )
  })
}
self.run = function( i ){
  _.each( self.monsters, function( monster, z ){
    monster.position.x += Math.sin( z+i*.05 )*.25
    monster.position.y += Math.cos( z+i*.05 )*.25
  })
}
return self
})