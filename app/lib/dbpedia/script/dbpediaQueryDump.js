define([
'../module',
], 
function( module ){
	
	module.directive( 'dbpediaQueryDump', [
		'dbpediaSvc',
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
})