'use strict';

define([
'angular',
'dbpedia/dbpedia'
], 
function( angular ){
	angular.module('dbpedia' )
	.service( 'dbpediaRelated', [
		'$http',
		function( $http ){
			var self = this;
			self.check = function(){
				console.log( 'check, check, check' );
			}
		}
	]);
});