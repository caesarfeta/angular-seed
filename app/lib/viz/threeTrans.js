define([],
function(){
    
    // transform queue
    
    var threeTrans = function(){
        var self = this;
        self.tick = 0;
        self.list = [];
    };
    
    threeTrans.prototype.add = function( func ){
        var self = this;
        self.list.push( func );
    };
    
    threeTrans.prototype.clear = function(){
        var self = this;
        self.list.splice( 0, self.list.length );
    };
    
    threeTrans.prototype.run = function(){
        var self = this;
        self.tick++
        for ( var i=0; i<self.list.length; i++ ){
            self.list[i]( self.tick );
        }
    };
    
    return threeTrans
});