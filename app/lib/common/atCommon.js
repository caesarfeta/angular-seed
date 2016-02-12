'use strict';

define([
'angular',
'jquery'
], 
function( angular, $ ){
	
	angular.module('atCommon',[])
	
	// run function on input enter
	
	.directive('ngEnter', function(){
		return function( scope, elem, attrs ){
			elem.bind( "keydown keypress", function( e ){
				if ( e.which === 13 ){
					
					// if shift key is pressed exit
					
					if ( e.shiftKey ){ return }
					
					scope.$apply(
						function(){
							scope.$eval( attrs.ngEnter );
						}
					);
					e.preventDefault();
				}
			})
		}
	})
	
	
	// shrink a resource link
	
	.filter('shrinkLink', function(){
		return function( input ){
			if ( input == undefined ){ return '...' }
			if ( input.indexOf( 'http' ) == 0 ){
				return input.substr( input.lastIndexOf('/') + 1 )
			}
			return input
		}
	})
	
	
	// spin service
	
	.service( 'spinSvc', [
		'spinItem',
		function( spinItem ){
			var self = this;
			self.ids = {};
			
			// build the spinItem
			// if it doesn't exist currently
			
			self.register = function( id ){
				if ( ! ( id in self.ids )){
					self.ids[ id ] = new spinItem();
				}
				return self.ids[ id ]
			};

			self.ready = function( id ){
				return id in self.ids
			}
		}
	])
	
	.factory( 'spinItem', [
		'$timeout',
		function( $timeout ){
			var wait = .5;
			var spinItem = function(){
				this.skip = false;
				this.elem = undefined;
				this.show = false;
			};

			spinItem.prototype.off = function( secs ){
				var self = this;
				self.skip = false;
				secs = ( secs == undefined ) ? wait : secs;
				$timeout(
					function(){
						if ( !self.skip ){
							$( self.elem ).hide();
							self.show = false;
						}
					},
					secs*1000
				);
			};

			spinItem.prototype.on = function(){
				var self = this;
				self.skip = true;
				self.show = true;
				if ( self.elem != undefined ){
					$( self.elem ).show();
				}
			};

			spinItem.prototype.setElem = function( elem ){
				var self = this;
				self.elem = elem;
				if ( self.show == true ){
					self.on();
				}
				else {
					self.off( 0 );
				}
			};

			return spinItem;
		}
	])
	
	.directive( 'spinner', [
		'spinSvc',
		function( spinSvc ){
			return {
				template: '<span><img src="assets/img/spin.gif"></span>',
				replace: true,
				scope: {
					spinId: '@'
				},
				link: function( scope, elem ){
	
					// watch for spinSvc registration
					
					var unbind = scope.$watch(
						function(){ return spinSvc.ready( scope.spinId )},
						function( n, o ){
							if ( n == undefined ){ return }
							if ( n === true ){
								start();
								unbind();
							}
						}
					);
					
					// start
					
					function start(){
						scope.spin = spinSvc.ids[ scope.spinId ];
						scope.spin.setElem( elem );
					}
				}
			}
		}
	])
	
	.service( 'atGen', [
		function(){
			var self = this;
			self.elemId = function(){
				function s4() {
					return Math.floor(( 1 + Math.random()) * 0x10000 )
							.toString( 16 )
							.substring( 1 );
				}
				return 'at' + s4() + s4();
			}
		}
	])
	
	.directive( 'atYear', [
		function(){
			return {
				template: '<span class="at-date">{{ time | date: "yyyy" }}</span>',
				replace: true,
				link: function( scope, elem ){
					scope.time = Date.now();
				}
			}
		}
	])
	
	.directive( 'atOwner', [
		function(){
			return {
				template: '<div class="at-owner">v<span app-version></span> &copy; Adam Tavares <span at-year></span></div>',
				replace: true
			}
		}
	])
	
});