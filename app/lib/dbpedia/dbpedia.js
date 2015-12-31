'use strict';

define([
'angular',
], 
function( angular ){
	angular.module('dbpedia',[ 'atCommon' ])
	
	.directive( 'dbpediaSearchInput', [
		'dbpedia',
		'spinSvc',
		function( dbpedia, spinSvc ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				templateUrl: 'lib/dbpedia/bio/input.html',
				link: function( scope, elem ){
					scope.search = '';
					var spinner = spinSvc.register( 'dbpedia-search-input' );
					scope.run = function(){
						spinner.on();
						dbpedia.img.http( scope.search ).then(
							function(){ spinner.off() }
						);
					}
				}
			}
		}
	])
	
	.directive( 'dbpediaQueryArea', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				template: '<textarea class="dbpedia-query-area" ng-model="search" ng-enter="run()"></textarea>',
				link: function( scope, elem ){
					scope.search = '';
					scope.run = function(){
						dbpedia.query.http( scope.search );
					}
				}
			}
		}
	])
	
	.directive( 'dbpediaQueryDump', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				template: '<pre class="dbpedia-search-dump">{{ output() }}</pre>',
				link: function( scope, elem ){
					scope.output = function(){
						return JSON.stringify( dbpedia.query.result, '', 2 );
					}
				}
			}
		}
	])
	
	.directive( 'dbpediaSpecies', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				templateUrl: 'lib/dbpedia/bio/species.html',
				link: function( scope, elem ){
					scope.dbpedia = dbpedia;
					scope.on = function(){
						return dbpedia.img.result != null && dbpedia.img.result.length > 0
					}
				}
			}
		}
	])
	
	.service( 'dbpediaQuery', [
		function(){
			var self = this;
			
			
			// Images
			
			self.img = function( config ){
				return '\
				PREFIX dbpedia2: <http://dbpedia.org/property/>\
				PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
				SELECT	?name, ?kingdom, ?phylum, ?class, ?order, ?family, ?genus, ?species, ?subspecies, ?img, ?abstract\
				WHERE {\
					?s	dbpedia2:regnum ?hasValue;\
						rdfs:label ?name\
						FILTER regex( ?name, "' + config.search + '", "i" )\
						FILTER ( langMatches( lang( ?name ), "EN" ))\
					?animal dbpedia2:name ?name;\
						foaf:depiction ?img;\
						dbpedia2:regnum ?kingdom\
						OPTIONAL { ?animal dbpedia2:ordo ?order . }\
						OPTIONAL { ?animal dbpedia2:phylum ?phylum . }\
						OPTIONAL { ?animal dbpedia2:classis ?class . }\
						OPTIONAL { ?animal dbpedia2:familia ?family . }\
						OPTIONAL { ?animal dbpedia2:genus ?genus . }\
						OPTIONAL { ?animal dbpedia2:species ?species . }\
						OPTIONAL { ?animal dbpedia2:subspecies ?subspecies . }\
						OPTIONAL {\
							?animal <http://dbpedia.org/ontology/abstract> ?abstract\
							FILTER ( langMatches( lang( ?abstract ), "EN" ))\
						}\
				}\
				GROUP BY ?name\
				LIMIT ' + config.limit
			};
			
			
			// Species in genus
			
			self.genus = {
				search: function( config ){
					return '\
					PREFIX dbpedia2: <http://dbpedia.org/property/>\
					PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
					SELECT	?s\
					WHERE {\
						?s dbpedia2:genus ?hasValue;\
							dbpedia2:genus ?name\
							FILTER regex( ?name, "' + config.name + '", "i" )\
							FILTER ( langMatches( lang( ?name ), "EN" ))\
					}\
					GROUP BY ?name\
					LIMIT ' + config.limit
				},
				species: {
					names: function( config ){
						return '\
						PREFIX dbpedia2: <http://dbpedia.org/property/>\
						PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
						SELECT	?species\
						WHERE {\
							?genus dbpedia2:genus ?hasValue;\
								dbpedia2:genus ?name\
								FILTER regex( ?name, "' + config.name + '", "i" )\
								FILTER ( langMatches( lang( ?name ), "EN" ))\
							?species dbpedia2:genus ?genus\
						}'
					},
					full: function( config ){
						return '\
						PREFIX dbpedia2: <http://dbpedia.org/property/>\
						PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
						SELECT	?name, ?kingdom, ?phylum, ?class, ?order, ?family, ?genus, ?species, ?subspecies, ?img, ?abstract\
						WHERE {\
							?s dbpedia2:genus ?hasValue;\
								dbpedia2:genus ?name\
								FILTER regex( ?name, "' + config.name + '", "i" )\
								FILTER ( langMatches( lang( ?name ), "EN" ))\
							?animal dbpedia2:genus ?s;\
								foaf:depiction ?img\
								OPTIONAL { ?animal dbpedia2:regnum ?kingdom . }\
								OPTIONAL { ?animal dbpedia2:name ?name . }\
								OPTIONAL { ?animal dbpedia2:ordo ?order . }\
								OPTIONAL { ?animal dbpedia2:phylum ?phylum . }\
								OPTIONAL { ?animal dbpedia2:classis ?class . }\
								OPTIONAL { ?animal dbpedia2:familia ?family . }\
								OPTIONAL { ?animal dbpedia2:genus ?genus . }\
								OPTIONAL { ?animal dbpedia2:species ?species . }\
								OPTIONAL { ?animal dbpedia2:subspecies ?subspecies . }\
								OPTIONAL {\
									?animal <http://dbpedia.org/ontology/abstract> ?abstract\
									FILTER ( langMatches( lang( ?abstract ), "EN" ))\
								}\
						}'
					}
				}
			}
		}
	])
	
	.service( 'dbpedia', [
		'$http',
		'$q',
		'dbpediaQuery',
		function( 
			$http, 
			$q,
			dbpediaQuery ){
				
			var url = "http://dbpedia.org/sparql";
			var self = this;
			self.buildUrl = function( query ){
				return encodeURI( url+"?query="+ query +"&format=json" );
			};
			self.http = function( config ){
				return $q( function( yes, no ){
					$http.get( self.buildUrl( config.query ) ).then(
						
						// success
					
						function( r ){
							config.success( r );
							yes( r );
						},
					
						// error
					
						function( r ){
							config.error( r );
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
			self.img.http = function( name ){
				self.img.search = name;
				return self.http({
					query: dbpediaQuery.img({ 
						search: name, 
						limit: 25 
					}),
					success: function( r ){ self.img.result = r.data.results.bindings },
					error: function( r ){}
				});
			};
		}
	]);
});