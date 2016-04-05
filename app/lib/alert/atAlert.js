'use strict';

define([
'angular',
'jquery',
'bootstrap'
], 
function( angular, $ ){
	
	angular.module( 'atAlert', [ 'ui.bootstrap' ] )
	
	.service( 'alertMoreSvc',[
		'alertMore',
		function( alertMore ){
			var self = this;
			self.ids = {};
			
			self.register = function( id ){
				if ( ! ( id in self.ids )){
					self.ids[ id ] = new alertMore();
				}
				return self.ids[ id ]
			};

			self.ready = function( id ){
				return id in self.ids
			}
		}
		
	])
	
	.factory( 'alertMore' [
		'$timeout',
		function( $timeout ){
			var alertMore = function(){
			}
			
			alertMore.prototype.off = function(){}
			
			alertMore.prototype.on = function(){}
			
			alertMore.prototype.isOn = function(){}
			
			alertMore.prototype.popup = function(){}
		}
	] )
	
	.directive( 'alertMore', [
		function(){
			return {
				scope: {
					alertMore: '@'
				},
				replace: true,
				template: '<div ng-click="open" class="alert alert-danger">{{ alert }}</div>',
				link: function( scope, elem ){
					console.log( scope );
					scope.alert = 'whoop';
					scope.open = function(){
						console.log( 'open' );
					};
				}
			}
		}
	])
	
});