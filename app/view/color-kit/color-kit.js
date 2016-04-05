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
		} 
	])
});