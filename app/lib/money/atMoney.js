define([ 
'lodash',
'd3',
'./Stream'
],
function( 
  _,
  d3,
  Stream ){
  'use strict';
  
  // Budget
  
  var Budget = function( config ){
    var self = this
    self.streams = []
  }
  Budget.prototype.addStream = function( stream ){
    var self = this
    self.streams.push( new Stream( stream ))
  }
  Budget.prototype.per = function( type ){
    var self = this
    var total = 0
    _.each( self.streams, 
      function( stream ){
        var func = ( 'per' + type[0].toUpperCase() + type.slice(1) ).trim()
        if ( !stream[ func ] ){
          throw( 'type not found')
        }
        total += stream[ func ]()
      }
    )
    return total
  }
  
  // Money
  
  var Money = function( config ){
    var self = this
    self.salary = config.salary
    self.age = config.age
  }
  Money.prototype.perWeek = function(){
    var self = this
    return self.salary / 52
  }
  Money.prototype.perMonth = function(){
    var self = this
    return self.salary / 12
  }
  Money.prototype.perDay = function(){
    var self = this
    return self.salary / 365
  }
  Money.prototype.perHour = function(){
    var self = this
    return self.perDay() / 24
  }
  Money.prototype.perWorkHour = function(){
    var self = this
    return self.perWeek() / 40
  }
  Money.prototype.perWorkHourTuffWk = function(){
    var self = this
    return self.perWeek() / 60
  }
  
  // TaxRates
  
  var TaxRates = function(){
    var self = this
    function inside( n, c1, c2 ){
      return n >= c1 && ( c2 && n <= c2 )
    }
    self.rates = [
      {
        percent: 10,
        single: function( n ){
          return inside( n, 0, 9275 )
        },
        joint: function( n ){
          return inside( n, 0, 18550 )
        },
        head: function( n ){
          return inside( n, 0,  13250 )
        }
      },
      {   
        percent: 15,
        single: function( n ){
          return inside( n, 9275, 37650 )
        },
        joint: function( n ){
          return inside( n, 18550, 75300 )
        },
        head: function( n ){
          return inside( n, 13250, 50,400 )
        }
      },
      {
        percent: 25,
        single: function( n ){
          return inside( n, 37650, 91150 )
        },
        joint: function( n ){
          return inside( n, 75300, 151900 )
        },
        head: function( n ){
          return inside( n, 50400, 130150 )
        }
      },
      {   
        percent: 28,
        single: function( n ){
          return inside( n, 91150, 190150 )
        },
        joint: function( n ){
          return inside( n, 151900, 231450 )
        },
        head: function( n ){
          return inside( n, 130150, 210800 )
        }
      },
      {
        percent: 33,
        single: function( n ){
          return inside( n, 190150, 413350 )
        },
        joint: function( n ){
          return inside( n, 231450, 413350 )
        },
        head: function( n ){
          return inside( n, 210800, 413350 )
        }
      },
      {
        percent: 35,
        single: function( n ){
          return inside( n, 413350, 415050 )
        },
        joint: function( n ){
          return inside( n, 413350, 466950 )
        },
        head: function( n ){
          return inside( n, 413350, 441000 )
        }
      },
      {
        percent: 39.6,
        single: function( n ){
          return inside( n, 415050 )
        },
        joint: function( n ){
          return inside( n, 466950 )
        },
        head: function( n ){
          return inside( n, 441000 )
        }
      }
    ]
    self.find = function( arg ){
      if ( !_.includes([ 'single', 'joint','head' ], arg.type.toLowerCase() )){
        throw( arg.type + 'not a valid type' )
      }
      var found = _.find( self.rates, function( rate ){
        return rate[ arg.type ]( arg.n )
      })
      if ( !!found ){
        return found.percent
      }
    }
  }
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
    self.my = new Money({
      name: 'Adam',
      salary: 90000,
      age: 33
    })
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
  }
  return {
    barComp: BarComp,
    budget: Budget,
    money: Money,
    myMoney: MyMoney,
    pieChart: PieChart,
    stream: Stream,
    taxRates: taxRates
  }
})