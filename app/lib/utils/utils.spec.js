define([
'./utils',
'lodash' 
],
function(
  utils,
  _ ){
  describe( 'utils', function() {
    it( '!!math.lineIntersect', function(){
      expect( !!utils.math.lineIntersect ).toBe( true )
    })
    it( 'math.lineIntersect', function(){
      var tests = [
        {
          points: [
            [ 1, 1 ], [ -1, -1 ],
            [ -1, 1 ], [ 1, -1 ] 
          ],
          result: [ 0, 0 ]
        }
      ]
      var results = tests.map( function( item ){
        return _.isEqual( utils.math.lineIntersect(
          item.points[0],
          item.points[1],
          item.points[2],
          item.points[3]
        ), item.result )
      })
      expect( _.every( results )).toBe( true )
    })
  })
})