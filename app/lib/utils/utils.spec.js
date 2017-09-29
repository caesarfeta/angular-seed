define([
'./utils',
'lodash',
'./grandmaStar',
'./lumpyX'
],
function(
  utils,
  _,
  grandmaStar,
  lumpyX  ){
  
  var data = {
    lumpyX: lumpyX,
    grandmaStar: grandmaStar
  }
  
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
        },
        {
          points: [
            [ 1, 1 ], [ 2, 2 ],
            [ -1, -1 ], [ -2, -2 ]
          ],
          result: [ Infinity, Infinity ]
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