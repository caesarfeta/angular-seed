/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "ArrayExt" );

test( "multijoin", function() {
	var ext = new ArrayExt();
	var array = [ '1', '1', '2', '2' ];
	ok( ext.multijoin( array, ['+',' '] ) == '1+1 2+2' );
});