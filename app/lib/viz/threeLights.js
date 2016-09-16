define([
'threejs',
'lodash'
],
function( 
    THREE, 
    _ ){
    
    // threejs lights
    
    var threeLights = function( scene ){
        var self = this;
        self.scene = scene;
        self.ambient = new THREE.AmbientLight( 0x404040 );
        
        // points
        
        self.point = { 
            r: { color: 0xff0000 }, 
            g: { color: 0x00ff00 }, 
            b: { color: 0x0000ff }
        }
        _.each( self.point, function( point, id ){
            point.light = new THREE.PointLight( point.color, 3, 150 );
            point.helper = new THREE.PointLightHelper( point.light, 3 );
            self.scene.add( point.light );
            self.scene.add( point.helper );
            point.light.position.x = 0;
            point.light.position.y = 0;
            point.light.position.y = 0;
        })
        
        // spotlights
        
        
    }
    
    threeLights.prototype.reset = function(){
        var self = this;
        _.each( self.point, function( point ){
            point.light.position.z = 0;
            point.light.position.y = 0;
            point.light.position.x = 0;
        })
    }
    
    return threeLights
});