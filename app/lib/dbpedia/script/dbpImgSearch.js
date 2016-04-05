define([
'../module',
], 
function( module ){
	
	module.directive( 'dbpImgSearch', [
		'dbpediaSvc',
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
})