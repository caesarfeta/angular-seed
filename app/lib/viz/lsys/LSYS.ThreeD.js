define([
'threejs',
'lib/viz/lsys/LSYS.Sys'
],
function(){
    
    //  3D renderer class
    
    LSYS.ThreeD = function( _canvas, _options ){
        LSYS.Renderer.call( this, _canvas );
        
        //  Set options
        
        this.options = ( _options == undefined ) ? {} : _options;
        this.options['delay'] = ( this.options['delay'] == undefined ) ? 0 : this.options['delay'];
        self.i = 1;
    }
    LSYS.ThreeD.prototype = Object.create( LSYS.Renderer.prototype );
    LSYS.ThreeD.prototype.draw = function( _input, _angle, _renderer) {
        var coords = [];
        var angle = 0;
        var x = 0;
        var y = 0;
        
        //  Loop through the LSys input string
        
        var chars = _input.split('');
        for ( var i=0; i<chars.length; i++ ) {
            if ( chars[i] in this.constants ) {
                switch ( this.constants[ chars[i] ] ) {
                    case 'COUNTERCLOCK':
                        angle += _angle;
                        break;
                    case 'CLOCKWISE':
                        angle -= _angle;
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
        var geometry = new THREE.CubeGeometry( this.cube_size, this.cube_size, this.cube_size );
        var mergedCubes = new THREE.Geometry();
        for ( var i=0; i<geometry.faces.length; i+=2 ) {
            geometry.faces[ i ].color.setHex( this.palette.at(i).hex('0x') );
            geometry.faces[ i + 1 ].color.setHex( this.palette.at(i).hex('0x') );
        }
        
        //  Draw all of the coordinates
        
        for ( var j=0; j<coords.length; j++ ) {
            var cube = new THREE.Mesh( geometry, material );
            cube.position.y = coords[j][1];
            cube.position.x = coords[j][0];
            cube.position.z = ( this.func != undefined ) ? this.func( coords[j][0], coords[j][1], j, coords.length ) : 0;
            THREE.GeometryUtils.merge( mergedCubes, cube );
        }
        return mergeCubes
    }
    
    LSYS.ThreeD.prototype.init = function( _func, _cube_size ) {
        var self = this;
        
        //  Stash arguments for use later in draw()
        
        this.func = _func;
        this.cube_size = ( _cube_size == undefined ) ? 1 : _cube_size;
        
        //  Palette
        
        this.palette = new Palette( 'candy' );
     });
 });