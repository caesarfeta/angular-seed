/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "Culuh" );

test( "rgbUpdate-FFA934", function() {
	var culuh = new Culuh( '#FFA934' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-A934FF", function() {
	var culuh = new Culuh( '#A934FF' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-DDDDDD", function() {
	var culuh = new Culuh( '#DDDDDD' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-DDFFDD", function() {
	var culuh = new Culuh( '#DDFFDD' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-FFFFFF", function() {
	var culuh = new Culuh( '#FFFFFF' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-000000", function() {
	var culuh = new Culuh( '#000000' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});

test( "rgbUpdate-FF0000", function() {
	var culuh = new Culuh( '#FF0000' );
	var hex1 = culuh.hex();
	culuh.rgbUpdate();
	var hex2 = culuh.hex();
	ok( hex1 == hex2 );
});