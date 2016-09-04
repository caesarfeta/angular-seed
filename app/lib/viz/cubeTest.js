define([
'threejs',
'lib/viz/vizStats',
'lib/viz/threeTrans',
'lib/viz/threeLights',
'lib/viz/cube',
'lib/viz/cubeMatrix',
'THREE.TrackballControls',
'THREE.OrthographicTrackballControls'
],
function( 
    THREE,
    vizStats,
    threeTrans, 
    threeLights,
    cube,
    cubeMatrix ){
    
    // test threejs
    
    var cubeTest = function( config ){
        var self = this;
        self.config = config;
        self.reset();
    };
    
    cubeTest.prototype.reset = function(){
        var self = this;
        self.cubes = [];
        self.transforms = new threeTrans();
        self.matrix = new cubeMatrix( self );
        self.build();
        self.newCube();
        self.default().position();
        self.startLights();
        self.render();
        self.running = true;
    }
    
    cubeTest.prototype.start = function(){
        var self = this;
        self.running = true;
    }
    
    cubeTest.prototype.stop = function(){
        var self = this;
        self.transforms.clear();
        self.running = false;
    }
    
    cubeTest.prototype.showAxis = function(){
        var self = this;
        self.axis = new THREE.AxisHelper( 5 );
        self.scene.add( self.axis );
    }
    
    cubeTest.prototype.showGridHelper = function(){
        var self = this;
        self.gridHelper = new THREE.GridHelper( 10, 1 );
        self.scene.add( self.gridHelper );
    }
    
    cubeTest.prototype.pCam = function(){
        var self = this;
        self.camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight, 
            0.1,
            1000 
        );
        
        // setup camera controls
        
        self.cameraControls = new THREE.TrackballControls( self.camera );
        self.cameraControls.rotateSpeed = 1.0;
        self.cameraControls.zoomSpeed = 1.2;
        self.cameraControls.panSpeed = 0.8;
        self.cameraControls.noZoom = false;
        self.cameraControls.noPan = false;
        self.cameraControls.staticMoving = true;
        self.cameraControls.dynamicDampingFactor = 0.3;
        self.cameraControls.keys = [ 37, 38, 39 ];
    }
    
    cubeTest.prototype.oCam = function(){
        var self = this;
        var d = 5;
        var aspect = window.innerWidth / window.innerHeight;
        self.camera = new THREE.OrthographicCamera( 
            -d * aspect, 
            d * aspect, 
            d, 
            -d, 
            1, 
            1000
        );
        self.camera.position.set( d, d, d );
        self.camera.lookAt( 0, 0, 0 );
        self.cameraControls = new THREE.OrthographicTrackballControls( self.camera );
        self.cameraControls.rotateSpeed = 1.0;
        self.cameraControls.zoomSpeed = 1.2;
        self.cameraControls.panSpeed = 0.8;
        self.cameraControls.noZoom = false;
        self.cameraControls.noPan = false;
        self.cameraControls.staticMoving = true;
        self.cameraControls.dynamicDampingFactor = 0.3;
        self.cameraControls.keys = [ 37, 38, 39 ];
    }
    
    cubeTest.prototype.switchCam = function(){
        var self = this;
        self.setupCamera( !self.isOrthoCam );
    }
    
    cubeTest.prototype.setupCamera = function( isOrthoCam ){
        var self = this;
        self.isOrthoCam = isOrthoCam;
        ( isOrthoCam ) ? self.oCam() : self.pCam();
    }
    
    cubeTest.prototype.build = function(){
        var self = this;
        self.scene = new THREE.Scene();
        self.setupRenderer();
        self.setupCamera( true );
        
        // get fps stats
        
        self.stats = new vizStats({ elem: self.config.elem });
    };
    
    cubeTest.prototype.setupRenderer = function(){
        var self = this;
        self.config.elem.innerHTML = '';
        self.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false
        });
        self.renderer.setSize( window.innerWidth, window.innerHeight );
        window.addEventListener("resize", function(){
            self.renderer.setSize( window.innerWidth, window.innerHeight );
        })
        
        // append rendered element
        
        self.config.elem.appendChild( self.renderer.domElement );
    }
    
    cubeTest.prototype.newCube = function(){
        var self =this;
        var newCube = new cube();
        self.cubes.push( newCube );
        self.scene.add( newCube.mesh );
        return newCube
    };
    
    cubeTest.prototype.render = function(){
        var self = this;
        requestAnimationFrame( function(){ return self.render() });
        self.cameraControls.update();
        if ( self.running ){
            self.transforms.run();
        }
        self.renderer.render( self.scene, self.camera );
        self.stats.update();
    };
    
    cubeTest.prototype.startLights = function(){
        var self = this;
        self.light = new threeLights( self.scene );
    };
    
    cubeTest.prototype.default = function(){
        var self = this;
        return {
            position: function(){
                self.camera.position.z = 5;
            }
        }
    };
    
    ///////////////////////////////// run
    
    cubeTest.prototype.run = function( x, y, z ){ 
        var self = this;
        y = ( y != undefined ) ? y : 0;
        z = ( z != undefined ) ? z : 0;
        self.showGridHelper();
        self.showAxis();
        self.start();
        return{
            
            // lights
            
            light: {
                move: function(){
                    self.light.reset();
                    self.transforms.add( function( i ){
                        self.light.point.b.light.position.z += Math.sin( i*.05 )*z;
                        self.light.point.g.light.position.y += Math.sin( i*.05 )*y;
                        self.light.point.r.light.position.x += Math.sin( i*.05 )*x;
                    });
                }
            },
            
            // camera
            
            camera: {
                rotate: function(){
                    self.transforms.add( function(){
                        self.camera.rotation.z += z;
                        self.camera.rotation.y += y;
                        self.camera.rotation.x += x;
                    });
                },
                move: function(){
                    self.transforms.add( function(){
                        self.camera.position.z += z;
                        self.camera.position.y += y;
                        self.camera.position.x += x;
                    });
                }
            }
        }
    }
    
    return cubeTest
});