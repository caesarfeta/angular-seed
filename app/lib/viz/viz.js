define([
'threejs',
'./vizStats',
'./threeTrans',
'./threeLights',
'./cube',
'./cubeMatrix',
'./lsys/LSYS',
'dat.gui',

'THREE.TrackballControls',
'THREE.OrthographicTrackballControls',
],
function( 
    THREE,
    vizStats,
    threeTrans, 
    threeLights,
    cube,
    cubeMatrix,
    LSYS,
    dat ){
    
    // test threejs
    
    var viz = function( config ){
        var self = this;
        self.config = config;
        self.reset();
        self.LSYS = LSYS;
    };
    
    viz.prototype.reset = function(){
        var self = this;
        self.cubes = [];
        self.transforms = new threeTrans();
        self.matrix = new cubeMatrix( self );
        self.build();
        self.newCube();
        self.default().position();
        self.startLights();
        self.setupFloor();
        self.setupGUI();
        
        // draw
        
        self.render();
        self.running = true;
    }
    
    viz.prototype.start = function(){
        var self = this;
        self.running = true;
    }
    
    viz.prototype.stop = function(){
        var self = this;
        self.running = false;
    }
    
    viz.prototype.clear = function(){
        var self = this;
        self.transforms.clear();
    }
    
    viz.prototype.showAxis = function(){
        var self = this;
        self.axis = new THREE.AxisHelper( 5 );
        self.scene.add( self.axis );
    }
    
    viz.prototype.showGridHelper = function(){
        var self = this;
        self.gridHelper = new THREE.GridHelper( 10, 1 );
        self.scene.add( self.gridHelper );
    }
    
    viz.prototype.setupFloor = function(){
        var self = this;
        self.floor = new THREE.Mesh( 
            new THREE.BoxGeometry( 20, .1, 20 ), 
            new THREE.MeshPhongMaterial()
        )
        self.floor.receiveShadow = true;
        self.scene.add( self.floor )
    }
    
    viz.prototype.pCam = function(){
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
    
    viz.prototype.oCam = function(){
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
    
    viz.prototype.switchCam = function(){
        var self = this;
        self.setupCamera( !self.isOrthoCam );
    }
    
    viz.prototype.setupCamera = function( isOrthoCam ){
        var self = this;
        self.isOrthoCam = isOrthoCam;
        ( !isOrthoCam ) ? self.oCam() : self.pCam();
    }
    
    viz.prototype.setupGUI = function(){
        var self = this;
        self.gui = new dat.GUI();
        
        // camera
        
        self.gui.camera = self.gui.addFolder('camera');
        _.each( [ 'x', 'y', 'z' ], function( dim ){
            self.gui.camera.add( self.camera.position, dim )
            .min(( dim == 'y' ) ? 1 : -50 )
            .max(50)
            .step(1)
            .listen()
        })
        
        // lights
        
        _.each( self.light.spot, function( spot, id ){
            self.gui[ id ] = self.gui.addFolder( id );
            _.each( ['x', 'y', 'z' ], function( dim ){
                self.gui[ id ].add( self.light.spot[ id ].light.position, dim )
                .min(( dim == 'y' ) ? 0 : -10 )
                .max(10)
                .step(.25)
                .listen()
            })
        })
    }
    
    viz.prototype.build = function(){
        var self = this;
        self.scene = new THREE.Scene();
        self.setupRenderer();
        self.setupCamera( true );
        
        // get fps stats
        
        self.stats = new vizStats({ elem: self.config.elem });
        self.showGridHelper();
        self.showAxis();
    };
    
    viz.prototype.setupRenderer = function(){
        var self = this;
        self.config.elem.innerHTML = '';
        self.renderer = new THREE.WebGLRenderer();
        self.renderer.setSize( window.innerWidth, window.innerHeight );
        
        // shadow map
        
        self.renderer.shadowMap.enabled = true;
        self.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        self.renderer.gammaInput = true;
        self.renderer.gammaOutput = true;
        
        window.addEventListener("resize", function(){
            self.renderer.setSize( window.innerWidth, window.innerHeight );
        })
        
        // append rendered element
        
        self.config.elem.appendChild( self.renderer.domElement );
    }
    
    viz.prototype.newCube = function(){
        var self =this;
        var newCube = new cube();
        self.cubes.push( newCube );
        self.scene.add( newCube.mesh );
        return newCube
    };
    
    viz.prototype.render = function(){
        var self = this;
        requestAnimationFrame( function(){ return self.render() });
        self.cameraControls.update();
        if ( self.running ){
            self.transforms.run();
        }
        self.renderer.render( self.scene, self.camera );
        self.stats.update();
    };
    
    viz.prototype.startLights = function(){
        var self = this;
        self.light = new threeLights( self.scene );
    };
    
    viz.prototype.default = function(){
        var self = this;
        return {
            position: function(){
                self.camera.position.z = 5;
            }
        }
    };
    
    ///////////////////////////////// run
    
    viz.prototype.run = function( x, y, z ){ 
        var self = this;
        y = ( y != undefined ) ? y : 0;
        z = ( z != undefined ) ? z : 0;
        self.start();
        return{
            
            // lights
            
            light: {
                move: function(){
                    self.light.reset();
                    self.transforms.add( function( i ){
                        var j = 0;
                        _.each( self.light.spot, function( spot ){
                            j++;
                            spot.light.position.z += Math.sin( i*.05 + j )*z;
                            spot.light.position.y = 5;
                            spot.light.position.x += Math.sin( i*.05 + j )*x;
                        })
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
    
    return viz
});