define([ 
'lodash'
],
function( _ ){
  'use strict';
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
  return TaxRates
})