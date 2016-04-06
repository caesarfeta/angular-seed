var http = require( 'http' );
var url = require( 'url' );
var request = require( 'request' );
var argv = require( 'minimist' )( process.argv.slice( 2 ));
console.log( argv );
http.createServer( onRequest ).listen( 5000 );
function onRequest( client_req, client_res ){
	var req = url.parse( client_req.url.slice( 1, client_req.length ));
	if ( req.host == null ){ return }
    client_res.setHeader( 'Access-Control-Allow-Origin', '*' );
	request.get( req.href ).pipe( client_res );
}