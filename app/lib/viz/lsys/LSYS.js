define([
'./LSYS.ThreeD',
], 
function( LSYS ){
    // 3D
    
    LSYS.Lib = function( scene ){
        
        // build the renderer object
        
        var renderer = new LSYS.ThreeD({ 'delay': .001 });
        function build( sys, func ){
            sys.run();
            return renderer.draw( sys, func, scene );
        }
        
        return {
            dragonCurve: function(){
                return build(
                    new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' ),
                    function( _a, _b, _i ){
                        return _i*_b/5000;
                    }
                )
            },
            hexTri: function(){
                return build(
                    new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' ),
                    function( _a, _b, _i ){
                        return _i*_b/2000;
                    }
                )
            },
            shrimp: function(){
                return build(
                    new LSYS.Sys( 8, 60, 'A', 'A=B+A+B', 'B=A-BB' ),
                    function( _x, _y, _i, _total ){
                        return 10*Math.sin( (_i%_total) * Math.toRad( 15 ) );
                    }
                )
            },
            coil: function(){
                return build(
                    new LSYS.Sys( 6, 4, 'ABA', 'A=BB', 'B=A-BB' ),
                    function( _x, _y, _i, _total ){
                        return _i*_y/200;
                    }
                )
            },
            chip: function(){
                return build(
                    new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' ),
                    function( _x, _y, _i, _total ){
                        return _i/100;
                    }
                )
            },
            tornChip: function(){
                return build(
                    new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' ),
                    function( _x, _y, _i, _total ){
                        return _y+900/_x;
                    }
                )
            }
        }
    }

    
    LSYS.ThreeD_Chip = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _i/100;
        });
        var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_Chip.prototype = Object.create( LSYS.ThreeD.prototype );
    
    LSYS.ThreeD_ChipTear = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _y+900/_x;
        });
        var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_ChipTear.prototype = Object.create( LSYS.ThreeD.prototype );
    
    LSYS.ThreeD_U = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _i/_total;
        });
        var sys = new LSYS.Sys( 4, 270, 'A', 'A=--AA' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_U.prototype = Object.create( LSYS.ThreeD.prototype );
    
    return LSYS
})