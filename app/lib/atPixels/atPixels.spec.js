define([
'./atPixels',
'../utils/utils'
],
function( atPixels, utils ){
  describe('atPixels', function(){
    it('exists', function(){
      expect( !!atPixels ).toBe( true )
    })
    it('Grid()', function(){
      var grid = new atPixels.Grid()
      expect( !!grid ).toBe( true )
    })
    it('grid.addFrame()', function(){
      var grid = new atPixels.Grid()
      grid.addFrame()
      expect( grid.frames.length ).toBe( 1 )
    })
    it('active', function(){
      var grid = new atPixels.Grid()
      grid.addFrame()
      expect( grid.frames.length-1 ).toBe( grid.activeIndex )
    })
    it('color frame', function(){
      var grid = new atPixels.Grid()
      var c = 16
      grid.addFrame({
        cols: c,
        pixels: utils.nTimes( c*c, function( i ){ 
          return i*2 
        })
      })
      expect( grid.active().pixels.length ).toBe( c*c )
    })
  })
})