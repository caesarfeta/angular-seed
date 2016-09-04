/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "Palette" );

test( "Palette -- found", function() {
	var check = true;
	try {
		var p = new Palette( 'secondary' );
	}
	catch( _err ) {
		check = false;
	}
	ok( check == true );
});

test( "Palette -- not found", function() {
	var check = false;
	try {
		var p = new Palette( 'gobbledeegook' );
	}
	catch( _err ) {
		check = true;
	}
	ok( check == true );
});