define([ 
'lodash',
'd3',
'./Stream',
'./Investment',
'./TaxRates',
'./Budget'
],
function( 
  _,
  d3,
  Stream,
  Investment,
  TaxRates,
  Budget ){
  'use strict';
  var taxRates = new TaxRates()
  
  // BarComp
  
  // var bar = new barComp({ elem: '.bar', data:[
  //   { label: 'wow', value: 1 }, 
  //   { label: 'dupe', value: 23 },
  //   { label: 'how', value: 45 },
  //   { label: 'defect', value: 21 },
  //   { label: 'blow', value: 12 },
  //   { label: 'gargh', value: 50  }
  // ]})
  // bar.build()
  
  var BarComp = function( config ){
    var self = this
    self.elem = config.elem
    self.data = config.data
    $( self.elem ).addClass( 'bar-comp' )
  }
  
  BarComp.prototype.values = function(){
    var self = this
    return self.data.map( function( item ){
      return item.value
    })
  }
  
  BarComp.prototype.buildRange = function(){
    var self = this
    self.translate = d3.scale.linear()
    .domain([ 0, d3.max( self.values() )])
    .range([ 0, $( self.elem ).innerWidth() ])
  }
  
  BarComp.prototype.plot = function(){
    var self = this
    d3.select( self.elem )
    .selectAll( "div" )
    .data( self.data )
    .enter()
    .append( "div" )
    .insert( "span" )
    .classed({ "bar":true })
    .style( "width", function( d ){
      return self.translate( d.value ) + "px"
    })
    .append( "span" )
    .classed({ "name":true })
    .text( function( d ){
      return d.label +':'+ d.value
    })
  }
  
  BarComp.prototype.build = function(){
    var self = this
    $( self.elem ).empty()
    self.buildRange()
    self.plot()
  }
  
  // PieChart
  
  // var pie = new PieChart({ elem: '.bar', data:[
  //   { label: 'wow', value: 1 }, 
  //   { label: 'dupe', value: 23 },
  //   { label: 'how', value: 45 },
  //   { label: 'defect', value: 21 },
  //   { label: 'blow', value: 12 },
  //   { label: 'gargh', value: 50  }
  // ]})
  // pie.build()
  
  var PieChart = function( config ){
    var self = this
    self.elem = config.elem
    self.data = config.data
    $( self.elem ).addClass( 'pie-chart' )
  }
  
  PieChart.prototype.build = function(){
    var self = this
    $( self.elem ).empty()
    
    var width = 960,
        height = 500,
        radius = Math.min( width, height ) / 2
    
    var color = d3.scale.ordinal()
        .range([
          "#98abc5", 
          "#8a89a6", 
          "#7b6888", 
          "#6b486b", 
          "#a05d56", 
          "#d0743c", 
          "#ff8c00"
        ])
    
    var arc = d3.svg.arc()
        .outerRadius( radius - 10 )
        .innerRadius( 0 )
    
    var labelArc = d3.svg.arc()
        .outerRadius( radius - 40 )
        .innerRadius( radius - 40 )
    
    var pie = d3.layout.pie()
        .sort( null )
        .value( function( d ){ 
        return d.value
      })
    
    var svg = d3.select( self.elem )
      .append( "svg" )
      .attr( "width", width )
      .attr( "height", height )
      .append( "g" )
      .attr( "transform", "translate(" + width / 2 + "," + height / 2 + ")" )
    
    var g = svg.selectAll(".arc")
      .data( pie( self.data ))
      .enter()
      .append( "g" )
      .attr( "class", "arc" )
          
    g.append( "path" )
    .attr( "d", arc )
    .style( "fill", function( d, i ){ 
      return color( i ) 
    })
    
    g.append( "text" )
    .attr( "transform", function( d ){ 
      return "translate(" + labelArc.centroid( d ) + ")" 
    })
    .attr( "dy", ".35em" )
    .text( function( d ){ 
      return d.data.label 
    })
  }
  
  // MyMoney
  
  var MyMoney = function(){
    var self = this
    self.my = {
      name: 'Adam',
      salary: 90000,
      age: 33
    }
    self.preTax = function(){
      return self.my.salary
    }
    self.postTax = function(){
      var c = taxRates.find({
        n: self.my.salary,
        type: 'single' 
      }) / 100
      return self.my.salary - ( self.my.salary * c )
    }
    self.budget = new Budget()
    var streams = [
      {
        label: 'rent',
        value: -2000
      },
      {
        label: 'gas',
        value: -100
      },
      {
        label: 'elec',
        value: -25
      },
      {
        label: 'internet',
        value: -80
      },
      {
        label: 'food',
        value: -30,
        period: 'day'
      }
    ]
    _.each( streams, 
      function( stream ){ 
        self.budget.addStream( stream ) 
      }
    )
    self.disposable = function(){
      return self.postTax() + self.budget.per( 'year' )
    }
    self.invest = {
      _401k: new Investment({
        value: self.disposable(),
        change: function( value ){
          return value + ( value * 0.01 )
        }
      }),
      IRA: new Investment({
        value: self.disposable(),
        change: function( value ){
          return value + ( value * 0.025 )
        }
      }),
      _10p: new Investment({
        value: self.disposable(),
        change: function( value ){
          return value + ( value * 0.1 )
        }
      })
    }
    self.howLong = function( n ){
      var years = Math.round( n / self.disposable())
      return {
        age: self.my.age + years,
        years: years,
        _401K: self.invest._401k.totalEarnedInt( years ),
        IRA: self.invest.IRA.totalEarnedInt( years ),
        _10p: self.invest._10p.totalEarnedInt( years )
      }
    }
  }
  return {
    barComp: BarComp,
    budget: Budget,
    myMoney: MyMoney,
    pieChart: PieChart,
    stream: Stream,
    investment: Investment,
    taxRates: taxRates
  }
})