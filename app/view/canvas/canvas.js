define([ 
'angular',
'lib/viz/cubeTest',
'angularRoute'
],
function( angular, cubeTest ){
    
    angular.module( 'myApp.view.canvas', [ 'ngRoute' ])
    
    .controller('viewCanvasCtrl', [ function(){} ])
    
    .directive('canvasCubeTest', [
        function(){
            return {
                replace: true,
                link: function( scope, elem ){
                    window.viz = new cubeTest({ 
                        elem: elem.get(0)
                    });
                }
            }
        }
    ])
    
});