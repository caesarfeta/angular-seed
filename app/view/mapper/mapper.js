'use strict';

define([ 
'angular',
'lodash',
'jqueryUi',
'colorpicker.module',
'lib/maps/atMaps',
'lib/windowWrap/windowWrap',
'lib/money/atMoney'
],
function( angular, _ ){
	
	angular.module( 'myApp.view.mapper', [ 
		'ngRoute', 
		'atMaps',
		'colorpicker.module',
		'windowWrap',
		'atMoney'
	])

	.controller( 'viewMapperCtrl', [ function(){} ])
	
	.service( 'mouseHelper', [
		function(){
			var self = this;
			
			self.relative = function( event ){
			    return { 
					x: event.offsetX, 
					y: event.offsetY 
				}
			};
			
			self.diff = function( c1, c2 ){
				return { 
					x: c2.x-c1.x, 
					y: c2.y-c1.y 
				}
			}
		}
	])
	
	.factory( 'notator', [
		
		'highlite',
		'mouseHelper',
		'notateHub',
		
		function( 
			highlite,
			mouseHelper,
			notateHub ){
			var notator = function( elem ){
				var self = this;
				self.elem = elem;
				self.previewLite = new highlite();
				self.pressed = false;
				
				var c1 = null;
				$( self.elem )
				.on( 'touchstart mousedown', function( e ){
					self.pressed = true;
					c1 = mouseHelper.relative( e );
				})
				.on( 'touchend mouseup', function( e ){
					self.pressed = false;
				})
				.on( 'touchmove mousemove', function( e ){
					if ( !self.pressed ){ return }
					var diff = mouseHelper.diff( c1, mouseHelper.relative( e ));
					var width = self.elem.width();
					var height = self.elem.height();
					self.previewLite.update({
						x: c1.x / width,
						y: c1.y / height,
						width: diff.x / width,
						height: diff.y / height,
						color: notateHub.color.hex
					});
				});	
			};
			
			return notator
		}
	])
	
	.factory( 'highlite', [
		function(){
			
			// initialize
			
			var highlite = function(){
				this.updates = [];
				this.x = 
				this.y = 
				this.width = 
				this.height =
				this.color = null;
			};
			
			highlite.prototype.update = function( config ){
				angular.extend( this, config );
				_.each( this.updates, function( func ){ func() });
			}
			
			highlite.prototype.onUpdate = function( func ){
				this.updates.push( func );
			}
			
			return highlite
		}
	])
	
	.directive( 'highlite', [
		function(){
			return {
				scope: {
					highlite: '=',
					parentElem: '='
				},
				replace: true,
				link: function( scope, elem ){
					
					elem.addClass( 'lite' );
					
					function parentWidth(){
						return scope.parentElem.width()
					}
					
					function parentHeight(){
						return scope.parentElem.height()
					}
					
					// update
					
					scope.highlite.onUpdate( function(){
						var width = parentWidth();
						var height = parentHeight();
						$( elem ).css({
							left: scope.highlite.x * width,
							top: scope.highlite.y * height,
							width: scope.highlite.width * width,
							height: scope.highlite.height * height,
							'background-color': ( scope.highlite.color ) ? scope.highlite.color : 'yellow'
						});
					});
					
					elem.bind( 'touchstart mousedown', 
						function( e ){ 
							e.stopPropagation() 
						}
					);
					
					$( elem ).draggable({
						stack: '.lite',
						stop: function(){
							scope.highlite.update({
								x: $( elem ).css('left') / parentWidth(),
								y: $( elem ).css('top') /parentHeight()
							})
						}
					})
				}
			}
		}
	])
	
	.service( 'notateHub', [
		function(){
			var self = this;
			self.color = {
				hex: '#FFFF00' 
			}
		}
	])
	
	.directive( 'elemNotate', [
		'notator',
		'windowHub',
		'notateHub',
		function( 
			notator,
			windowHub,
			notateHub ){
			
			/*
			
				<div elem-notate>
					<div>Stuff</div>
				</div>
			
			*/
			
			return {
				scope: {
					elemNotate: '='
				},
				transclude: true,
				replace: true,
				templateUrl: 'view/mapper/elem-notate.html',
				link: function( scope, elem ){
					scope.notator = new notator( elem );
					scope.color = notateHub.color;
					scope.window = function(){
						return windowHub.get( 'lite-color' );
					}
				}
			}
		}
	])
	
});