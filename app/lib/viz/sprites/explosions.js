define([
'../ascii_3d'
],
function(
  ascii ){
var self = {}
self.ship = []
self.make = function( scene, elem, bound ){
  self.scene = scene
  self.ship = ascii( 'a', 'explosions' )
  self.ship.scale.set( .25, .25, .25 )
  self.scene.add( self.ship )
  
  // movement
  
  
  $( elem ).mousemove( function( e ){
    mouseRatio = e.offsetX / $( elem ).width()
    self.ship.position.x = mouseRatio * bound - bound / 2
    mouseRatio = e.offsetY / $( elem ).height()
    self.ship.position.y = ( mouseRatio * bound - bound / 2 ) * -1
  })
}
self.explode = function(){
  
}
return self
})