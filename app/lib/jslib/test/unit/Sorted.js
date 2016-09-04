/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "Sorted" );

test( "numSort -- int flat", function() {
	var sorted = new Sorted();
	var test = sorted.numSort( [ 54, 67, 32, 55, 0, -12, 700 ] );
	var check = true;
	for ( var i=1, ii=test.length; i<ii; i++ ) {
		if ( test[i] < test[i-1] ) {
			check = false;
			break;
		}
	}
	ok( check == true );
});

test( "numSort -- real flat", function() {
	var sorted = new Sorted();
	var test = sorted.numSort( [ 5.4, .67, .032, 55.6, 0, Math.PI, -12, -7.00, -0.78 ] );
	var check = true;
	for ( var i=1, ii=test.length; i<ii; i++ ) {
		if ( test[i] < test[i-1] ) {
			check = false;
			break;
		}
	}
	ok( check == true );
});