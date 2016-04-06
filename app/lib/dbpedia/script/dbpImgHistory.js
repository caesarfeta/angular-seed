define([
'../module'
], 
function( module ){
	module.directive( 'dbpImgHistory',[
		'dbpediaSvc',
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
})