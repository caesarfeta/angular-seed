'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('dbpedia',[])
	.service( 'dbpedia', [
		'$http',
		function( $http ){
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
				$http.get( queryUrl ).then(
					
					// success
					
					function( r ){
						console.log( r );
					},
					
					// error
					
					function( r ){
						console.log( r );
					}
				)
			}
		}
	]);
});