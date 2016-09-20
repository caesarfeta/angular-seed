define([
'timbre'
],
function(){
    var music = function(){
        var self = this;
    }
    
    // private stuff
    
    var T = window.T;
    music.prototype.melody = function( notes ){
      notes = ( !notes ) ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : notes
      var osc = T( "pulse" )
      var env = T( "perc", {
        a: 50, 
        r: 2500
      })
      var oscenv = T( "OscGen", {
        osc: osc, 
        env: env, 
        mul: 0.15
      }).play()
      return T( "interval", { 
          interval: 500 
        }, 
        function( count ){
          var noteNum  = 50 + notes[ count % 8 ];
          var velocity = 64 + ( count % 64 );
          oscenv.noteOn( noteNum, velocity );
        }
      )
    }
    return music
})