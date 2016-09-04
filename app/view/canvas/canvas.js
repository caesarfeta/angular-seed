define([ 
'angular',
'lib/viz/viz',
'angularRoute'
],
function( angular, viz ){
    
    angular.module( 'myApp.view.canvas', [ 'ngRoute' ])
    
    .controller('viewCanvasCtrl', [ function(){} ])
    
    .directive('canvasCubeTest', [
        function(){
            return {
                replace: true,
                link: function( scope, elem ){
                    window.viz = new viz({ 
                        elem: elem.get(0)
                    });
                }
            }
        }
    ])
    
});