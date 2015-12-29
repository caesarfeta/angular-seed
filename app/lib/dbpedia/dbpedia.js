'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('dbpedia',[])
	
	.directive( 'dbpediaSearchInput',[
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				template: '<input type="text" ng-model="searchFor" ng-enter="run" placeholder="search for..." />',
				link: function( scope, elem ){
					scope.searchFor = '';
					scope.run = function(){
						console.log( scope.search )
					}
				}
			}
		}
	])
	
	.directive( 'dbpediaDump', [])
	
	.service( 'dbpedia', [
		'$http',
		'$q',
		function( $http, $q ){
			var self = this;
			
			var url = "http://dbpedia.org/sparql";
			var imgSearch = function( search ){ return '\
				PREFIX dbpedia2: <http://dbpedia.org/property/>\
				PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
				SELECT	?name, ?kingdom, ?phylum, ?class, ?order, ?family, ?genus, ?species, ?subspecies, ?img, ?abstract\
				WHERE {\
					?s	dbpedia2:regnum ?hasValue;\
						rdfs:label ?name\
						FILTER regex( ?name, "' + search + '", "i" )\
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
				LIMIT 50\
			'};
			
			self.img = function( search ){
				var queryUrl = encodeURI( url+"?query="+imgSearch( search )+"&format=json" );
				return $q( function( yes, no ){
					$http.get( queryUrl ).then(
					
						// success
					
						function( r ){
							yes( r.data.results.bindings )
						},
					
						// error
					
						function( r ){
							no( r )
						}
					)
				})
			}
		}
	]);
});