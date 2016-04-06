define([
'../module',
], 
function( module ){
	module.directive( 'dbpSpecies', [
		'dbpediaSvc',
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
})