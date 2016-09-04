/* requires StringExt.js */
/* 
   Checkout jslib/examples/Contemplate to learn how to use Contemplate
*/
function Contemplate() {
	var grabber = jQuery('*[data-contemplate="go"]');
	grabber.each( function(_i){
		var me = jQuery( this );
		//------------------------------------------------------------
		//  Grab the parameters if they exist.
		//------------------------------------------------------------
		var params = [];
		if ( params = me.attr('data-params') ) {
			params = params.shellArgs();
		}
		//------------------------------------------------------------
		//  If a Replacer function exists then pass the params to it.
		//------------------------------------------------------------
		var map = {};
		if ( map = me.attr('data-replacer') ) {
			map = Replacers[ map ]( params, _i+1 );
		}
		//------------------------------------------------------------
		//  Grab the template and do it again.
		//------------------------------------------------------------
		jQuery.ajax({
			url: me.attr('data-file'),
			type: 'GET',
			success: function( _data ) {
				me.replaceWith( _data.template( map ) );
				Contemplate();
			},
		});
	});
}