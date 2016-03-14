'use strict';

define([
'angular',
'jquery',
'jqueryUi'
], 
function( 
	angular, 
	$ ){
		
	angular.module('windowWrap',[ 'atCommon' ])
	
	.factory( 'windowItem', [
		'windowHub',
		function( windowHub ){
			var windowItem = function( id ){
				this.isOn = true;
				windowHub.register( id, this );
			};
			windowItem.prototype.toggle = function(){ 
				this.isOn = !this.isOn 
			};
			windowItem.prototype.turnOn = function(){ 
				this.isOn = true 
			};
			windowItem.prototype.turnOff = function(){ 
				this.isOn = false 
			};
			windowItem.prototype.location = function(){};
			return windowItem;
		}
	])
	
	.service( 'windowHub', [
		function(){
			var self = this;
			self.items = {};
			self.register = function( id, item ){
				self.items[ id ] = item;
			}
		}
	])
	
	.directive( 'windowWrap', [
		'windowItem',
		function( windowItem ){
			
			/*
			
				<div window-wrap="{ 
					id: 'test',
					width: '400px'
				}">
					Content
				</div>
			
			*/
			
			return {
				scope: {
					windowWrap: '='
				},
				transclude: true,
				replace: true,
				templateUrl: 'lib/windowWrap/window-wrap.html',
				link: function( scope, elem ){
					
					// get a window item
					
					scope.item = new windowItem( scope.windowWrap.id );
					
					// set width
					
					scope.css = function(){
						return {
							width: scope.windowWrap.width
						}
					}; 

					// draggable
					
					$( elem ).draggable({
						stack: '.window-wrap'
					});
				}
			}
		}
	])
	
});