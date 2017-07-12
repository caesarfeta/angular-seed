define([ 
'lodash'
],
function( 
  _ ){
  'use strict';
  
  // Stream
  
  var Stream = function( config ){
    var self = this
    self.label = config.label
    self.initValue = self.value = config.value
    if ( !( 'period' in config )){
      return
    }
    switch( config.period ){
      case 'day':
        self.value = self.value * 30
        break
      case 'year':
        self.value = self.value / 12
        break
    }
  }
  Stream.prototype.isExpense = function(){
    var self = this
    return self.value < 0
  }
  Stream.prototype.isIncome = function(){
    var self = this
    return self.value > 0
  }
  Stream.prototype.perYear = function(){
    var self = this
    return self.value * 12
  }
  Stream.prototype.perMonth = function(){
    var self = this
    return self.value
  }
  Stream.prototype.perWeek = function(){
    var self = this
    return self.perDay() * 7
  }
  Stream.prototype.perDay = function(){
    var self = this
    return self.value / 30
  }
  Stream.prototype.perHour = function(){
    var self = this
    return self.perDay() / 24
  }
  Stream.prototype.row = function(){
    var self = this
    return {
      label: self.label,
      vals: {
        year: self.perYear(),
        month: self.perMonth(),
        week: self.perWeek(),
        day: self.perDay()
      }
    }
  }
  return Stream
})