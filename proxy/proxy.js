var http = require( 'http' );
var url = require( 'url' );
http.createServer( onRequest ).listen( 3000 );

function onRequest( client_req, client_res ){
	var req = url.parse( client_req.url.slice( 1, client_req.length ) );
	var options = {
		hostname: req.host,
		path: req.path
	};
	var proxy = http.request( options, function( res ){
		res.pipe( client_res, { end: true } );
	});
	proxy.on( 'error', function( e ){
		console.log( e );
	});
	client_req.pipe( proxy, { end: true });
}