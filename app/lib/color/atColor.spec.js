define([
'app', 
'angularMocks'
],
function(){
    describe('imgMutate', function() {
        var scope, elem, ready = null;
        beforeEach( module('atColor'));
        beforeEach( inject( function( $rootScope, $compile ){
            elem = angular.element( '<div img-mutate="mutate" src="src"></div>' );
            scope = $rootScope;
            scope.mutate = function( pixels, done ){ done() };
            scope.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Mona_Lisa_(copy,_Hermitage).jpg';
            $compile( elem )( scope );
            scope.$digest();
        }))
        afterEach( function(){
            // clean out
        })
        
        it( 'img-mutate', function( done ){
            expect( true ).toBe( true );
            setTimeout( function(){
                done();
            }, 3000 )
        })
    });
});