
// Get a quality timestamp
// @requires datejs ../third_party/datejs.date.js [ http://www.datejs.com/ ]
// @requires StringExt.js

function TimeStamp(){}

TimeStamp.prototype.xsd = function(){
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = ('0' + (d.getMonth()+1)).slice(-2);
	var dd = ('0' + d.getDate()).slice(-2);
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var sec = ('0' + d.getSeconds()).slice(-2);
	var diff = d.getTimezoneOffset();
	
	var time = yyyy+'-'+mm+'-'+dd+' '+hh+":"+min+":"+sec+' ';
	if ( diff > 0 ) {
		time = time+"+"+this.pad( 4, diff );
	}
	else {
		time = time+"-"+this.pad( 4, diff );
	}
	return time;
}

// Pad a number

TimeStamp.prototype.pad = function( n, num ){
	if ( num <= parseInt('9'.repeat(n) )){ 
		num = ('0'.repeat(n-1)+num).slice(-n); 
	}
	  return num;
}


// Return a timestamp with a UTC offset

// @param { boolean } _milli include milliseconds
// @return { string } timestamp with UTC offset

TimeStamp.prototype.withUtc = function( _milli ){
	var d = new Date();
	var yyyy = d.getFullYear();
	var mm = ('0' + (d.getMonth()+1)).slice(-2);
	var dd = ('0' + d.getDate()).slice(-2);
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var sec = ('0' + d.getSeconds()).slice(-2);
	var mil = ('0' + d.getMilliseconds()).slice(-3);
	var diff = d.getTimezoneOffset();
	
	//  Include milliseconds?

	var time = '';
	if ( _milli ) {
		time = yyyy+'-'+mm+'-'+dd+'T'+hh+":"+min+":"+sec+":"+mil+"UTC";
	}
	else {
		time = yyyy+'-'+mm+'-'+dd+'T'+hh+":"+min+":"+sec+"UTC";		
	}
	
	//  Get the timezone offset
	
	if ( diff > 0 ) {
		time = time+"+"+diff;
	}
	else {
		time = time+"-"+diff;
	}
	return time;
}


// Return the time of day
   
// @return { String } Easily understood time of day

TimeStamp.prototype.timeOfDay = function(){
	var d = new Date();
	var hh = d.getHours();
	var min = ('0' + d.getMinutes()).slice(-2);
	var dd = "AM";
	if ( hh > 12 ) {
		hh = hh-12;
		dd = "PM";
	}
	hh = ( hh == 0 ) ? 12 : hh;
	return hh+":"+min+" "+dd;
}


// Return unix time

// @return { int } unix time

TimeStamp.prototype.unix = function(){
	return new Date().getTime();
}


// Return millisecond unix time from UTC string
   
// @param { string } _string timestamp with UTC offset
// @return { int } unix time

TimeStamp.prototype.toUnix = function( _string ){
	
	// Kill the UTC offset

	var cleanTime = _string.replace( /UTC.*/, '' );
	var milli = 0;

	// Grab the milliseconds if they exist

	if ( cleanTime.match( /:\d{3}/ ) ) {
		milli = cleanTime.slice( -4 );
		cleanTime = cleanTime.replace( /:\d+$/, '' );
		milli = parseInt( milli.replace(':','') );
	}
	return Date.parse( cleanTime ).getTime() + milli;
}