/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "DateConvert" );

test( "hijriToGreg-1", function() {
	var date = new DateConvert();
	var greg = date.hijriToGreg( 0 );
	ok( greg == 622 );
});

test( "gregToHijri-1", function() {
	var date = new DateConvert();
	var hij = date.gregToHijri( 622 );
	ok( hij == 0 );
});

test( "hijriToGreg-2", function() {
	var date = new DateConvert();
	var greg = date.hijriToGreg( 160 );
	ok( greg == 777 );
});

test( "gregToHijri-2", function() {
	var date = new DateConvert();
	var hij = date.gregToHijri( 777 );
	ok( hij == 160 );
});