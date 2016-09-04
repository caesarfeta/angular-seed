/**
 * @author AdamTavares / http://adamtavares.com
*/
module( "StringExt" );

test( "shellArgs-0", function() {
	ok( '1 2 3 "4 5 6" 7 8'.shellArgs().length == 6 );
});

test( "occurs-0", function() {
	var string = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, \
	 sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \
	 Ut enim ad minim veniam, \
	 quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \
	 Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \
	 Excepteur sint occaecat cupidatat non proident, \
	 sunt in culpa qui officia deserunt mollit anim id est laborum.";
	
	var count = string.occurs( 'in' );
	ok( count == 7 );
});

test( "occurs-1", function() {
	var string = "1234567890";
	var count = string.occurs();
	ok( count == 10 );
});

test( "occurs-2", function() {
	var string = "aaa";
	var count = string.occurs( 'aa' );
	ok( count == 1 );
});

test( "occurs-3", function() {
	var string = "aaa";
	var count = string.occurs( 'aa', true );
	ok( count == 2 );
});

test( "sentences-0", function() {
	var string = "Hi! How are you? Can we talk?? Please?";
	var sent = string.sentences();
	ok( sent.length == 4 );
});

test( "sentences-1", function() {
	var string = "Did you enjoy living in Washington, D.C.?";
	var sent = string.sentences();
	ok( sent.length == 1 );
});

test( "sentences-2", function() {
	var string = "Dr. Espinoza arrived from Washington, D.C., at 6 p.m.";
	var sent = string.sentences();
	ok( sent.length == 1 );
});

test( "sentences-2", function() {
	var string = "Dr. Mark E. Wahlberg has a meeting with U.N.I.C.E.F at 9 A.M. and with S.H.I.E.L.D at 10 A.M.";
	var sent = string.sentences();
	ok( sent.length == 1 );
});

test( "report-0", function() {
	var string = "Dog Dog Dog Dog Dog";
	var report = string.report();
	ok( report['dog'] == 5 );
})

test( "report-1", function() {
	var string = "Dog Dog Cat Bunny Bunny";
	var report = string.report();
	ok( report['dog'] == 2 && report['cat'] == 1 && report['bunny'] == 2 );
})

test( "params-0", function() {
	var string = "http://www.breakfast.edu?flake=friend&dog=pluck";
	var params = string.params();
	ok( params['flake'] == "friend" && params['dog'] == "pluck" );
})