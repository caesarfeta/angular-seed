define([
'app', 
'angularMocks'
],
function(){
	describe('dbpedia module', function() {
	
		beforeEach( module( 'dbpedia' ));
		
		var svc;
		var http;
		beforeEach( inject( function( $httpBackend, _dbpediaSvc_ ){
			svc = _dbpediaSvc_;
			http = $httpBackend;
		}));
		
		describe('dbpediaSvc', function(){
		
			it('has buildUrl method', function(){
				expect( 'buildUrl' in svc ).toBe( true );
			});
		
		});
	});
});