'use strict';

define([ 
'angular',
'lodash',
'angularRoute',
'lib/maps/atMaps'
],
function( angular, _ ){
	
	angular.module( 'myApp.view.mapper', [ 'ngRoute', 'atMaps' ])

	.config([
		'$routeProvider', 
		function( $routeProvider ){
			var std = {
				templateUrl: 'view/mapper/mapper.html',
				controller: 'viewMapperCtrl'
			};
			$routeProvider.when('/mapper', std );
			$routeProvider.when('/mapper/:id', std );
		}
	])

	.controller('viewMapperCtrl', [ function(){} ])
	
	.service( 'mouseHelper', [
		function(){
			var self = this;
			
			self.relative = function( elem, event ){
			    var pos = elem.offset();
			    var x = ( event.clientX - pos.left);
			    var y = ( event.clientY - pos.top + $( document ).scrollTop() );
			    return { 
					x:x, 
					y:y 
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
		
		function( 
			highlite,
			mouseHelper ){
			var notator = function( elem ){
				var self = this;
				self.elem = elem;
				self.previewLite = new highlite();
				self.pressed = false;
				
				var c1 = null;
				$( self.elem )
				.on( 'touchstart mousedown', function( e ){
					self.pressed = true;
					c1 = mouseHelper.relative( self.elem, e );
				})
				.on( 'touchend mouseup', function( e ){
					self.pressed = false;
				})
				.on( 'touchmove mousemove', function( e ){
					if ( !self.pressed ){ return }
					var diff = mouseHelper.diff( c1, mouseHelper.relative( self.elem, e ));
					var width = self.elem.width();
					var height = self.elem.height();
					self.previewLite.update({
						x: c1.x / width,
						y: c1.y / height,
						width: diff.x / width,
						height: diff.y / height
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
	
	.directive( 'highliteArea', [
		function(){
			return {
				scope: {
					highliteArea: '=',
					parentElem: '='
				},
				replace: true,
				link: function( scope, elem ){
					scope.highliteArea.onUpdate( function(){
						var width = scope.parentElem.width();
						var height = scope.parentElem.height();
						$( elem ).css({
							position: 'relative',
							display: 'inline-block',
							left: scope.highliteArea.x * width,
							top: scope.highliteArea.y * height,
							width: scope.highliteArea.width * width,
							height: scope.highliteArea.height * height,
							'background-color': 'yellow'
						});
					});
				}
			}
		}
	])
	
	.directive( 'elemNotate', [
		'notator',
		function( notator ){
			
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
				}
			}
		}
	])
	
});