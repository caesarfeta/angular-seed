define([
'threejs',
'./gui/vizStats',
'./threeTrans',
'./stage/cmyLights',
'./objects/cube',
'./objects/player',
'./objects/matrix/charMatrix',
'./objects/sprites/space_invaders',
'dat.gui',
'lib/sounds/sfx',
'lib/sounds/music',
'./ascii_font',

// don't need to be namespaced

'THREE.TrackballControls',
'THREE.OrthographicTrackballControls',
],
function( 
  THREE,
  vizStats,
  threeTrans, 
  cmyLights,
  cube,
  paddle,
  charMatrix,
  invaders,
  dat,
  sfx,
  music,
  ascii ){
  
  window.ascii = ascii
  
  // test threejs
  
  var viz = function( config ){
    var self = this
    self.config = config
    self.sfx = new sfx()
    self.music = new music()
    window.sfx = self.sfx
  }
  
  viz.prototype.build = function(){
    var self = this
    self.scene = new THREE.Scene()
    self.transforms = new threeTrans()
    self.setupRenderer()
    self.setupCamera( !true )
    self.setupFloor()
    self.light = new cmyLights({
      scene: self.scene
    })
    self.paddle = new paddle({ 
      elem: self.config.elem,
      scene: self.scene
    })
    self.sprites = invaders( self.scene )
    _.each( self.sprites, function( sprite ){
      sprite.init( sprite, self.sprites, self.scene )
    })
    
    // define a color palette
    
    self.palette = {}
    self.levels = {}
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
    self.transforms.clear()
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
      new THREE.BoxGeometry( 20, 2000, .1 ), 
      new THREE.MeshPhongMaterial({
        color: '#030303'
      })
    )
    self.floor.receiveShadow = true
    self.scene.add( self.floor )
    
    // go to bottom of the floor
    
    self.floor.position.y = self.floor.geometry.parameters.height / 2 - window.innerHeight / 2
    window.floor = self.floor
  }
  
  viz.prototype.resetCamera = function(){
    var self = this
    self.camera.left = window.innerWidth / -2
    self.camera.right = window.innerWidth / 2
    self.camera.top = window.innerHeight / 2
    self.camera.bottom = window.innerHeight / -2
    self.camera.near = 0.1
    self.camera.far = 1500
    self.camera.zoom = 25
    self.camera.updateProjectionMatrix()
  }
  
  viz.prototype.oCam = function(){
    var self = this
    var d = 5
    var aspect = window.innerWidth / window.innerHeight
    self.camera = new THREE.OrthographicCamera()
    self.resetCamera()
    
    // position and point the camera to the center of the scene
    
    self.camera.position.x = 0
    self.camera.position.y = 0
    self.camera.position.z = 5
    self.camera.lookAt( self.scene.position )
    window.camera = self.camera
  }
  
  viz.prototype.setupCamera = function( isOrthoCam ){
    var self = this
    self.oCam()
  }
  
  viz.prototype.setupGUI = function(){
    var self = this
    self.gui = new dat.GUI()
    
    // camera
    
    self.gui.camera = self.gui.addFolder('camera');
    _.each( [ 'x', 'y', 'z' ], function( dim ){
      self.gui.camera.add( self.camera.position, dim )
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
    
    self.renderer.shadowMap.enabled = true;
    self.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    self.renderer.gammaInput = true;
    self.renderer.gammaOutput = true;
    
    window.addEventListener( "resize", function(){
      self.renderer.setSize( window.innerWidth, window.innerHeight );
      self.resetCamera()
    })
    
    // append rendered element
    
    self.config.elem.appendChild( self.renderer.domElement );
    
    // get fps stats
    
    self.stats = new vizStats({ elem: self.config.elem })
  }
  
  viz.prototype.render = function(){
    var self = this;
    requestAnimationFrame( function(){
      return self.render()
    })
    if ( self.running ){
      self.transforms.run()
    }
    self.renderer.render( self.scene, self.camera )
    self.stats.update()
  };
  
  ///////////////////////////////// run
  
  viz.prototype.run = function(){ 
    var self = this
    self.start()
    return{
      cube: {
        move: function(){
          self.transforms.add( function( i ){
            _.each( self.sprites, function( sprite ){
              sprite.physics(
                sprite,
                self.paddle,
                self.sprites,
                self.scene,
                self.sfx,
                i
              )
            })
          })
        }
      }
    }
  }
  
  return viz
});