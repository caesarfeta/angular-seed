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
	.factory( 'pieChart',[
		
		/*
			var pieChart = angular.element( document.querySelector( '[ng-view]' )).injector().get( 'pieChart' );
			var pie = new pieChart({ elem: '.bar', data:[
				{ label: 'wow', value: 1 }, 
				{ label: 'dupe', value: 23 },
				{ label: 'how', value: 45 },
				{ label: 'defect', value: 21 },
				{ label: 'blow', value: 12 },
				{ label: 'gargh', value: 50  }
			]});
			pie.build();
		*/
		
		function(){
			var pieChart = function( config ){
				var self = this;
				self.elem = config.elem;
				self.data = config.data;
				$( self.elem ).addClass( 'pie-chart' );
			}
			
			pieChart.prototype.build = function(){
				var self = this;
				$( self.elem ).empty();
				
				var width = 960,
				    height = 500,
				    radius = Math.min( width, height ) / 2;
            	
				var color = d3.scale.ordinal()
				    .range([
						"#98abc5", 
						"#8a89a6", 
						"#7b6888", 
						"#6b486b", 
						"#a05d56", 
						"#d0743c", 
						"#ff8c00"
					]);
            	
				var arc = d3.svg.arc()
				    .outerRadius( radius - 10 )
				    .innerRadius( 0 );
            	
				var labelArc = d3.svg.arc()
				    .outerRadius( radius - 40 )
				    .innerRadius( radius - 40 );
            	
				var pie = d3.layout.pie()
				    .sort( null )
				    .value( function( d ){ 
						return d.value
					});
            	
				var svg = d3.select( self.elem )
					.append( "svg" )
					.attr( "width", width )
					.attr( "height", height )
					.append( "g" )
					.attr( "transform", "translate(" + width / 2 + "," + height / 2 + ")" );
            	
				var g = svg.selectAll(".arc")
					.data( pie( self.data ))
				    .enter()
					.append( "g" )
				    .attr( "class", "arc" );
            	
				g.append( "path" )
				.attr( "d", arc )
				.style( "fill", function( d, i ){ 
					return color( i ) 
				});
            	
				g.append( "text" )
				.attr( "transform", function( d ){ 
					return "translate(" + labelArc.centroid( d ) + ")" 
				})
				.attr( "dy", ".35em" )
				.text( function( d ){ 
					return d.data.label 
				});
			}
			
			return pieChart
		}
	])
	
	.factory( 'barComp',[
		
		/*
			var barComp = angular.element( document.querySelector( '[ng-view]' )).injector().get( 'barComp' );
			var bar = new barComp({ elem: '.bar', data:[
				{ label: 'wow', value: 1 }, 
				{ label: 'dupe', value: 23 },
				{ label: 'how', value: 45 },
				{ label: 'defect', value: 21 },
				{ label: 'blow', value: 12 },
				{ label: 'gargh', value: 50  }
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
			
			barComp.prototype.values = function(){
				var self = this;
				return self.data.map( function( item ){
					return item.value
				})
			};
			
			barComp.prototype.buildRange = function(){
				var self = this;
				self.translate = d3.scale.linear()
			    .domain([ 0, d3.max( self.values() )])
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
			    .style( "width", function( d ){ return self.translate( d.value ) + "px" })
				.append("span")
				.classed({"name":true})
				.text( function( d ){ return d.label +':'+ d.value })
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
				new atStream({ label: 'rent', value: -2000 }),
				new atStream({ label: 'gas', value: -100 }),
				new atStream({ label: 'elec', value: -25 }),
				new atStream({ label: 'internet', value: -80 }),
				new atStream({ label: 'food', value: -30, period: 'day' })
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
				self.value = config.value;
				
				// normalize
				
				if ( !('period' in config )){ return }
				switch( config.period ){
					case 'day':
						self.value = self.value * 31
						break;
					case 'year':
						self.value = self.value / 12
						break;
				}
			}
			atStream.prototype.isExpense = function(){ return this.value < 0 }
			atStream.prototype.isIncome = function(){ return this.value > 0 }
			atStream.prototype.perYear = function(){ return this.value * 12 }
			return atStream
		}
	])
});