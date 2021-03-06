define([ 
'./module',
'lodash',
'THREE',
'../utils/utils',
'../viz/viz',
'../js/urlToRgb',
'../js/Culuh'
],
function( 
  module,
  _,
  THREE,
  utils,
  viz,
  urlToRgb,
  Culuh ){
  'use strict';
  module
  .directive( 'imgExploder', [
    '$timeout',
    function( $timeout ){
      return {
        template: [
          
          '<div class="img-exploder">',
            '<label>img url:</label>',
            '<div>',
              '<input type="text" ng-model="url" ng-enter="go()" />',
            '</div>',
            '<textarea rows="20" cols="50">{{ output }}</textarea>',
            '<textarea rows="20" cols="20">{{ palette }}</textarea>',
          '</div>',
          
        ].join(' '),
        link: function( scope, elem ){
          scope.url = ''
          
          // conversion
          
          var culuh = new Culuh()
          function toHex( int ){
            return culuh.intToHex( int )
          }
          
          // http://localhost:8000/app/lib/threeD/img/galaga.png
          
          scope.go = function(){
            urlToRgb.get( scope.url ).then( 
              function( imgData ){
                var mtrx = [[]]
                
                // symbol to color palette
                
                var sym = ' @#$%^&*+=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
                sym = sym.split('')
                var palette = {}
                var ip = -1
                
                // loop through images
                
                var pix = imgData.data
                var width = imgData.width
                var lastRow = 0
                for( var i=0; i<pix.length; i+=4 ){
                  var color = '0x' + toHex( pix[i] ) + toHex( pix[i+1] ) + toHex( pix[i+2] )
                  if ( !palette[ color ] ){
                    ip += 1
                    palette[ color ] = sym[ ip ]
                  }
                  var c = i / 4 % width
                  var r = Math.floor( i / ( width*4 ))
                  if ( r > lastRow ){
                    mtrx[r] = []
                    lastRow = r
                  }
                  mtrx[r][c] = palette[ color ]
                }
                
                // build output
                
                scope.palette = JSON.stringify( _.map( palette, function( val, key ){
                  return [ val, key ]
                }), ' ', 2 )
                scope.output = mtrx.map( function( row ){
                  return row.join('')
                }).join('\n')
                $timeout( function(){} )
              }
            )
          }
        }
      }
    }
  ])
  .directive( 'threeDPong', [
    function(){
      return {
        link: function( scope, elem ){
          var cnsl = new viz({
            elem: $( elem ).get(0)
          })
          cnsl.build()
          cnsl.reset()
          scope.$on( '$destroy', function(){
            cnsl.stop()
            $( elem ).get(0).remove()
          }) 
        }
      }
    }
  ])
  .directive( 'threeDExtruder', [
    function(){
      return {
        link: function( scope, elem ){
          var container, stats
          var camera, scene, renderer
          var frustumSize = 1000
          init()
          animate()
          function init() {
            container = document.createElement( 'div' )
            document.body.appendChild( container )
            var aspect = window.innerWidth / window.innerHeight
            camera = new THREE.OrthographicCamera(
              frustumSize * aspect / - 2,
              frustumSize * aspect / 2,
              frustumSize / 2,
              frustumSize / - 2,
              1,
              2000
            )
            camera.position.y = 400
            scene = new THREE.Scene()
            scene.background = new THREE.Color( 0xf0f0f0 )
            
            // grid
            
            var gridHelper = new THREE.GridHelper( 1000, 20 )
            scene.add( gridHelper )
            
            // geometry
            
            var geometry = new THREE.BoxGeometry( 50, 50, 50 )
            var material = new THREE.MeshLambertMaterial({
              color: 0xffffff,
              overdraw: 0.5
            })
            
            /*
            // lathe
            
            var points = []
            for ( var i=0; i<20; i+= 1 ){
              var x = 5 + Math.sin( i ) * 100
              var y = i * 10
              points.push( 
                new THREE.Vector2( x, y )
              )
            }
            geometry = new THREE.LatheGeometry( points )
            */
            
            var geometry = new THREE.ParametricGeometry(
              function( u, v ){
                var x = -100 + 200 * u
                var y = -100 + 200 * v
                var z = ( Math.sin( u * Math.PI ) + Math.sin( v * Math.PI )) * -60
                return new THREE.Vector3( x, y, z )
              },
              10,
              10
            )
            var mesh = new THREE.Mesh( geometry, material )
            scene.add( mesh )
            
            /*
            // grid of cubest
            
            for ( var i = 0; i < 100; i ++ ){
              var cube = new THREE.Mesh( geometry, material )
              cube.scale.y = Math.floor( Math.random() * 2 + 1 )
              cube.position.x = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25
              cube.position.y = ( cube.scale.y * 50 ) / 2
              cube.position.z = Math.floor( ( Math.random() * 1000 - 500 ) / 50 ) * 50 + 25
              scene.add( cube )
            }
            */
            
            // lights
            
            var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 )
            scene.add( ambientLight )
            var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff )
            directionalLight.position.x = Math.random() - 0.5
            directionalLight.position.y = Math.random() - 0.5
            directionalLight.position.z = Math.random() - 0.5
            directionalLight.position.normalize()
            scene.add( directionalLight )
            var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff )
            directionalLight.position.x = Math.random() - 0.5
            directionalLight.position.y = Math.random() - 0.5
            directionalLight.position.z = Math.random() - 0.5
            directionalLight.position.normalize()
            scene.add( directionalLight )
            
            // renderer setup
            
            renderer = new THREE.WebGLRenderer()
            renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( window.innerWidth, window.innerHeight )
            container.appendChild( renderer.domElement )
            window.addEventListener( 'resize', onWindowResize, false )
          }
          
          function onWindowResize() {
            var aspect = window.innerWidth / window.innerHeight
            camera.left   = - frustumSize * aspect / 2
            camera.right  =   frustumSize * aspect / 2
            camera.top    =   frustumSize / 2
            camera.bottom = - frustumSize / 2
            camera.updateProjectionMatrix()
            renderer.setSize( window.innerWidth, window.innerHeight )
          }
          
          function animate() {
            requestAnimationFrame( animate )
            render()
          }
          
          function render() {
            var timer = Date.now() * 0.0001
            camera.position.x = Math.cos( timer ) * 800
            camera.position.z = Math.sin( timer ) * 800
            camera.lookAt( scene.position )
            renderer.render( scene, camera )
          }
          
          // free up memory used by threejs
          
          scope.$on( '$destroy', function(){
            while( scene.children.length > 0 ){ 
              scene.remove( scene.children[ 0 ] )
            }
            cancelAnimationFrame( animate )
            container.remove()
          })
        }
      }
    }
  ])
})