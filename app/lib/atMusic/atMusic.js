define([
'./getJSON',
'lodash'
], 
function( getJSON, _ ){
  return function( callback ){
    var self = this
    self.ready = false
    
    // before you can do anything you need to load the library
    
    getJSON ( 'atMusic.lib', function( lib ){
      self.config = lib
      self.ready = true
      
      // build pitches
      
      self.config.pitches = []
      _.each( self.config.seed, function( pitch ){
        self.config.pitches.push( pitch )
        if ( self.config.noSharp.indexOf( pitch ) == -1 ){
          self.config.pitches.push( pitch+'#' )
        }
      })
      
      // get a chord
      
      self.chord = function( config ){
        var rootIndex = self.config.pitches.indexOf( config.root )
        if ( !( config.type in self.config.type )){
          config.type = 'maj'
        }
        return self.config.type[ config.type ].map( function( i ){
          return self.pitch( i+rootIndex )
        })
      }
      
      // get a pitch
      
      self.pitch = function( i ){
        return self.config.pitches[ i % self.config.pitches.length ]
      }
      
      // run callback
      
      if ( callback != undefined ){ callback( self ) }
    })
    return self
  }
})