define([
'./atMoney',
'../utils/utils',
'app',
'angularMocks'
],
function( at, utils ){
  describe( 'atMoney', function(){
    
    describe( 'myMoney', function(){
      it( 'exists', function(){
        var me = new at.myMoney()
        expect( !!me ).toBe( true )
      })
      it( 'preTax', function(){
        var me = new at.myMoney()
        expect( me.preTax() > me.postTax() ).toBe( true )
      })
      it( 'disposable', function(){
        var me = new at.myMoney()
        expect( me.preTax() > me.disposable())
      })
      it( 'budget.per', function(){
        var me = new at.myMoney()
        expect(
          Math.abs( me.budget.per( 'year' )) > Math.abs( me.budget.per( 'month' ))
        ).toBe( true )
      })
      it( 'budget.table', function(){
        var me = new at.myMoney()
        expect( !!me.budget.table() ).toBe( true )
      })
      it( 'howLong', function(){
        var me = new at.myMoney()
        console.log( me.howLong( 1000000 ))
        expect( me.howLong( 1000000 ).years ).toBe( 33 )
      })
    })
    
    describe( 'TaxRates', function(){
      it( 'exists', function(){
        expect( !!at.taxRates ).toBe( true )
      })
      it( 'find', function(){
        var me = new at.myMoney()
        expect(
          at.taxRates.find({
            n: me.my.salary,
            type: 'single' 
          })
        ).not.toBe( undefined )
      })
    })
    
    describe( 'Stream', function(){
      it( 'exists', function(){
        var stream = new at.stream({
          label: 'savings',
          value: 2000,
          period: 'month'
        })
        expect( !!stream ).toBe( true )
      })
    })
    
    describe( 'Investment', function(){
      it( 'run', function(){
        var inv = new at.investment({
          value: 70000,
          change: function( value ){
            return value + ( value * 0.05 )
          }
        })
        expect( !!inv.run().now ).toBe( true )
      })
      it( 'times', function(){
        var inv = new at.investment({
          value: 10000,
          change: function( value ){
            return value + ( value * 0.01 )
          }
        })
        expect( !!inv.times( 12 )).toBe( true )
      })
      it( 'runLite', function(){
        var inv = new at.investment({
          value: 10000,
          change: function( value ){
            return value + ( value * 0.01 )
          }
        })
        expect( !!inv.runLite() ).toBe( true )
      })
      it( 'timesLite', function(){
        var inv = new at.investment({
          value: 10000,
          change: function( value ){
            return value + ( value * 0.01 )
          }
        })
        expect( !!inv.timesLite( 12 )).toBe( true )
      })
      it( 'earnedInt', function(){
        var inv = new at.investment({
          value: 10000,
          change: function( value ){
            return value + ( value * 0.01 )
          }
        })
        expect( !!inv.earnedInt( 12 )).toBe( true )
      })
      it( 'totalEarnedInt', function(){
        var inv = new at.investment({
          value: 10000,
          change: function( value ){
            return value + ( value * 0.01 )
          }
        })
        expect( !!inv.totalEarnedInt( 12 )).toBe( true )
      })
    })
    
  })
})