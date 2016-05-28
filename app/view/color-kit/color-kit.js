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
        'mutators',
        function( $scope, $route, mutators ){
            $scope.img = $route.current.params.img;
            $scope.mutate = {
                url: $scope.img,
                mutator: mutators.greenStripe,
                onError: function( error ){
                    console.log( error )
                }
            }
        } 
    ])
});