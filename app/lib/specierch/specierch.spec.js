define([
'app', 
'angularMocks'
],
function(){
	describe('myApp.view.specierch module', function() {
	
		beforeEach( module( 'myApp.view.specierch' ));
		
		describe('specierch controller', function(){
		
			it('should ....', inject(function($controller) {
				expect($controller('SpecierchCtrl')).toBeDefined();
			}));
		
		});
	});
});