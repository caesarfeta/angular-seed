define([
'tinycolor'
],
function( tinycolor ){
    describe('tinycolor', function() {

        it('loaded', function(){
        	expect( tinycolor ).not.toBe( undefined );
        });

        it('black is not bright', function(){
            var c = tinycolor('black');
            expect( c.getBrightness() ).toBe( 0 );
        })

        it('black is black', function(){
            var c = tinycolor('#000');
            expect( c.toName() ).toBe( "black" );
        })

        it('"green" is not green', function(){
            var g = tinycolor('green');
            expect( g.toHex() ).toBe( '008000' )
        })

        it('greyscale primaries', function(){
            var r = tinycolor('red').greyscale().toHex();
            var g = tinycolor('#00FF00').greyscale().toHex();
            var b = tinycolor('blue').greyscale().toHex();
            expect( 
                r == g &&
                r == b &&
                g == b
            ).toBe( true );
        })
	});
});