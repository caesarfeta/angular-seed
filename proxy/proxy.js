var http = require( 'http' );
var https = require( 'https' );
var url = require( 'url' );
http.createServer( onRequest ).listen( 3000 );

function getProxy( req, client_res ){
	switch ( req.protocol ){
		case 'http:':
			return http.get( req, function( res ){
				console.log( res );
				res.pipe( client_res );
			});
		case 'https:':
			return https.get( req, function( res ){
				console.log( res );
				res.pipe( client_res );
			});
	}
		
}

function onRequest( client_req, client_res ){
	var req = url.parse( client_req.url.slice( 1, client_req.length ));
	var proxy = getProxy( req, client_res );
	if ( proxy == null ){ return }
	console.log( proxy );
	proxy.on( 'error', function( e ){ console.log( e ) });
	client_req.pipe( proxy );
}



/*
var httpProxy = require('http-proxy');
var url       = require('url');

httpProxy.createServer(function(req, res, proxy) {
  var urlObj = url.parse(req.url);

  req.headers.host  = urlObj.host;
  req.url           = urlObj.path;

  proxy.proxyRequest(req, res, {
    host    : urlObj.host,
    port    : 80,
    enable  : { xforward: true }
  });
}).listen(5000, function () {
  console.log("Waiting for requests...");
});
*/



/*
var http = require( 'http' ),
    url = require( 'url' );

exports.show = function( req, res, next ){
    var parts = url.parse( req.url, true );
    var query = url_parts.query;
    var options = {
        host: parts.host,
        path: parts.path
    };

    var callback = function( response ){
        var completeResponse = '';
        response.on( 'data', function( chunk ){
            completeResponse += chunk;
        });
		
    	response.on( 'end', function(){
			res.writeHead( 
				200, 
				{
					'Content-Type': response.headers['content-type'], 
					'Content-Length': response.headers['content-length'] 
				}
			);
            res.end( completeResponse, 'binary' );
		});
    };

    http.request( options, callback ).end();
};
*/