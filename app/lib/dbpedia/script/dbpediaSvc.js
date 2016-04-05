define([
'../module',
'lodash'
], 
function( 
	module, 
	_ ){
	
	module.service( 'dbpediaSvc', [
		'$http',
		'$q',
		'dbpediaQuery',
		'spinSvc',
		function( 
			$http, 
			$q,
			dbpediaQuery,
			spinSvc ){
				
			var spinner = spinSvc.register( 'dbpedia-http' );
			function spinnerOff(){
				spinner.off( 2 );
			}
			
			var url = "http://dbpedia.org/sparql";
			var self = this;
			self.buildUrl = function( query ){
				return encodeURI( url+"?query="+ query +"&format=json" );
			};
			self.waiting = false;
			self.http = function( config ){
				spinner.on();
				self.waiting = true;
				return $q( function( yes, no ){
					$http.get( self.buildUrl( config.query ) ).then(
						
						// success
					
						function( r ){
							config.success( r );
							spinnerOff();
							self.waiting = false;
							yes( r );
						},
					
						// error
					
						function( r ){
							config.error( r );
							spinnerOff();
							self.waiting = false;
							no( r );
						}
					);
				})
			};
			
			// query search
			
			self.query = {};
			self.query.result = null;
			self.query.http = function( query ){
				return self.http({
					query: query,
					success: function( r ){ self.query.result = r },
					error: function( r ){ self.query.result = r }
				})
			}
			
			// img search
			
			self.img = {};
			self.img.result = null;
			self.img.search = null;
			self.img.history = [ 'ghost', 'death', 'gold', 'rainbow', 'glass' ];
			self.img.http = function(){
				return self.http({
					query: dbpediaQuery.img({ 
						search: self.img.search, 
						limit: 25 
					}),
					success: function( r ){ self.img.result = r.data.results.bindings },
					error: function( r ){}
				}).then( 
					
					// success
					
					function(){ 
						self.img.history = _.union( self.img.history, [ self.img.search ])
					},
					
					// error
					
					function(){}
				);
			};
		}
	])
})