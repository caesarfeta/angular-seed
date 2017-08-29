define([ 
'angular',
'lodash',
'../utils/utils',
'OBJLoader',
'STLLoader',
'threejs',
'../three.meshline/src/THREE.MeshLine'
],
function( 
  angular,
  _,
  utils,
  OBJLoader,
  STLLoader,
  THREE ){
  'use strict';
  angular.module( 'threeD', [])
  .service( 'threeDData', [
    '$http',
    '$q',
    function(
      $http,
      $q ){
      var self = this
      var list = undefined
      self.get = function(){
        return $q( function( yes, no ){
          if ( !!list ){
            return yes( list )
          }
          $http.get( './lib/threeD/threeD.json' ).then(
            function( r ){
              list = r.data.map( function( item ){
                item.id = utils.sha( item.label )
                return item
              })
              return yes( list )
            },
            
            // error
            
            function( e ){
              console.log( e )
            }
          )
        })
      }
    }
  ])
  .directive( 'threeDList', [
    'threeDData',
    function( threeDData ){
      return {
        scope: {},
        template: [
          
          '<div class="container" ng-if="!!list">',
            
            '<div class="lsysCard"',
                 'ng-repeat="item in list">',
              '<div class="lsysDisplay">',
                
                // label
                
                '<label>',
                  '<a href="/app/#/threed/{{ ::item.id }}">{{ ::item.label }}</a>',
                '</label>',
                
                // thumb
                
                '<a href="/app/#/threed/{{ ::item.id }}">',
                  '<img ng-src="{{ ::item.thumb }}" />',
                '</a>',
                
                // info table
                
                '<table class="table">',
                  '<tr>',
                    '<th>transform</th>',
                    '<td>{{ ::item.transform }}</td>',
                  '</tr>',
                  '<tr>',
                    '<th>lineType</th>',
                    '<td>{{ ::item.lineType || "DEFAULT" }}</td>',
                  '</tr>',
                '</table>',
                
              '</div>',
            '</div>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.list = []
          threeDData.get().then(
            function( list ){
              scope.list = list
            }
          )
        }
      }
    }
  ])
  .directive( 'threeD', [
    'threeDData',
    '$http',
    function(
      threeDData,
      $http ){
      return {
        scope: {
          threeD: '@'
        },
        link: function( scope, elem ){
          var container
          var camera, scene, renderer
          var mouseX = 0, mouseY = 0
          var windowHalfX = window.innerWidth / 2
          var windowHalfY = window.innerHeight / 2
          threeDData.get().then(
            function( list ){
              var config = _.find( list, function( item ){
                return item.id == scope.threeD
              })
              init( config )
              animate()
            }
          )
          
          var mesh = undefined
          function init( config ){
            container = document.createElement( 'div' )
            document.body.appendChild( container )
            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )
            camera.position.z = 250
            
            // zoom
            
            var zoomFactor = 0.95
            var keyListener = document.addEventListener( 'keydown', function( e ){
              switch( e.which ){
                case 65: // A
                  camera.fov *= zoomFactor
                  break
                case 90: // Z
                  camera.fov /= zoomFactor
                  break
              }
              camera.updateProjectionMatrix()
            })
            
            // scene
            
            scene = new THREE.Scene()
            var ambient = new THREE.AmbientLight( 0x101030 )
            scene.add( ambient )
            var directionalLight = new THREE.DirectionalLight( 0xffeedd )
            directionalLight.position.set( 0, 0, 1 )
            scene.add( directionalLight )
            
            // texture
            
            var manager = new THREE.LoadingManager()
            manager.onProgress = function( item, loaded, total ){
              console.log( item, loaded, total )
            }
            var texture = new THREE.Texture()
            var onProgress = function( xhr ){
              if ( xhr.lengthComputable ){
                var percentComplete = xhr.loaded / xhr.total * 100
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' )
              }
            }
            var onError = function( xhr ){}
            
            // retrieve model
            
            var loader = undefined
            switch( config.loader ){  
              case 'OBJ':
                loader = new THREE.OBJLoader( manager )
                loader.load( config.url, function( item ){
                  mesh = item
                  mesh.traverse( function( child ){
                    if ( child instanceof THREE.Mesh ){
                      child.material = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
                        specular: 0x111111,
                        shininess: 200
                      })
                    }
                  })
                  mesh.position.y = 0
                  scene.add( mesh )
                }, onProgress, onError )
                break
              case 'STL':
                loader = new THREE.STLLoader( manager )
                loader.load( config.url, function ( geometry ) {
                  var material = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0x111111,
                    shininess: 200
                  })
                  mesh = new THREE.Mesh( geometry, material )
                  mesh.position.set( 0, - 0.25, 0.6 )
                  mesh.rotation.set( 0, - Math.PI / 2, 0 )
                  mesh.scale.set( 2, 2, 2 )
                  mesh.castShadow = true
                  mesh.receiveShadow = true
                  scene.add( mesh )
                })
                break
              case 'COORD':
                $http.get( config.url ).then(
                  function( r ){
                    // var material = new THREE.MeshLineMaterial()
                    var geometry = new THREE.Geometry()
                    
                    // different transformations
                    
                    switch ( config.transform ){
                      case 'SPHERE':
                        var xs = []
                        var ys = []
                        _.each( r.data.split( '\n' ), function( item, i ){
                          var coords = item.split( ', ' )
                          xs.push( coords[ 0 ])
                          ys.push( coords[ 1 ])
                        })
                        var L = _.max( xs ) - _.min( xs )
                        var H = _.max( ys ) - _.min( ys )
                        var R = ( L > H ) ? L : H
                        _.each( r.data.split( '\n' ), function( item, i ){
                          var coords = item.split( ', ' )
                          var long = coords[0] / R
                          var lat = 2 * Math.atan( Math.exp( coords[1] / R )) - Math.PI / 2
                          geometry.vertices.push( new THREE.Vector3(
                            R * Math.cos( lat ) * Math.cos( long ),
                            R * Math.cos( lat ) * Math.sin( long ),
                            R * Math.sin( lat )
                          ))
                        })
                        break
                      case 'FUNNEL':
                        var R = 100
                        _.each( r.data.split( '\n' ), function( item, i ){
                          var coords = item.split( ', ' )
                          var long = coords[0] / R
                          var lat = 2 * Math.atan( Math.exp( coords[1] / R )) - Math.PI / 2
                          geometry.vertices.push( new THREE.Vector3(
                            R * Math.cos( lat ) * Math.cos( long ),
                            R * Math.cos( lat ) * Math.sin( long ),
                            coords[ 1 ],
                          ))
                        })
                        break
                      case 'STEP':
                        _.each( r.data.split( '\n' ), function( item, i ){
                          var coords = item.split( ', ' )
                          geometry.vertices.push( new THREE.Vector3(
                            coords[ 0 ] * .25,
                            coords[ 1 ] * .25,
                            i * .025
                          ))
                        })
                        break
                      default:
                        _.each( r.data.split( '\n' ), function( item, i ){
                          var coords = item.split( ', ' )
                          var R = 100
                          var long = coords[0] / R
                          var lat = 2 * Math.atan( Math.exp( coords[1] / R )) - Math.PI / 2
                          geometry.vertices.push( new THREE.Vector3(
                            coords[ 0 ],
                            coords[ 1 ],
                            coords[ 2 ]
                          ))
                        })
                        break
                    }
                    
                    
                    switch ( config.lineType ) {
                      case 'TUBE':
                        var line = new THREE.TubeGeometry( 
                          new THREE.CatmullRomCurve3( geometry.vertices ),
                          10000,
                          1,
                          5,
                          false
                        )
                        var material = new THREE.MeshPhongMaterial({
                          color: 0xffffff,
                          specular: 0x111111,
                          shininess: 200
                        })
                        mesh = new THREE.Mesh( line, material )
                        break
                      default :
                        mesh = new THREE.Line( geometry, new THREE.LineBasicMaterial({
                          color: 0xeeeeff,
                          linewidth: 10
                        }))
                    }
                    scene.add( mesh )
                  }
                )
                break
            }
            renderer = new THREE.WebGLRenderer()
            //renderer.setPixelRatio( window.devicePixelRatio )
            renderer.setSize( window.innerWidth, window.innerHeight )
            container.appendChild( renderer.domElement )
            document.addEventListener( 'mousemove', onDocumentMouseMove, false )
            window.addEventListener( 'resize', onWindowResize, false )
            
            // detect mousedown and mouseup
            
            document.addEventListener( 'mousedown', function(){
              mousedown = true
            })
            document.addEventListener( 'mouseup', function(){
              mousedown = false
            })
          }
          
          function onWindowResize() {
            windowHalfX = window.innerWidth / 2
            windowHalfY = window.innerHeight / 2
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize( window.innerWidth, window.innerHeight )
          }
          
          // mouse move
          
          var mousedown = false
          var prev = {
            clientX: undefined,
            clientY: undefined
          }
          var mousedownMove = _.debounce( function( event ){
            prev.clientX = undefined
            prev.clientY = undefined
          }, 100 )
          function onDocumentMouseMove( event ){
            if ( mousedown ){
              
              // update previous
              
              if ( !!prev.clientX && prev.clientY ){
                mesh.rotation.y += ( event.clientX - prev.clientX ) * .01
                mesh.rotation.x += ( event.clientY - prev.clientY ) * .01 
              }
              prev.clientX = event.clientX
              prev.clientY = event.clientY
              
              // clear
              
              mousedownMove( event )
            }
            else {
              mouseX = ( event.clientX - windowHalfX ) * .5
              mouseY = ( event.clientY - windowHalfY ) * .5
            }
          }
          
          // animate and render
          
          function animate(){
            requestAnimationFrame( animate )
            render()
          }
          
          function render() {
            camera.position.x += ( mouseX - camera.position.x ) * .5
            camera.position.y += ( - mouseY - camera.position.y ) * .5
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