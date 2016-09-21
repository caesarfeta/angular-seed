define([
'threejs',
'lodash'
],
function( 
    THREE, 
    _ ){
    
    // threejs lights
    
    var cmyLights = function( config ){
        var self = this;
        _.merge( self, {
          scene: undefined
        })
        _.merge( self, config );
        self.ambient = new THREE.AmbientLight( 0x111111 )
        self.scene.add( self.ambient )
        
        // spotlights
        
        self.spot = {
            yellow: { color: 0xFF7F00, pos:[ 15, 40, 45 ]},
            cyan: { color: 0x00FF7F, pos: [ 0, 40, 35 ]},
            magenta: { color: 0x7F00FF, pos: [ -15, 40, 45 ]}
        }
        _.each( self.spot, function( spot, id ){
            spot.light = new THREE.SpotLight( spot.color, 2 );
            spot.light.castShadow = true;
            spot.light.angle = 0.3;
            spot.light.penumbra = 0.2;
            spot.light.decay = 2;
            spot.light.distance = 50;
            spot.light.shadow.mapSize.width = 1024;
            spot.light.shadow.mapSize.height = 1024;
            self.scene.add( spot.light );
        })
    }
    
    cmyLights.prototype.reset = function(){
        var self = this;
        _.each( self.spot, function( spot ){
            spot.light.position.z = 0;
            spot.light.position.y = 0;
            spot.light.position.x = 0;
        })
    }
    
    return cmyLights
});