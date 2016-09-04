/**
 * Palettes are collections of colors.
 * Dependencies:
 * 		Culuh.js
 * 		Sorted.js
 * 		ObjectExt.js
 *
 * @param { string } _name The name of the palette.
 */
function Palette( _name ) {
	this.colors = [];
	this.load( _name );
}

Palette.prototype.palettes = function( _name ) {
	var ps = {
		'default': [
			'#000000', // black
			'#FFFFFF'  // white
		],
		'grayscale': [ 
			'#000000', 
			'#333333', 
			'#666666', 
			'#999999', 
			'#CCCCCC', 
			'#FFFFFF' 
		],
		'primary': [
			'#FF0000', // red
			'#00FF00', // green
			'#0000FF'  // blue
		],
		'secondary': [
			'#00FFFF', // cyan
			'#FF00FF', // magenta
			'#FFFF00'  // yellow
		],
		'candy': [
			'#F4DDBE', // coffee milk
			'#465A95', // sunset purple
			'#10CCD5', // blue raspberry
			'#FD8471', // peach skin
			'#88D499'  // blue grass
		],
		'nes': [
			'#7C7C7C',
			'#0000FC',
			'#0000BC',
			'#4428BC',
			'#940084',
			'#A80020',
			'#A81000',
			'#881400',
			'#503000',
			'#007800',
			'#006800',
			'#005800',
			'#004058',
			'#000000',
			'#BCBCBC',
			'#0078F8',
			'#0058F8',
			'#6844FC',
			'#D800CC',
			'#E40058',
			'#F83800',
			'#E45C10',
			'#AC7C00',
			'#00B800',
			'#00A800',
			'#00A844',
			'#008888',
			'#F8F8F8',
			'#3CBCFC',
			'#6888FC',
			'#9878F8',
			'#F878F8',
			'#F85898',
			'#F87858',
			'#FCA044',
			'#F8B800',
			'#B8F818',
			'#58D854',
			'#58F898',
			'#00E8D8',
			'#787878',
			'#FCFCFC',
			'#A4E4FC',
			'#B8B8F8',
			'#D8B8F8',
			'#F8B8F8',
			'#F8A4C0',
			'#F0D0B0',
			'#FCE0A8',
			'#F8D878',
			'#D8F878',
			'#B8F8B8',
			'#B8F8D8',
			'#00FCFC',
			'#F8D8F8'
		]
	};
	if ( _name == undefined ) {
		return ps[ 'default' ];
	}
	if ( _name in ps ) {
		return ps[ _name ];
	}
	return undefined;
}

/**
 * Load a palette
 *
 * @param { string } _name The name of the palette.
 */
Palette.prototype.load = function( _name ) {
	var colors = this.palettes( _name );
	if ( colors == undefined ) {
		throw "Palette -- "+_name+" could not be found";
	}
	this.add( colors );
}

/**
 * Get a color from the palette modulo style.
 *
 * @param { int } _int The index of color that you want.
 */
Palette.prototype.at = function( _int ) {
	return this.colors[ _int % this.colors.length ];
}

/**
 * Get a color from the palette modulo style.
 *
 * @param { int } _int The index of color that you want.
 */
Palette.prototype.colorAt = function( _int ) {
	console.log( this.colors.length % _int );
	return this.colors[ this.colors.length % _int ];
}

/**
 * Reset the palette
 */
Palette.prototype.reset = function() {
	this.colors = [];
}

/**
 * Add colors to a palette
 *
 * @param { array } _colors The colors you would like to add
 */
Palette.prototype.add = function( _colors ) {
	for ( var i=0; i<_colors.length; i++ ) {
		this.colors.push( new Culuh( _colors[i] ) );
	}
}

/**
 * Print out the hex representation of all the colors
 *
 * @param { string } _name The name of the palette.
 */
Palette.prototype.print = function() {
	for ( var i=0; i<this.colors.length; i++ ) {
		console.log( this.colors[i].hex() );
	}
}

/**
 * Print palette to screen
 *
 * @param { int } _cols (Optional) The number of columns
 * @param { int } _size (Optional) The size of the swatch in pixels
 */
Palette.prototype.show = function( _cols, _size ) {
	//------------------------------------------------------------
	//  Set some defaults
	//------------------------------------------------------------
	_size = ( _size == undefined ) ? 20 : _size;
	_cols = ( _cols == undefined ) ? this.colors.length : parseInt( _cols );
	//------------------------------------------------------------
	//  Hide any previous palette
	//------------------------------------------------------------
	this.hide();
	//------------------------------------------------------------
	//  Build the palette wrapper
	//------------------------------------------------------------
	var palette = document.createElement('div');
	palette.setAttribute( 'id', 'palette-sample' );
	palette.style.position = 'absolute';
	palette.style.left = '0';
	palette.style.top = '0';
	document.body.appendChild( palette );
	//------------------------------------------------------------
	//  Build the swatches
	//------------------------------------------------------------
	for ( var i=0; i<this.palette.length; i++ ) {
		var color = '#'+ this.palette[i].hex();
		var swatch = document.createElement('div');
		swatch.style.backgroundColor = color;
		swatch.style.height = _size+'px';
		swatch.style.width = _size+'px';
		swatch.style.float = 'left';
		palette.appendChild( swatch );
		if ( i%_cols == _cols-1 ) {
			palette.appendChild( document.createElement('br') );
		}
	}
}

/**
 * Hide a displayed palette
 */
Palette.prototype.hide = function() {
	var palette = document.getElementById("palette-sample");
	if ( palette != undefined ) {
		palette.parentNode.removeChild( palette );
	}
}

/**
 * Sort your palette
 *
 * @param { string } _type The type of sort: [list types here]
 */
Palette.prototype.sort = function( _type ) {
	switch ( _type ) {
		//------------------------------------------------------------
		//  Value
		//------------------------------------------------------------
		case 'value':
			this.sortNum( function( _color ) {
				return _color.v;
			});
			break;
		//------------------------------------------------------------
		//  Hue
		//------------------------------------------------------------
		case 'hue':
			this.sortNum( function( _color ) {
				return _color.h
			});
			break;
		//------------------------------------------------------------
		//  Saturation
		//------------------------------------------------------------
		case 'saturation':
			this.sortNum( function( _color ) {
				return _color.s
			});
			break;
		//------------------------------------------------------------
		//  Red
		//------------------------------------------------------------
		case 'red':
			this.sortNum( function( _color ) {
				var sub = (_color.gInt()+_color.bInt())/2;
				return _color.rInt()-sub;
			});
			break;
		//------------------------------------------------------------
		//  Green
		//------------------------------------------------------------
		case 'green':
			this.sortNum( function( _color ) {
				var sub = (_color.rInt()+_color.bInt())/2;
				return _color.gInt()-sub;
			});
			break;
		//------------------------------------------------------------
		//  Blue
		//------------------------------------------------------------
		case 'blue':
			this.sortNum( function( _color ) {
				var sub = (_color.rInt()+_color.gInt())/2;
				return _color.bInt()-sub;
			});
			break;
	}
}

/**
 * Sort your palette by some numerical value.
 *
 * @param { function } _func A function which returns an int.
 *  	This function will be passed a { Culuh } object as a parameter
 */
Palette.prototype.sortNum = function( _func ) {
	var sorted = new Sorted();
	var toCheck = [];
	for ( var i=0; i<this.colors.length; i++ ) {
		toCheck[i] = { value: _func( this.colors[i] ), color: this.colors[i] };
	}
	toCheck = sorted.numSort( toCheck, 'value' );
	for ( var i=0; i<toCheck.length; i++ ) {
		this.colors[i] = toCheck[i]['color'];
	}
}