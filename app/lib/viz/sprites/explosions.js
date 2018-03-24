define([
'../ascii_3d'
],
function(
  ascii ){
var self = {}
self.ship = []
self.make = function( scene ){
  self.scene = scene
  self.ship = ascii( 'a', 'explosions' )
  self.ship.scale.set( .25, .25, .25 )
  self.scene.add( self.ship )
}
self.explode = function(){
  
}
return self
})