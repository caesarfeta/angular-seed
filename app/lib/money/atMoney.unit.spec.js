define([
'./atMoney',
'app',
'angularMocks'
],
function( at ){
  describe( 'atMoney', function(){
    
    describe( 'me', function(){
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
        console.log(
          me.budget.per( 'year' ),
          me.budget.per( 'month' ),
          me.budget.per( 'week' ),
          me.budget.per( 'day' ),
          me.budget.per( 'hour' )
        )
        expect( Math.abs( me.budget.per( 'year' )) > Math.abs( me.budget.per( 'month '))).toBe( true )
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
    
  })
})