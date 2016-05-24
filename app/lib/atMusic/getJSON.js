define([
'jquery',
'require'
],
function( $, req ){
    return function( url, callback ){
        $.getJSON( 
            req.toUrl( './'+url+'.json'), 
            function( data ){ 
                callback( data ) 
            }
        )
    }
});