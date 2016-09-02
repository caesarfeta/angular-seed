## add transforms

viz.transforms.add( 
    function(){ 
        viz.cube.mesh.rotation.x += 0.1;
        viz.cube.mesh.rotation.y += 0.1;
    }
);

## clear them

viz.transforms.clear( function(){ });