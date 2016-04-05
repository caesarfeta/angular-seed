define([
'../module'
], 
function( module ){
	module.service( 'dbpediaQuery', [
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
})