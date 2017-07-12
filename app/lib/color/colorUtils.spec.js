define([
'./colorUtils'
],
function( colorUtils ){
  describe('colorUtils', function() {
    
    it('colorUtils', function(){
      expect( !!colorUtils ).toBe( true )
    })
    it('rgbDist exists', function(){
      expect( 'rgbDist' in  colorUtils ).toBe( true )
    })
    
    it('rgbDistance same', function(){
      expect( colorUtils.rgbDist( '#000', '#000') ).toBe( 0 )
    })
    
    it('rgbDistance max', function(){
      expect( colorUtils.rgbDist( '#000', '#FFF') > 1 ).toBe( true )
    })
    
    it('rgbClose', function(){
      expect( colorUtils.rgbClose( '#FFF', [ '#000', '#FFD', '#DDD' ] )).toBe( '#FFD' )
    })
    
    it('palGroup', function(){
      var p1 = [ '#000', '#999', '#EEE' ];
      var p2 = [ '#FFF', '#111', '#AAA' ];
      var grp = colorUtils.palGroup( p1, p2 );
      expect( 
        grp[0][1] == '#111' && 
        grp[1][1] == '#AAA' && 
        grp[2][1] == '#FFF' 
      ).toBe( true )
    })
  })
})