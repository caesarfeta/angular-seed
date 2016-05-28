define([ 
'angular',
'lodash',
'lib/common/atCommon',
'lib/color/atColor'
],
function( angular, _ ){
    
    angular.module( 'myApp.view.colorKit', [ 
        'ngRoute',
        'atCommon',
        'atColor'
    ])
    
    .controller( 'colorKitCtrl', [ 
        '$scope',
        '$route',
        function( $scope, $route ){
            $scope.img = $route.current.params.img;
            $scope.mutate = {
                url: $scope.img,
                mutator: function( rgba, tick ){
                    return rgba.map( function( c, i ){
                        return ( i % 4 )
                            ?[ c[2], c[3], c[1], c[3] ]
                            :c
                    })
                },
                onError: function( error ){
                    console.log( error )
                }
            }
        } 
    ])
});