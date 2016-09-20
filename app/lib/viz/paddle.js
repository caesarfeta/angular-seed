define([
'threejs',
'lodash',
'jquery'
],
function( THREE, _ ){
    var paddle = function( config ){
        var self = this;
        self.config = {};
        _.merge( self.config, {
            x: 3,
            width: 20
        });
        _.merge( self.config, config );
        self.mesh = new THREE.Mesh( 
            new THREE.CubeGeometry( self.config.x, 1, .5 ),
            new THREE.MeshPhongMaterial({ 
                color: 0xAAAAAA,
                specular: 0x555555,
                shininess: 25
            })
        )
        self.mesh.receiveShadow = true;
        self.mesh.castShadow = true;
        self.mesh.position.y = 1;
        self.mesh.position.z = 9;
        
        // get the bbox
        
        self.bbox = new THREE.Box3().setFromObject( self.mesh );
        
        // mouse movement
        
        var mouseRatio = 0.5;
        $( self.config.elem ).mousemove( function( e ){
            mouseRatio = e.offsetX / $( self.config.elem ).width();
            self.mesh.position.x = mouseRatio*self.config.width - self.config.width/2;
        })
    };
    paddle.prototype.isTouching = function( mesh ){
        var self = this;
        var bbox1 = new THREE.Box3().setFromObject( self.mesh );
        var bbox2 = new THREE.Box3().setFromObject( mesh );
        return bbox1.intersectsBox( bbox2 );
    }
    return paddle
});