'use strict';

define([
'angular'
], 
function( angular ){
	angular.module('dbpedia',[])
	
	.directive( 'dbpediaSearchInput', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				template: '<input class="dbpedia-search-input" type="text" ng-model="search" ng-enter="run()" placeholder="search for..." />',
				link: function( scope, elem ){
					scope.search = '';
					scope.run = function(){
						dbpedia.img.http( scope.search );
					}
				}
			}
		}
	])
	
	.directive( 'dbpediaSearchDump', [
		'dbpedia',
		function( dbpedia ){
			return {
				restrict: 'E',
				replace: true,
				scope: {},
				template: '<pre class="dbpedia-search-dump">{{ output() }}</pre>',
				link: function( scope, elem ){
					scope.output = function(){
						return JSON.stringify( dbpedia.result, '', 2 );
					}
				}
			}
		}
	])
	
	.directive('ngEnter', function(){
		return function( scope, elem, attrs ){
			elem.bind( "keydown keypress", function( e ){
				if ( e.which === 13 ){
					scope.$apply(
						function(){
							scope.$eval( attrs.ngEnter );
						}
					);
					e.preventDefault();
				}
			})
		}
	})
 
	
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
			
			self.result = null;
			self.img = {
				http: function( search ){
					var queryUrl = encodeURI( url+"?query="+imgSearch( search )+"&format=json" );
					return $q( function( yes, no ){
						$http.get( queryUrl ).then(
					
							// success
					
							function( r ){
								console.log( r );
								self.result = r.data.results.bindings;
								yes( self.result )
							},
					
							// error
					
							function( r ){
								no( r )
							}
						)
					})
				},
				result: self.result
			};
		}
	]);
});