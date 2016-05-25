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
                template: [
                    
                    '<span>',
                        '<input class="dbpedia-search-input"',
                               'type="text"',
                               'ng-model="dbpedia.img.search"',
                               'ng-enter="run()"',
                               'placeholder="keyword" />',
                        '<spinner spin-id="dbpedia-http"></spinner>',
                    '</span>'
                    
                ].join(' '),
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