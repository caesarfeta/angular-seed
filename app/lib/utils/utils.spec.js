define([
'./utils', 
],
function( utils ){
  describe( 'utils', function() {
    it( '!!math.lineIntersect', function(){
      expect( !!utils.math.lineIntersect ).toBe( true )
    })
    it( 'math.lineIntersect', function(){
      expect(
        utils.math.lineIntersect(
          [ 1, 1 ], [ -1, -1 ],
          [ -1, 1 ], [ 1, -1 ] 
        )
      ).toBe( [ 0, 0 ] )
    })
  })
})