/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "ObjectExt" );

var obj = {
	country: {
		France: [
			'Paris',
			'Lyon',
			'Nice',
			'Dijon'
		],
		England: [
			'London',
			'Bath',
			'Waterloo',
			'Kent'
		]
	},
	planet: [
		'Mercury',
		'Venus',
		'Earth',
		'Mars',
		'Jupiter',
		'Saturn',
		'Uranus',
		'Neptune'
	]
}

test( "byString", function() {
	var objExt = new ObjectExt();
	ok( obj['country']['France'][0] == objExt.byString( obj, "['country']['France'][0]") );
});

test( "isEmpty-1", function() {
	var oe = new ObjectExt();
	var h = {};
	ok( oe.isEmpty( h ) == true );
})

test( "isEmpty-2", function() {
	var oe = new ObjectExt();
	var h = { i: 1 };
	ok( oe.isEmpty( h ) == false );
})