define([
'timbre'
],
function(){
    var synth = function(){
        var self = this;
        self.T = window.T;
    }
    synth.prototype.bop = function( t ){
        var sine1 = self.T( "sin", { 
            freq:440, 
            mul:0.5 
        });
        var sine2 = self.T( "sin", { 
            freq:660, 
            mul:0.5 
        });
        self.T( "perc", 
            { r: ( !!t ) ? t : 500 }, 
            sine1, 
            sine2 
        )
        .on( "ended", function(){
            this.pause();
        })
        .bang()
        .play()
    }
    return synth
})