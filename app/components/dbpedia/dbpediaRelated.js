'use strict';

define([
'angular',
'components/dbpedia/dbpedia'
], 
function( angular ){
	angular.module('dbpedia' )
	.service( 'dbpediaRelated', [
		'$http',
		function( $http ){
			var self = this;
			self.check = function(){
				/*
				
					SELECT ?property ?hasValue ?isValueOf
					WHERE {
						{ <http://dbpedia.org/resource/Naultinus> <dbpedia:ontology/genus> ?hasValue }
					UNION
						{ ?isValueOf ?property <http://dbpedia.org/resource/Naultinus> }
					}
				*/
				console.log( 'check, check, check' );
			}
		}
	]);
});