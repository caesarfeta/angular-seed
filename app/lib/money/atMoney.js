'use strict';

define([ 
'angular',
'lodash',
'd3'
],
function( 
	angular, 
	_,
	d3 ){
	
	angular.module( 'atMoney',[])
	.factory( 'barComp',[
		
		/*
			var barComp = angular.element( document.querySelector( '[ng-view]' )).injector().get( 'barComp' );
			var bar = new barComp({ elem: '.bar', data:[
				{ label: 'wow', amount: 1 }, 
				{ label: 'dupe', amount: 23 },
				{ label: 'how', amount: 45 },
				{ label: 'defect', amount: 21 },
				{ label: 'blow', amount: 12 },
				{ label: 'gargh', amount: 50  }
			]});
			bar.build();
		*/
		
		function(){
			var barComp = function( config ){
				var self = this;
				self.elem = config.elem;
				self.data = config.data;
				$( self.elem ).addClass( 'bar-comp' );
			};
			
			barComp.prototype.amounts = function(){
				var self = this;
				return self.data.map( function( item ){
					return item.amount
				})
			};
			
			barComp.prototype.buildRange = function(){
				var self = this;
				self.translate = d3.scale.linear()
			    .domain([ 0, d3.max( self.amounts() )])
				.range([ 0, $( self.elem ).innerWidth() ]);
			};
			
			barComp.prototype.plot = function(){
				var self = this;
				d3.select( self.elem )
				.selectAll( "div" )
				.data( self.data )
				.enter()
				.append( "div" )
				.insert("span")
				.classed({"bar":true})
			    .style( "width", function( d ){ return self.translate( d.amount ) + "px" })
				.append("span")
				.classed({"name":true})
				.text( function( d ){ return d.label +':'+ d.amount })
			}
			
			barComp.prototype.build = function(){
				var self = this;
				$( self.elem ).empty();
				self.buildRange();
				self.plot();
			};
			
			return barComp
		}
	])
	
	.service( 'taxRates',[
		function(){
			var taxRates = function(){
				var self = this;
				function inside( n, c1, c2 ){ return n >= c1 && ( c2 && n <= c2 )}
				self.rates = [
					{
						percent: 10,
						single: function( n ){ return inside( n, 0, 9275 )},
						joint: function( n ){ return inside( n, 0, 18550 )},
						head: function( n ){ return inside( n, 0,  13250 )}
					},
					{		
						percent: 15,
						single: function( n ){ return inside( n, 9275, 37650 )},
						joint: function( n ){ return inside( n, 18550, 75300 )},
						head: function( n ){ return inside( n, 13250, 50,400 )}
					},
					{
						percent: 25,
						single: function( n ){ return inside( n, 37650, 91150 )},
						joint: function( n ){ return inside( n, 75300, 151900 )},
						head: function( n ){ return inside( n, 50400, 130150 )}
					},
					{		
						percent: 28,
						single: function( n ){ return inside( n, 91150, 190150 )},
						joint: function( n ){ return inside( n, 151900, 231450 )},
						head: function( n ){ return inside( n, 130150, 210800 )}
					},
					{
						percent: 33,
						single: function( n ){ return inside( n, 190150, 413350 )},
						joint: function( n ){ return inside( n, 231450, 413350 )},
						head: function( n ){ return inside( n, 210800, 413350 )}
					},
					{
						percent: 35,
						single: function( n ){ return inside( n, 413350, 415050 )},
						joint: function( n ){ return inside( n, 413350, 466950 )},
						head: function( n ){ return inside( n, 413350, 441000 )}
					},
					{
						percent: 39.6,
						single: function( n ){ return inside( n, 415050 )},
						joint: function( n ){ return inside( n, 466950 )},
						head: function( n ){ return inside( n, 441000 )},
					}
				];
			}
			return taxRates
		}
	])
	
	.service( 'myBudget',[
		
		'atBudget',
		'atStream',
		'atMoney',
		
		function(
			atBudget,
			atStream,
			atMoney ){
			
			var self = this;
			self.me = new atMoney({ name: 'Adam', salary: 90000, age: 32 });
			self.budget = new atBudget();
			var streams = [
				new atStream({ label: 'rent', amount: -2000 }),
				new atStream({ label: 'gas', amount: -100 }),
				new atStream({ label: 'elec', amount: -25 }),
				new atStream({ label: 'internet', amount: -80 }),
				new atStream({ label: 'food', amount: -30, period: 'day' })
			]
			_.each( streams, 
				function( stream ){ 
					self.budget.addStream( stream ) 
				}
			);
		}
	])
	
	.factory( 'atBudget',[
		function(){
			var atBudget = function( config ){
				var self = this;
				self.streams = [];
			};
			atBudget.prototype.addStream = function( stream ){
				this.streams.push( stream );
			}
			atBudget.prototype.perYear = function(){
				var total = 0;
				_.each( this.streams, 
					function( stream ){
						total += stream.perYear();
					}
				);
				return total
			}
			return atBudget
		}
	])
	
	.factory( 'atMoney',[
		
		/*
			atMoney = angular.element( document.querySelector( '[ng-view]' )).injector().get( 'atMoney' );
			new atMoney({ name: 'Adam', salary: 90000, age: 32 });
		*/
		
		function(){
			var atMoney = function( config ){
				var self = this;
				self.salary = config.salary;
				self.age = config.age;
			};
			atMoney.prototype.perWeek = function(){ return this.salary / 52 }
			atMoney.prototype.perMonth = function(){ return this.salary / 12 }
			atMoney.prototype.perDay = function(){ return this.salary / 365 }
			atMoney.prototype.perHour = function(){ return this.perDay() / 24 }
			atMoney.prototype.perWorkHour = function(){ return this.perWeek() / 40 }
			atMoney.prototype.perWorkHourTuffWk = function(){ return this.perWeek() / 60 }
			return atMoney
		}
	])
	
	.factory( 'atStream',[
		function(){
			var atStream = function( config ){
				var self = this;
				self.label = config.label;
				self.amount = config.amount;
				
				// normalize
				
				if ( !('period' in config )){ return }
				switch( config.period ){
					case 'day':
						self.amount = self.amount * 31
						break;
					case 'year':
						self.amount = self.amount / 12
						break;
				}
			}
			atStream.prototype.isExpense = function(){ return this.amount < 0 }
			atStream.prototype.isIncome = function(){ return this.amount > 0 }
			atStream.prototype.perYear = function(){ return this.amount * 12 }
			return atStream
		}
	])
});