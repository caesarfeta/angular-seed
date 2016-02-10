define([
'threejs'
],
function( THREE ){
	
	// threejs lights
	
	var threeLights = function(){
		this.ambient = new THREE.AmbientLight( 0x404040 );
		
		this.point = { 
			blue: {} 
		};
		this.point.blue.light = new THREE.PointLight( 0x0033ff, 3, 150 );
		this.point.blue.helper = new THREE.PointLightHelper( this.point.blue.light, 3 );
	};
	
	return threeLights
});