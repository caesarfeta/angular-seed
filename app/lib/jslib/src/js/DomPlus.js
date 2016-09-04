/**
 * Fills some gaps left by Javascript's native DOM manipulation methods.
 */
function DomPlus() {}

/**
 * Change the type of a tag.
 *
 * @param { Element } _elem Web API Dom Element
 * @param { string } _new The new tag type
 * @return { Element }
 */
DomPlus.tagChange = function( _elem, _new ) {
	var newNode = document.createElement( _new );
	//------------------------------------------------------------
	//  Copy HTML
	//------------------------------------------------------------
	newNode.innerHTML = _elem.innerHTML;
	//------------------------------------------------------------
	//  Copy Attributes
	//------------------------------------------------------------
	var attributes = _elem.attributes;
	for ( var i=0, ii=attributes.length; i<ii; i++ ) {
		var nodeName = attributes[i].nodeName;
		var nodeValue = attributes[i].nodeValue;
		newNode.setAttribute( nodeName, nodeValue );
	}
	//------------------------------------------------------------
	//  Copy the new node into place
	//------------------------------------------------------------
	_elem.parentNode.replaceChild( newNode, _elem );
	return newNode;
}

/**
 * Find an XML node using an attribute key value pair
 *
 * @param { Object } _xml The XML to search.
 * @param { String } _attr The attribute name to search for
 * @param { String } _val The attribute value to search for
 * @param { String } _tag ( optional ) XML tag type to search 
 *						  defaults to * ( all types )
 */
DomPlus.getByAttrValue = function( _xml, _attr, _val, _tag ) {
	_tag = ( _tag == undefined ) ? '*' : _tag;
	var match = []
	var nodes = _xml.getElementsByTagName( _tag );
	for ( var i=0, ii=nodes.length; i<ii; i++ ) {
		var attrs = nodes[i].attributes;
		for ( var j=0, jj=attrs.length; j<jj; j++ ) {
			var check = attrs[j];
			if ( check.name == _attr && check.value == _val ) {
				match.push( nodes[i] );
			}
		}
	}
	return match;
}