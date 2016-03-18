'use strict';

define([ 
'angular',
'lodash',
'angularRoute',
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
				templateUrl: 'view/color-kit/color-kit.html',
				controller: 'colorKitCtrl'
			};
			$routeProvider.when('/color-kit', std );
			$routeProvider.when('/color-kit/:id', std );
		}
	])

	.controller( 'colorKitCtrl', [ function(){} ])
	
});