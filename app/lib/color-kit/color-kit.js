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
  .config([
    '$routeProvider', 
    function( $routeProvider ){
      var std = {
        template: [
          '<div class="color-kit">',
            //'<img ng-src="{{ img }}" />',
            //'<div ng-if="img"',
            //     'swatch-strip="{{ img }}">',
            //'</div>',
            //'<span img-mutate="mutate"></span>',
            '<span img-mutate-live="mutate"></span>',
            //'<div alert-more="color-kit"></div>',
          '</div>',
        ].join(' '),
        controller: 'colorKitCtrl'
      }
      $routeProvider.when('/color-kit', std )
      $routeProvider.when('/color-kit/:go*', std )
    }
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
})