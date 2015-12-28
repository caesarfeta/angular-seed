'use strict';

define([
'angular',
'components/version/interpolate-filter',
'components/version/version-directive'
],
function( angular ){

	angular.module('myApp.version', [
		'myApp.version.interpolate-filter',
		'myApp.version.version-directive'
	])

	.value('version', '0.1');
});
