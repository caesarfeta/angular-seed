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
        /*
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
        */
        
        // spotlights
        
        self.spot = {
            yellow: { color: 0xFF7F00, pos:[ 15, 40, 45 ]},
            cyan: { color: 0x00FF7F, pos: [ 0, 40, 35 ]},
            magenta: { color: 0x7F00FF, pos: [ -15, 40, 45 ]}
        }
        _.each( self.spot, function( spot, id ){
            spot.light = new THREE.SpotLight( spot.color, 2 );
            spot.helper = new THREE.SpotLightHelper( spot.light );
            spot.light.castShadow = true;
            spot.light.angle = 0.3;
            spot.light.penumbra = 0.2;
            spot.light.decay = 2;
            spot.light.distance = 50;
            spot.light.shadow.mapSize.width = 1024;
            spot.light.shadow.mapSize.height = 1024;
            spot.light.position.set.apply( this, spot.pos );
            self.scene.add( spot.light );
            self.scene.add( spot.helper );
        })
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