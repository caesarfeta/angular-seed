define([
'lodash'
],
function( _ ){
  var atPixel = {}
  
  // grids
  
  atPixel.Grids = {
    list: []
  }
  atPixel.Grids.add = function( grid ){
    atPixel.Grids.list.push( grid )
  }
  
  // frames
  
  atPixel.Frame = function( config ){
    var self = this
    _.merge( self, {
      data: []
    })
    _.merge( self, config )
  }
  atPixel.Frame.prototype.reverse = function(){
    var self = this
    _.reverse( self.data )
  }
  
  // grid
  
  atPixel.Grid = function( config ){
    var self = this
    _.merge( self, {
      frames: [],
      cols: 16
    })
    _.merge( self, config )
    atPixel.Grids.add( self )
  }
  atPixel.Grid.prototype.reverse = function(){
    var self = this
    _.each( self.frames, function( frame ){
      frame.reverse()
    })
  }
  return atPixel
})