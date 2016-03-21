var http = require( 'http' );
var https = require( 'https' );
var url = require( 'url' );
var request = require( 'request' );
http.createServer( onRequest ).listen( 3000 );
function onRequest( client_req, client_res ){
	var req = url.parse( client_req.url.slice( 1, client_req.length ));
	if ( req.host == null ){ return }
	request.get( req.href ).pipe( client_res );
}