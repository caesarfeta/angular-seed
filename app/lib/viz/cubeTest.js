/*
	var cubeTest = require('lib/viz/cubeTest');
	var viz = new cubeTest({ elem: element });

	// add transforms
	
	viz.transforms.add( 
		function(){ 
			viz.cube.mesh.rotation.x += 0.1;
			viz.cube.mesh.rotation.y += 0.1;
		}
	);

	// clear them
	
	viz.transforms.clear( function(){ });
	
*/
define([
'threejs',
'lib/viz/vizStats',
'lib/viz/threeTrans',
'lib/viz/threeLights',
'lib/viz/cube'
],
function( 
	THREE,
	vizStats,
	threeTrans, 
	threeLights,
	cube ){
	
	// test threejs
	
	var cubeTest = function( config ){
		this.config = config;
		this.transforms = new threeTrans();
		this.build();
		this.cube();
		this.default().position();
		this.startLights();
		this.render();
	};
	
	cubeTest.prototype.build = function(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 
			75, 
			window.innerWidth / window.innerHeight, 
			0.1,
			1000 
		);
		
		this.setupRenderer();
		
		// get fps stats
		
		this.stats = new vizStats({ elem: this.config.elem });
	};
	
	cubeTest.prototype.setupRenderer = function(){
		
		this.renderer = new THREE.WebGLRenderer({ 
			antialias: true, 
			alpha: false
		});
		
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		var self = this;
		window.addEventListener("resize", function(){
			self.renderer.setSize( window.innerWidth, window.innerHeight );
		})
		
		// append rendered element
		
		this.config.elem.appendChild( this.renderer.domElement );
	}
	
	cubeTest.prototype.cube = function(){
		this.cube = new cube();
		this.scene.add( this.cube.mesh );
	};
	
	cubeTest.prototype.render = function(){
		var self = this;
		requestAnimationFrame( function(){ return self.render() });
		this.transforms.run();
		this.renderer.render( this.scene, this.camera );
		this.stats.update();
	};
	
	cubeTest.prototype.startLights = function(){
		this.lights = new threeLights();
		this.scene.add( this.lights.ambient );
		this.scene.add( this.lights.point.blue.light );
	};
	
	cubeTest.prototype.default = function(){
		var self = this;
		return {
			position: function(){
				self.camera.position.z = 5;
			}
		}
	};
	
	return cubeTest
});