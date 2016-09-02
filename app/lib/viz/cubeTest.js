define([
'threejs',
'lib/viz/vizStats',
'lib/viz/threeTrans',
'lib/viz/threeLights',
'lib/viz/cube',
'lib/viz/cubeMatrix'
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
        self.running = false;
    }
    
    cubeTest.prototype.showGridHelper = function(){
        var self = this;
        self.gridHelper = new THREE.GridHelper( 10, 1 );
        self.scene.add( self.gridHelper );
    }
    
    cubeTest.prototype.build = function(){
        var self = this;
        self.scene = new THREE.Scene();
        self.camera = new THREE.PerspectiveCamera( 
            75, 
            window.innerWidth / window.innerHeight, 
            0.1,
            1000 
        );
        self.setupRenderer();
        
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
        if ( self.running ){
            self.transforms.run();
        }
        self.renderer.render( self.scene, self.camera );
        self.stats.update();
    };
    
    cubeTest.prototype.startLights = function(){
        var self = this;
        self.lights = new threeLights();
        self.scene.add( self.lights.ambient );
        self.scene.add( self.lights.point.blue.light );
    };
    
    cubeTest.prototype.default = function(){
        var self = this;
        return {
            position: function(){
                self.camera.position.z = 5;
            }
        }
    };
    
    /////////////////////////////////
    
    
    cubeTest.prototype.go = function( z, y ){
        var self = this;
        self.showGridHelper();
        self.transforms.add( function(){
            self.camera.rotation.z += z;
            self.camera.position.z += z;
            self.camera.rotation.y += y;
            self.camera.position.y += y;
        });
    }
    
    return cubeTest
});