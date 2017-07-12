define([ 
'lodash',
'../utils/utils'
],
function( 
  _,
  utils ){
  'use strict';
  
  // Investment
  
  var Investment = function( config ){
    var self = this
    _.merge( self, {
      value: 0,
      period: 'year',
      change: function( value ){
        return value
      }
    })
    self.initValue = self.value
    
    // check config
    // check period
    
    _.merge( self, config )
  }
  Investment.prototype.run = function(){
    var self = this
    var prev = self.value
    self.value = self.change( self.value )
    return { 
      prev: prev,
      now: self.value,
      diff: self.value - prev
    }
  }
  Investment.prototype.runLite = function(){
    var self = this
    return self.run().now
  }
  Investment.prototype.times = function( n ){
    var self = this
    return utils.nTimes( n, function(){ return self.run() })
  }
  Investment.prototype.timesLite = function( n ){
    var self = this
    return self.times( n ).map( function( item ){
      return item.now
    })
  }
  Investment.prototype.earnedInt = function( n ){
    var self = this
    return self.times( n ).map( function( item ){
      return item.diff
    })
  }
  Investment.prototype.totalEarnedInt = function( n ){
    var self = this
    return _.sum( self.earnedInt( n ))
  }
  Investment.prototype.reset = function(){
    var self = this
    self.value = self.initValue
  }
  return Investment
})

