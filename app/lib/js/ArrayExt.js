define([],
function(){
    ArrayExt = function() {}
    
    /**
     * Join an array with alternating strings
     *
     * @param { Array } _strings
     * @return { String }
     */
    ArrayExt.prototype.multijoin = function( _array, _strings ) {
        var output = '';
        for ( var i=0; i<_array.length; i++ ) {
            var glue = _strings[ i % _strings.length ]
            if ( i == _array.length-1 ) {
                glue = '';
            }
            output += _array[i]+glue;
        }
        return output;
    }
    
    /**
     * Remove items from one array which match items in another array.
     *
     * @param { Array } _array
     * @param { Array } _remove
     * @return { Array }
     */
    ArrayExt.prototype.exile = function( _array, _remove ) {
        if ( ! _array instanceof Array ) {
            return _array;
        }
        for ( var i=_array.length-1; i>=0; i-- ) {
            for ( var j=_remove.length-1; j>=0; j-- ) {
                if ( _array[i] === _remove[j] ) {
                    _array.splice( i, 1 );
                }
            }
        }
        return _array;
    }
    return ArrayExt
})