define([
'lodash'
],
function( _ ){
  'use strict';
  var atPixels = {}
  
  // Frame
  
  atPixels.Frame = function( config ){
    var self = this
    _.merge( self, {
      pixels: [],
      cols: 0
    })
    _.merge( self, config )
  }
  atPixels.Frame.prototype.xyColor = function( config ){
    var self = this
  }
  atPixels.Frame.prototype.iColor = function( config ){
    var self = this
    self.pixels[ config.i ] = config.color
  }
  atPixels.Frame.prototype.reverse = function(){
    var self = this
    _.reverse( self.pixels )
  }
  
  // Grids
  
  atPixels.Grids = { list: [] }
  atPixels.Grids.clear = function(){
    atPixels.Grids.list.splice( 0, atPixels.Grids.list.length )
  }
  atPixels.Grids.add = function( grid ){
    atPixels.Grids.list.push( grid )
  }
  
  // Grid
  
  atPixels.Grid = function( config ){
    var self = this
    _.merge( self, {
      frames: [],
      activeIndex: undefined,
      loop: false,
      fps: undefined,
      palettes: [],
      paletteIndex: undefined
    })
    _.merge( self, config )
    atPixels.Grids.add( self )
  }
  atPixels.Grid.prototype.addFrame = function( config ){
    var self = this
    self.frames.push( new atPixels.Frame( config ))
    self.activeIndex = self.frames.length-1
  }
  atPixels.Grid.prototype.active = function(){
    var self = this
    return self.frames[ self.activeIndex ]
  }
  atPixels.Grid.prototype.addPalette = function( palette ){
    var self = this
    self.palettes.push( palette )
    self.paletteIndex = self.palettes.length-1
  }
  atPixels.Frame.prototype.reverse = function(){
    var self = this
    _.reverse( self.frames )
  }
  return atPixels
})