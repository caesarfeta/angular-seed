define([
'threejs'
],
function( THREE ){
    
    // threejs lights
    
    var threeLights = function( scene ){
        var self = this;
        self.scene = scene;
        self.ambient = new THREE.AmbientLight( 0x404040 );
        self.point = { 
            r: {},
            g: {},
            b: {} 
        };
        
        self.point.r.light = new THREE.PointLight( 0xff0000, 3, 150 );
        self.point.r.helper = new THREE.PointLightHelper( self.point.r.light, 3 );
        self.scene.add( self.point.r.light );
        self.scene.add( self.point.r.helper );
        self.point.r.light.position.x = 0;
        self.point.r.light.position.y = 0;
        self.point.r.light.position.y = 0;
        
        self.point.g.light = new THREE.PointLight( 0x00ff00, 3, 150 );
        self.point.g.helper = new THREE.PointLightHelper( self.point.g.light, 3 );
        self.scene.add( self.point.g.light );
        self.scene.add( self.point.g.helper );
        self.point.g.light.position.x = 0;
        self.point.g.light.position.y = 0;
        self.point.g.light.position.y = 0;
        
        self.point.b.light = new THREE.PointLight( 0x0000ff, 3, 150 );
        self.point.b.helper = new THREE.PointLightHelper( self.point.b.light, 3 );
        self.scene.add( self.point.b.light );
        self.scene.add( self.point.b.helper );
        self.point.b.light.position.x = 0;
        self.point.b.light.position.y = 0;
        self.point.b.light.position.y = 0;
    };
    
    threeLights.prototype.reset = function(){
        var self = this;
        self.point.b.light.position.z = 0;
        self.point.g.light.position.y = 0;
        self.point.r.light.position.x = 0;
    }
    
    return threeLights
});