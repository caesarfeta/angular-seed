define([
'lodash',
'timbre'
],
function( _ ){
    var sfx = function(){
        var self = this;
    }
    
    // private stuff
    
    var T = window.T;
    function seconds( v, d ){
      return 1000 * (( v != undefined ) ? v : d )
    }
    function play( sound, t ){
      T( "perc", { r:seconds( t, .5 )}, sound )
      .on( "ended", function(){
        this.pause()
      })
      .bang()
      .play()
    }
    
    // simpler syntax
    
    function sin( c ){
      return T( "sin", c )
    }
    function saw( c ){
      return T( "saw", c )
    }
    function pulse( c ){
      return T( "pulse", c )
    }
    
    // public sounds
    
    sfx.prototype.bop = function( time ){
      var sine1 = sin({ 
        freq: 440, 
        mul: 0.5 
      })
      var sine2 = sin({ 
        freq: 660, 
        mul: 0.5 
      })
      play( sine1, time )
      play( sine2, time )
    }
    
    sfx.prototype.saw = function( time ){
      var s = saw({
        freq: 50, 
        mul: 0.75
      })
      play( s, time )
    }
    
    sfx.prototype.laser = function( time ){
      var freq = pulse({
        freq: 220, 
        add: 440, 
        mul: 120
      }).kr()
      var sine = sin({
        freq: freq, 
        mul: 0.5
      })
      play( sine, time )
    }
    
    sfx.prototype.wah = function( time ){
      var cutoff = sin({
        freq: "400ms", 
        mul: 300, 
        add: 1760
      }).kr()
      var VCO = saw({
        mul: 0.2
      })
      var VCF = T( "lpf", {
        cutoff: cutoff, 
        Q: 20
      }, VCO )
      play( VCF, time )
    }
    return sfx
})