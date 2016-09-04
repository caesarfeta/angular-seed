
// Remove newlines and tabs

String.prototype.smoosh = function(){
	return this.replace(/(\r\n+|\n+|\r+|\t+)/gm,'');
}


// Turn a string into what I commonly use as hash/object keys

String.prototype.keyMe = function(){
	return this.toLowerCase().replace(' ','_');
}


// Retrieve the last integer in a string

String.prototype.lastInt = function(){
	return parseInt(this.replace(/.*?(\d+)[^\d]*$/,'$1'));
}


// Ultra simple templating system

String.prototype.template = function( _map ){
	return this.replace(/{([^{}]*)}/g,
		function ( a, b ){
			var key = b.alphaOnly();
			var r = undefined;
			if ( _map != undefined && key in _map ){
				r = _map[ key ];
			}
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
}


// Ultra simple templating system

String.prototype.escapeHtml = function(){
	var map ={ '&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#39;' };
	return this.replace( /[&<>]/g, function(c){
		return map[c];
	});
}


// Breakup string at spaces respecting quotes
// and save the substrings in an array, 
// so they can be interpreted shell style.

// @return{ array }

String.prototype.shellArgs = function(){
	if  ( this == '' ){
		return [];
	}
	var matches = this.match( /('.*?'|".*?"|[^"\s]+)/g );
	for ( var i=0; i<matches.length; i++ ){
		matches[i] = matches[i].replace( /^"|"$|^'|'$/g, "")
	}
	return matches;
}


// Splice in a string at a specified index

// @param{ string } _string
// @param{ int } _index The position in the string

String.prototype.splice = function( _string, _index ){
	return ( this.slice( 0, Math.abs( _index ) ) + _string + this.slice( Math.abs( _index )));
}


// Remove white-space between HTML elements

String.prototype.noSpaceHtml = function(){
	var r = this.replace(/\n/g, '');
	r = r.replace(/[\t ]+\</g, '<');
	r = r.replace(/\>[\t ]+\</g, '><');
	r = r.replace(/\>[\t ]+$/g, '>');
	return r;
}


// Strip html tags

String.prototype.stripTags = function(){
	return this.replace(/<\/?[^>]+(>|$)/g, '' );
}


// Turn a CITE URN to / delimited path

String.prototype.urnToPath = function(){
	var len = this.length;
	var s = this;
	if ( s.substring( 0, 1 ) == '<' ){
		s = s.substring( 1, len-1 );
	}
	if ( s.substring( len-1, 1 ) == '>' ){
		s = s.substring( 0, len-2 );
	}
	s = s.replace( /:/g, '/' );
	s = s.replace( /\./g, '/' );
	return s;
}


// Turn a delimited path to a CITE URN

String.prototype.pathToUrn = function( last_dot ){
	var len = this.length;
	var s = this;
	s = s.replace( /\//g, ':' );
	if ( last_dot == true ){
		var p = s.lastIndexOf(':');
		s = s.substring(0,p) + '.' + s.substring(p+1);
	}
	return s;
}


// Remove extra spaces

String.prototype.oneSpace = function(){
	return this.replace(/\s{2,}/g, ' ');
}


// Alpha-numeric and spaces only

String.prototype.alphaSpaceOnly = function(){
	return this.replace(/[^\w\s]/gi, '');
}


// Alpha-numeric characters only

String.prototype.alphaOnly = function(){
	return this.replace(/[^\w]/gi, '');
}


// Capitalize the first letter of a string

String.prototype.capitalize = function(){
	return this.charAt(0).toUpperCase() + this.slice(1);
}


// Repeat a string n times

// @param{string} _n How many times you want to repeat a string

String.prototype.repeat = function( _n ){
	return new Array( _n + 1 ).join( this );
}


// Count the occurences of a string in a larger string

// @parm{string} _sub : The search string
// @param{boolean} _overlap : Optional. Default: false
// @return{int} : The count

String.prototype.occurs = function( _search, _overlap ){
	var string = this;
	
	//  If _search is null just return a char count
	
	if ( _search == undefined ){
		return string.length;
	}
	
	//  Make sure _search is a string
	
	_search+="";
	
	//  If no search term is past just return a character count
	
	if ( _search.length <= 0 ){
		return string.length;
	}
	
	//  Otherwise start counting.
	
	var n=0;
	var pos=0;
	var step = ( _overlap ) ? 1 : _search.length;
	while ( true ){
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ){
			n++;
			pos += step;
		}
		else{
			break;
		}
	}
	return n;
}


// Find the positions of occurences of a substring

// @parm{string} _sub : The search string
// @param{boolean} _overlap : Optional. Default--false.
// @param{boolean} _ignoreXML : Optional. Check to see if string is inside XML/HTML element.
// @param{boolean} _onlyWords : Optional. Make sure string is a discrete word.
// @return{Array} : An array of integers.

String.prototype.positions = function( _search, _overlap, _ignoreXML, _onlyWords ){

	var string = this;

	//  Make sure _search is a string

	_search+="";

	//  Otherwise start counting.

	var pos=0;

	//  String overlapping allowed?

	var step = ( _overlap ) ? 1 : _search.length;
	var p = [];
	while ( true ){
		var ok = true;
		pos = string.indexOf( _search, pos );
		if ( pos >= 0 ){

			//  Ignore if search string was found within an XML/HTML tag
			
			if ( _ignoreXML == true ){
				for ( var i=pos; i<string.length; i++ ){
					if ( string[i] == '<' ){
						break;
					}
					if ( string[i] == '>' ){
						ok = false;
					}
				}
			}

			//  Check to see if search string is an isolated word
			
			if ( _onlyWords == true ){
				if ( string.substr((pos-1),(pos+_search.length+1)).isAlphaNum() == true ){
					ok = false;
				}
			}

			//  If everything is good
			
			if ( ok == true ){
				p.push( pos );
			}
			pos += step;
		}
		else{
			break;
		}
	}
	return p;
}


// Insert a substring at a particular index

// @return{ string } The modified string

String.prototype.insertAt = function( _index, _string ){
	return this.substr( 0, _index) + _string + this.substr( _index );
}


// Turn a string with HTTP GET style parameters to an object

// @return{ obj } A collection of keys and values

String.prototype.params = function(){
	var arr = this.split('?');
	var get = arr[1];
	arr = get.split('&');
	var out ={};
	for ( var i=0, ii=arr.length; i<ii; i++ ){
		if ( arr[i] != undefined ){
			var pair = arr[i].split('=');
			out[ pair[0] ] = pair[1];
		}
	}
	return out;
}


// Turn underscores to camel case
// @return{ string }

String.prototype.toCamel = function(){
	return this.replace( /(\_[a-z])/g, function( $1 ){
		return $1.toUpperCase().replace('_','');
	});
}


// Check for the existence of an upper-case letter

// @return{ boolean }

String.prototype.hasUpper = function(){
	return /[A-Z]/.test( this );
}


// Create a word frequency report object

// @return{ obj } Report object

String.prototype.report = function(){
	var words = this.toLowerCase().split(' ');
	var stats ={};
	for ( var i=0, ii=words.length; i<ii; i++ ){
		var word = words[i];
		if ( ! ( word in stats ) ){
			stats[word] = 1;
		}
		else{
			stats[word] += 1;
		}
	}
	return stats;
}


// Position of the last slash in a string

String.prototype.lastslash = function(){
	return this.lastIndexOf('/')
}


// Get a directory name from a string

String.prototype.dirname = function(){
	return this.substring( 0, this.lastslash()+1 )
}


// Retrieve the "basename" the filename basically

String.prototype.basename = function(){
	return this.substring( this.lastslash()+1, this.length )
}


// Divide text into an array of lines by splitting on linebreaks

// @return{ array } An array of lines

String.prototype.lines = function(){
	return this.split("\n");
}


// Check to see if string is composed of only alphanumeric characters

// @return{ boolean }

String.prototype.isAlphaNum = function(){
	if ( /[^a-zA-Z0-9]/.test( this ) ){
		return false;
	}
	return true;
}


// Return a string in preferred

// @return{ boolean }

String.prototype.file_name = function(){
	return this.toLowerCase().replace( /[^a-z0-9]/g, '_' );
}

   
// Divide text into an array of individual sentences
// This is English-centric.  Forgive me.
   
// @return{ array } An array of sentences

String.prototype.sentences = function(){
	var check = this.match( /[^\.!\?]+[\.!\?]+/g );
	
	//  Make sure characters aren't used for purposes other than
	//  sentences.

	var vowels = [ 'a','e','i','o','u','y' ];
	var out = [];
	var carry = '';
	for ( var i=0; i<check.length; i++ ){
		
		//  Clean up.

		var strCheck = carry + check[i];
		carry = '';
		
		//  Check for the existence of a vowel, so we aren't
		//  accidentally thinking part of an abbreviation is its
		//  own sentence.

		var merge = true;
		for ( var j=0; j<vowels.length; j++ ){
			if ( strCheck.indexOf( vowels[j] ) != -1 ){
				merge = false;
				break;
			}
		}
		
		//  Also check for a capital letter on the first word.  
		//  Most sentences have those too.
		
		var capTest = strCheck.trim();
		if ( ! capTest[0].hasUpper() ){
			merge = true;
		}
		
		//  If no vowel exists in the sentence you're probably
		//  dealing with an abbreviation.  Merge with last sentence.  
		
		if ( merge ){
			if ( out.length > 0 ){
				out[ out.length-1 ] += strCheck;
			}
			else{
				carry = strCheck;
			}
			continue;
		}
		
		//  Prepare output.

		out.push( strCheck.smoosh().trim() );
	}
	return out;
}