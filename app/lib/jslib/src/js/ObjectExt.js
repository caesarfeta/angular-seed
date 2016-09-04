ObjectExt = function() {}

/**
 * Take number values from one object and numerically add values 
 * from another object if the key names match.
 *
 * @param { obj } _obj1 An Object
 * @param { obj } _obj2 An Object
 */
ObjectExt.prototype.mergeAdd = function( _obj1, _obj2 ) {
	for ( var key in _obj1 ) {
		if ( ! ( key in _obj2 ) ) {
			_obj2[key] = 1;
			continue;
		}
		_obj2[key] += _obj1[key];
	}
}

/**
 * Checks to see if an object is empty
 *
 * @param { obj } obj An Object
 */
ObjectExt.prototype.isEmpty = function( obj ) {
	for( var i in obj ) { 
		return false; 
	} 
	return true;
}

/**
 * Count the characters of all values in an object
 *
 * @param { obj } _obj An Object
 * @return { int } character count
 */
ObjectExt.prototype.totalChars = function( _obj, _totalRoll, _depth ) {
	_totalRoll = ( _totalRoll == undefined ) ? 0 : _totalRoll;
	_depth = ( _depth == undefined ) ? 0 : _depth;
	for ( var i=0, ii=_obj.length; i<ii; i++ ) {
		var type = typeof _obj[i];
		if ( type == 'object' ) {
			_depth++;
			return this.totalChars( _obj[i], _totalRoll, _depth );
		}
		_totalRoll += _obj[i].toString().length;
	}
	return _totalRoll;
}

/**
 * Count the characters of all keys in an object
 *
 * @param { obj } _obj An Object
 * @return { array } character count, array of character counts by column
 */
ObjectExt.prototype.totalKeys = function( _obj ) {
   var total = 0;
   for ( var i in _obj ) {
		if ( _obj.hasOwnProperty( i ) ) {
			total++;
		}
	}
	return total;
}

/**
 * Wrap each value of an object with strings of your choice
 *
 * @param { obj } _obj An Object
 * @param { obj } _str1 Prefix string
 * @param { obj } _str2 Suffix string
 * @return { obj } An Object of wrapped string values
 */
ObjectExt.prototype.wrap = function( _obj, _str1, _str2 ) {
	_str2 = ( _str2 == undefined ) ? _str1: _str2;
	var wrapped = [];
	for ( var i=0, ii=_obj.length; i<ii; i++  ) {
		wrapped[i] = _str1.toString() + _obj[i] + _str2.toString();
	}
	return wrapped;
}

/**
 * src: http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
 *	by A. Levy
 *
 * Clone an object.
 *
 * @param { obj } _obj An Object
 * @return { obj } _obj Cloned Object
*/
ObjectExt.prototype.clone = function( _obj ) {
	//------------------------------------------------------------
	// Handle the 3 simple types, and null or undefined
	//------------------------------------------------------------
	if ( null == _obj || "_object" != typeof _obj ) return _obj;
	//------------------------------------------------------------
	// Handle Date
	//------------------------------------------------------------
	if ( _obj instanceof Date ) {
		var copy = new Date();
		copy.setTime( _obj.getTime() );
		return copy;
	}
	//------------------------------------------------------------
	// Handle Array
	//------------------------------------------------------------
	if ( _obj instanceof Array ) {
		var copy = [];
		for ( var i=0, ii=_obj.length; i<ii; i++ ) {
			copy[i] = this.clone( _obj[i] );
		}
		return copy;
	}
	//------------------------------------------------------------
	// Handle Object
	//------------------------------------------------------------
	if ( _obj instanceof Object ) {
		var copy = {};
		for ( var attr in _obj ) {
			if ( _obj.hasOwnProperty( attr ) ) copy[attr] = this.clone( _obj[attr] );
		}
		return copy;
	}
	throw new Error( "Unable to copy obj! Its type isn't supported." );
}

/**
 * src: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
 *	by Alnitak
 *
 * Use a string as a nested object selector
 *
 * @param { obj } _obj An Object
 * @param { obj } _str Nested selector string
 * @return { ??? } The value stored in _obj referenced by _str
 */
ObjectExt.prototype.byString = function( _obj, _str ) {
	if ( _str == undefined ) {
		return _obj;
	}
	_str = _str.replace(/\[['|"]*(\w+)['|"]*\]/g, '.$1' );
	_str = _str.replace(/^\./, '');
	var a = _str.split('.');
	while ( a.length ) {
		var n = a.shift();
		if ( n in _obj ) {
			_obj = _obj[n];
		}
		else {
			return;
		}
	}
	return _obj;
}