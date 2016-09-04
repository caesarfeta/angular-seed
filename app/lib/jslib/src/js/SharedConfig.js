var SharedConfig = function() {
	//------------------------------------------------------------
	//  This class is a singleton.  Ensure only one instance exists.
	//------------------------------------------------------------
	if ( SharedConfig.prototype._singleton ) {
		return SharedConfig.prototype._singleton;
	}
	SharedConfig.prototype._singleton = this;
	
	//------------------------------------------------------------
	//  Store your config.
	//------------------------------------------------------------
	this.config = {};
	
	/**
	 * Add a config.
	 *
	 * @param { string } _key Object key
	 * @param { * }      _val Any Value
	 */
	this.add = function( _key, _val ) {
		this.config[ _key ] = _val;
	}
	
	/**
	 * Retrieve a config value.
	 *
	 * @param { string } _key Object key
	 * @return { * }          Custom Value
	 */
	this.get = function( _key ) {
		return this.config[ _key ];
	}
	
	/**
	 * Check for existence
	 *
	 * @param { string } _key Object key
	 * @return { bool }
	 */
	this.check = function( _key ) {
		if ( this.config[ _key ] == undefined ) {
			return false;
		}
		return true;
	}
}
