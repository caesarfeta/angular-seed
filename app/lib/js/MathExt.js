define([],
function(){
    
    // Some handy math functions
    
    Math.toRad = function( _degrees ) {
        return _degrees*Math.PI / 180;
    }
    
    Math.toCart = function( _radius, _angle ) {
        return [ _radius*Math.cos( _angle ), _radius*Math.sin( _angle ) ];
    }
});