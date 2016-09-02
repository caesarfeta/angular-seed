define([],
function(){
    
    // transform queue
    
    var threeTrans = function(){
        this.list = [];
    };
    
    threeTrans.prototype.add = function( func ){
        this.list.push( func );
    };
    
    threeTrans.prototype.clear = function(){
        this.list.splice( 0, this.list.length );
    };
    
    threeTrans.prototype.run = function(){
        for ( var i=0; i<this.list.length; i++ ){
            this.list[i]();
        }
    };
    
    return threeTrans
});