/**
 * Scroll to the bottom of a page.
 *
 * @param { integer } _sec Seconds
 */
jQuery.scrollToBottom = function( _sec ) {
	var dh = jQuery(document).height();
	var wh = jQuery(window).height();
	jQuery('html,body').animate({ scrollTop:dh-wh }, _sec*1000 );
}

/**
 * Put the cursor at the end of the input box
 */
jQuery.fn.cursorToEnd = function() {
	return this.each( function() {
		jQuery( this ).focus();
		
		//------------------------------------------------------------
		//   If this function exists...
		//------------------------------------------------------------
		if ( this.setSelectionRange ) {
			//------------------------------------------------------------
			// ... then use it ( Doesn't work in IE )
			// Double the length because Opera is inconsistent 
			// about whether a carriage return is one character or two.
			//------------------------------------------------------------
			var len = jQuery( this ).val().length * 2;
			this.setSelectionRange( len, len );
		} 
		else {
			//------------------------------------------------------------
			// ... otherwise replace the contents with itself
			// ( Doesn't work in Google Chrome )
			//------------------------------------------------------------
			jQuery( this ).val( jQuery( this ).val() );
		}
		//------------------------------------------------------------
		// Scroll to the bottom, in case we're in a tall textarea
		// ( Necessary for Firefox and Google Chrome )
		//------------------------------------------------------------
		this.scrollTop = 999999;
	});
};

/**
 *  Remove whitespace
 *  Copied from
 *  http://stackoverflow.com/questions/1539367/remove-whitespace-and-line-breaks-between-html-elements-using-jquery
 */
jQuery.fn.noSpace = function() {
	textNodes = this.contents().filter(
		function() { 
			return ( this.nodeType == 3 && !/\S/.test( this.nodeValue ) );
		}
	).remove();
	return this;
}

/**
 *  Get an element's html
 */
jQuery.fn.myHtml = function() {
	return jQuery( this ).clone().wrap( '<div>' ).parent().html();
}

/**
 *  Get transition time in milliseconds
 *
 *  @return { Number } Time in milliseconds
 */
jQuery.fn.transLength = function() {
	var trans = jQuery( this ).css( 'transition' );
	var res = trans.match( / [\d|\.]+s/g );
	var sec = Number( res[0].replace( 's','' ) );
	return sec*1000;
}