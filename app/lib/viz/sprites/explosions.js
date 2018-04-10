define([
'lodash',
'../ascii_3d'
],
function(
  _,
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
  
  $( elem ).mouseup( _.throttle( function(){
    self.explode()
  }, 1 ))
  
  // rotation
  
  $( window ).keypress( function( e ){
    switch ( e.which ) {
      case 97:
        self.ship.rotation.z += .1
        break
      case 102:
        self.ship.rotation.z -= .1
        break
    }
  })
}
var alpha = [ 'b', 'c', 'd' ]
self.explode = function( n ){
  n = ( !n ) ? 0 : n
  var p = {
    x: self.ship.position.x,
    y: self.ship.position.y,
    z: self.ship.position.z,
    r: self.ship.rotation.z
  }
  self.scene.remove( self.ship )
  self.ship = ascii( alpha[ n ], 'explosions' )
  self.ship.scale.set( .25, .25, .25 )
  self.ship.position.x = p.x
  self.ship.position.y = p.y
  self.ship.position.z = p.z
  self.ship.rotation.z = p.r
  self.scene.add( self.ship )
  if ( n < alpha.length ){
    n++
    _.delay( function(){ self.explode(  ) }, 500 )
  }
}
return self
})