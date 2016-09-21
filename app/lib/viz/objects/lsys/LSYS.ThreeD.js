define([
'lib/js/Palette',
'./LSYS.Sys',
'lodash',
'threejs',
'lib/js/MathExt',
],
function( 
    Palette, 
    LSYS,
    _ ){
    
    // base rendering constants
    
    LSYS.Renderer = function(){
        this.constants = {
            '+': 'COUNTERCLOCK',
            '-': 'CLOCKWISE',
            '[': 'PUSH',
            ']': 'POP',
            'C': 'COLOR'
        };
    }
    
    //  3D renderer class
    
    LSYS.ThreeD = function( config ){
        LSYS.Renderer.call( this );
        
        //  Set options
        
        this.config = _.merge( config, {
            delay: 0,
            cube_size: 1
        });
        this.palette = new Palette( 'candy' );
    }
    LSYS.ThreeD.prototype = Object.create( LSYS.Renderer.prototype );
    LSYS.ThreeD.prototype.draw = function( sys, func, scene ){
        var coords = [];
        var angle = 0;
        var x = 0;
        var y = 0;
        
        //  Loop through the LSys input string
        
        var chars = sys.output.split('');
        for ( var i=0; i<chars.length; i++ ) {
            if ( chars[i] in this.constants ) {
                switch ( this.constants[ chars[i] ] ) {
                    case 'COUNTERCLOCK':
                        angle += sys.angle;
                        break;
                    case 'CLOCKWISE':
                        angle -= sys.angle;
                        break;
                }
            }
            
            //  Let's do some magic happen.
            
            else {
                var vector = Math.toCart( 1, Math.toRad( angle ) );
                x += vector[0];
                y += vector[1];
                coords.push( [x,y] );
            }
        }
        var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
        var geometry = new THREE.CubeGeometry( 
            this.config.cube_size, 
            this.config.cube_size, 
            this.config.cube_size 
        );
        for ( var i=0; i<geometry.faces.length; i+=2 ) {
            geometry.faces[ i ].color.setHex( this.palette.at(i).hex('0x') );
            geometry.faces[ i + 1 ].color.setHex( this.palette.at(i).hex('0x') );
        }
        
        //  Draw all of the coordinates
        
        for ( var j=0; j<coords.length; j++ ) {
            var cube = new THREE.Mesh( geometry, material );
            cube.position.y = coords[j][1];
            cube.position.x = coords[j][0];
            cube.position.z = ( !!func ) ? func( coords[j][0], coords[j][1], j, coords.length ) : 0;
            scene.add( cube );
        }
    }
     
     return LSYS
 });