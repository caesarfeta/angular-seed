'use strict';

define([
'angular',
'lodash',
'lib/common/imgKit/imgKit'
], 
function( angular, _, imgKit ){
	angular.module('dbpedia',[ 'atCommon', 'imgKit' ])
	
	.directive( 'dbpImgHistory',[
		'dbpedia',
		'$compile',
		function( dbpedia, $compile ){
			return {
				replace: true,
				link: function( scope, elem ){
					
					function compile(){
						var history = angular.copy( dbpedia.img.history );
						history = history.map( function( key ){
							return "<dbp-key>" + key + "</dbp-key>"
						});
						history[ history.length -1 ] = 	"and " + history[ history.length -1 ];
						elem.html( $compile( history.join(', '))( scope ));
					}
					compile();
					
					scope.$watch( 
						function(){ return dbpedia.img.history },
						function( n,o ){
							if ( n==undefined || n==o ){ return }
							compile();
						}
					)
				}
			}
		}
	])
	
	.directive( 'dbpImgSearch', [
		'dbpedia',
		'spinSvc',
		function( dbpedia, spinSvc ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				templateUrl: 'lib/dbpedia/bio/input.html',
				link: function( scope, elem ){
					scope.dbpedia = dbpedia;
					scope.run = function(){
						dbpedia.img.http()
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
	
	.directive( 'dbpSpecies', [
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
						return dbpedia.img.result != null && dbpedia.img.result.length > 0 && !dbpedia.waiting
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
	
	.directive( 'dbpKey', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				transclude: true,
				scope: {},
				template: '<a href ng-click="click()" ng-transclude></a>',
				link: function( scope, elem ){
					scope.click = function(){
						dbpedia.img.search = elem.text();
						dbpedia.img.http();
					}
				}
			}
		}
	])
	
	.service( 'dbpedia', [
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
	]);
});