define([
'threejs',
'./stage/cubeLight',
'./stage/myCam',
'./gui/vizStats',
'dat.gui',
'lib/sounds/sfx',
'lib/sounds/music',
'./monsters/spaceship_circle',

// don't need to be namespaced

'THREE.TrackballControls',
'THREE.OrthographicTrackballControls',
],
function( 
  THREE,
  cubeLight,
  myCam,
  vizStats,
  dat,
  sfx,
  music,
  spaceship_circle ){
  
  // test threejs
  
  var viz = function( config ){
    var self = this
    self.config = config
    self.sfx = new sfx()
    self.music = new music()
    self.clock = 0
    window.viz = self
  }
  
  viz.prototype.display = function(){
    var self = this
    
    // lights
    
    self.light = new THREE.AmbientLight( 0xAAAAAA, 0.05 )
    self.scene.add( self.light )
    self.cubeLight = new cubeLight()
    self.cubeLight.make( self.scene )
    
    // camera
    
    self.myCam = new myCam()
    self.myCam.make( self.scene )
    
    // action
    
    self.showAxis()
    self.setupFloor()
    spaceship_circle.make( 6, self.scene )
  }
  
  viz.prototype.move = function( i ){
    var self = this
    spaceship_circle.run( i )
    self.cubeLight.run( i )
    self.myCam.run( i )
  }
  
  viz.prototype.build = function(){
    var self = this
    self.scene = new THREE.Scene()
    self.setupRenderer()
    self.display()
  }
  
  viz.prototype.reset = function(){
    var self = this
    self.build()
    self.render()
    self.running = true
  }
  
  viz.prototype.start = function(){
    var self = this
    self.running = true
  }
  
  viz.prototype.stop = function(){
    var self = this
    self.running = false
  }
  
  viz.prototype.clear = function(){
    var self = this
    for ( var i=0; i<self.scene.children.length; i++ ){
      if ( self.scene.children[i].constructor == THREE.Object3D ){
        self.scene.remove( self.scene.children[i] )
      }
    }
    /*
    // BTW this doesn't work -- though it should
    _.each( self.scene.children, function( child ){
      if ( child.consructor == THREE.Group ){
        console.log( child )
      }
    })
    */
  }
  
  viz.prototype.showAxis = function(){
    var self = this
    self.axis = new THREE.AxisHelper( 5 )
    self.scene.add( self.axis )
  }
  
  viz.prototype.showGridHelper = function(){
    var self = this
    self.gridHelper = new THREE.GridHelper( 10, 1 )
    self.scene.add( self.gridHelper )
  }
  
  viz.prototype.setupFloor = function(){
    var self = this
    self.floor = new THREE.Mesh( 
      new THREE.BoxGeometry( 50, 50, 0.25 ), 
      new THREE.MeshPhongMaterial({
        color: 0x333333
      })
    )
    self.floor.position.z = -1.25
    self.floor.receiveShadow = true
    self.scene.add( self.floor )
  }
  
  viz.prototype.setupGUI = function(){
    var self = this
    self.gui = new dat.GUI()
    
    // camera
    
    self.gui.camera = self.gui.addFolder('camera');
    _.each( [ 'x', 'y', 'z' ], function( dim ){
      self.gui.camera.add( self.myCam.camera.position, dim )
      .min(( dim == 'y' ) ? 1 : -50 )
      .max(50)
      .step(1)
      .listen()
    })
  }
  
  viz.prototype.setupRenderer = function(){
    var self = this
    self.config.elem.innerHTML = ''
    self.renderer = new THREE.WebGLRenderer()
    self.renderer.setSize( window.innerWidth, window.innerHeight )
    
    // shadow map
    
    self.renderer.shadowMap.enabled = true
    self.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    self.renderer.gammaInput = true
    self.renderer.gammaOutput = true
    
    window.addEventListener( 'resize', function(){
      self.renderer.setSize( window.innerWidth, window.innerHeight );
      self.myCam.reset()
    })
    
    // append rendered element
    
    self.config.elem.appendChild( self.renderer.domElement );
    
    // get fps stats
    
    self.stats = new vizStats({ elem: self.config.elem })
  }
  
  viz.prototype.render = function( i ){
    var self = this
    self.clock += 1
    requestAnimationFrame( function(){
      return self.render( self.clock )
    })
    if ( self.running ){
      self.move( i )
    }
    self.renderer.render( self.scene, self.myCam.camera )
    self.stats.update()
  }
  
  return viz
});