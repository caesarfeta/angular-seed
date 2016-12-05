define([
'app', 
'angularMocks'
],
function(){
  describe('myApp.view.canvas module', function() {
    beforeEach( module( 'myApp.view.canvas' ))
    describe('mayApp.view.canvas controller', function(){
      it('should ....', inject( function( $controller ){
        var viewCanvasCtrl = $controller('viewCanvasCtrl')
        expect(viewCanvasCtrl).toBeDefined()
      }))
    })
  })
})