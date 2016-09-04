/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "SharedConfig" );

test( "singleton?", function() {
	var a = new SharedConfig();
	var b = new SharedConfig();
	ok( a === b );
});

test( "same value?", function() {
	var a = new SharedConfig();
	a.add( 'dog', 'cat' );
	var b = new SharedConfig();
	ok( a.get('dog') === b.get('dog') );
});