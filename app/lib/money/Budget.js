define([ 
'lodash',
'./Stream'
],
function( 
  _,
  Stream ){
  'use strict';
  var Budget = function( config ){
    var self = this
    self.streams = []
  }
  Budget.prototype.addStream = function( stream ){
    var self = this
    self.streams.push( new Stream( stream ))
  }
  Budget.prototype.table = function(){
    var self = this
    return self.streams.map( function( stream ){
      return stream.row()
    })
  }
  Budget.prototype.per = function( type ){
    var self = this
    var total = 0
    _.each( self.streams, 
      function( stream ){
        var func = ( 'per' + type[0].toUpperCase() + type.slice(1) ).trim()
        if ( !stream[ func ] ){
          throw( 'type not found')
        }
        total += stream[ func ]()
      }
    )
    return total
  }
  return Budget
})