define([ 
'./module',
'lodash',
'THREE',
'../utils/utils',
'../three.meshline/src/THREE.MeshLine',
'THREE.OBJLoader',
'THREE.STLLoader',
'THREE.OBJExporter',
'./threeDExtruder'
],
function( 
  module,
  _,
  THREE,
  utils,
  MeshLine ){
  'use strict';
  module
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
    'paginator',
    '$location',
    function(
      threeDData,
      paginator,
      $location ){
      return {
        scope: {
          threeDList: '='
        },
        template: [
          
          '<div ng-if="!!paginator.items()">',
            
            '<div class="lsysCard"',
                 'ng-repeat="item in paginator.items()">',
              '<div class="lsysDisplay">',
                
                // label
                
                '<label>',
                  '<a ng-click="goTo( item.id )" href="">{{ ::item.label }}</a>',
                '</label>',
                
                // thumb
                
                '<a ng-click="goTo( item.id )" href="">',
                  '<img ng-src="{{ ::item.thumb }}" />',
                '</a>',
                
                // info table
                
                '<table class="table">',
                  '<tr>',
                    '<th>transform</th>',
                    '<td>{{ ::item.transform || "FLAT" }}</td>',
                  '</tr>',
                  '<tr>',
                    '<th>lineType</th>',
                    '<td>{{ ::item.lineType || "DEFAULT" }}</td>',
                  '</tr>',
                '</table>',
                
              '</div>',
            '</div>',
            
            // paginator buttons
            
            '<div class="clearfix"></div>',
            '<div paginator="paginator"></div>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.goTo = function( id ){
            $location.url( '/threed/' + id )
          }
          threeDData.get().then(
            function( list ){
              scope.paginator = new paginator({
                list: list,
                perPage: 4,
                updateUrl: true,
                currentPage: scope.threeDList
              })
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
          
          var mesh = new THREE.Object3D()
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
                case 83: // S
                  var exporter = new THREE.OBJExporter()
                  saveString( exporter.parse( mesh ), config.id + '.obj' )
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
              case 'JSON':
                loader = new THREE.JSONLoader()
                loader.load( config.url, function( geometry, materials ){
                  console.log( geometry, materials )
                })
                break
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
                    var geometry = new THREE.Geometry()
                    
                    // different transformations
                    
                    switch ( config.transform ){
                      case 'DISC':
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
                            R * Math.sin( lat ) * 0.05
                          ))
                        })
                        break
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
                            coords[ 1 ]
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
                          geometry.vertices.push( new THREE.Vector3(
                            coords[ 0 ] * 1.0,
                            coords[ 1 ] * 1.0,
                            coords[ 2 ] * 1.0
                          ))
                        })
                        break
                    }
                    
                    
                    switch ( config.lineType ) {
                      case 'TUBE':
                        var check = new THREE.CatmullRomCurve3( geometry.vertices )
                        var line = new THREE.TubeGeometry( 
                          check,
                          10000,
                          1,
                          2,
                          false
                        )
                        var material = new THREE.MeshPhongMaterial({
                          color: 0xffffff,
                          specular: 0x111111,
                          shininess: 200
                        })
                        mesh.add( new THREE.Mesh( line, material ))
                        break
                      case 'DOTS':
                        mesh.add( new THREE.Points( geometry,
                          new THREE.PointsMaterial({
                            color: 0xeeeeff,
                            size: 4
                          })
                        ))
                        break
                      case 'SOLID':
                        var shape = new THREE.Shape( geometry.vertices.map( function( v ){
                          var _v = new THREE.Vector2( v.x, v.y )
                          _v.multiplyScalar( 0.25 )
                          return _v
                        }))
                        mesh.add(
                          new THREE.Mesh(
                            new THREE.ExtrudeGeometry( shape,
                              {
                                amount: 8,
                                bevelEnabled: false
                              }
                            ),
                            new THREE.MeshPhongMaterial({
                              color: 0xffffff,
                              specular: 0x111111,
                              shininess: 200
                            })
                          )
                        )
                        break
                      case 'RIBBON':
                        /*
                          
                          Two bugs...
                          
                          1. If normalized adjacent vectors are collinear 
                          then the indent vector has to be perpendicular to the current one
                          
                          2. Two the length of the indent vector is not independent 
                          of the angles of the adjacent vectors
                          
                        */
                        var dots = new THREE.Geometry()
                        for ( var i=0; i<geometry.vertices.length; i++ ){
                          
                          // first
                          
                          if ( i == 0 ){
                            var a = geometry.vertices[i+1].clone().sub( geometry.vertices[i] )
                            var d = new THREE.Vector3()
                            d.x = a.y
                            d.y = a.x
                            d.setLength( 5 )
                            dots.vertices.push( d )
                            continue
                          }
                          
                          // last
                          
                          if ( i == geometry.vertices.length-1 ){
                            var a = geometry.vertices[i-1].clone().sub( geometry.vertices[i] )
                            var d = new THREE.Vector3()
                            d.x = a.y
                            d.y = a.x
                            d.setLength( 10 )
                            dots.vertices.push( d )
                            continue
                          }
                          // calculate angular bisectors
                          
                          var a = geometry.vertices[i-1].clone().sub( geometry.vertices[i] )
                          var c = geometry.vertices[i+1].clone().sub( geometry.vertices[i] )
                          var al = a.length()
                          var cl = c.length()
                          a.multiplyScalar( cl )
                          c.multiplyScalar( al )
                          var d = new THREE.Vector3().addVectors( a, c )
                          
                          var ia = a.normalize()
                          var ic = c.normalize()
                          
                          if ( Math.abs( ia.x ) == Math.abs( ic.x ) && 
                               Math.abs( ia.y ) == Math.abs( ic.y )){
                            d = new THREE.Vector3().crossVectors(
                              
                              // add a miniscule amount to avoid division by zero bypass
                              
                              a.clone().addScalar( Number.EPSILON ),
                              c.clone().addScalar( Number.EPSILON )
                            )
                          }
                          d.setLength( 10 )
                          var check = d.clone().add( geometry.vertices[i] )
                          if ( intersects( 
                            geometry.vertices[i-1].x,
                            geometry.vertices[i-1].y,
                            geometry.vertices[i].x,
                            geometry.vertices[i].y,
                            dots.vertices[i-1].x,
                            dots.vertices[i-1].y,
                            check.x,
                            check.y
                          )){
                            d.negate()
                          }
                          d.add( geometry.vertices[i] )
                          dots.vertices.push( d )
                        }
                        /*
                        for ( var i=1; i<dots.vertices.length; i++ ){
                          var shape = new THREE.Shape([
                              geometry.vertices[i-1],
                              geometry.vertices[i],
                              dots.vertices[i],
                              dots.vertices[i-1]
                            ].map( function( v ){
                              var _v = new THREE.Vector2( v.x, v.y )
                              _v.multiplyScalar( 1.0 )
                              return _v
                            })
                          )
                          
                          // catch error
                          
                          try {
                            mesh.add(
                              new THREE.Mesh(
                                new THREE.ExtrudeGeometry( shape,
                                  {
                                    steps: 16,
                                    amount: 20,
                                    bevelEnabled: false
                                  }
                                ),
                                new THREE.MeshPhongMaterial({
                                  color: 0xffffff,
                                  specular: 0x111111,
                                  shininess: 200
                                })
                              )
                            )
                          }
                          catch( e ){
                            console.log( e )
                          }
                        }
                        break
                        */
                        
                        // test dots
                        
                        mesh.add( new THREE.Points( dots,
                          new THREE.PointsMaterial({
                            color: 0xeeeeff,
                            size: 4
                          })
                        ))
                        
                        
                      default :
                        mesh.add( new THREE.Line( geometry, new THREE.LineBasicMaterial({
                          color: 0xeeeeff,
                          linewidth: 10
                        })))
                    }
                    
                    // add mesh to scene
                    
                    scene.add( mesh )
                  }
                )
                break
            }
            
            function intersects(a,b,c,d,p,q,r,s) {
              var det, gamma, lambda;
              det = (c - a) * (s - q) - (r - p) * (d - b);
              if (det === 0) {
                return false;
              } else {
                lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
                gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
                return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
              }
            };
            
            renderer = new THREE.WebGLRenderer()
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
          
          // save obj model
          
          function saveString( text, filename ){
            save( new Blob( [ text ], {
              type: 'text/plain'
            }), filename )
          }
          
          function save( blob, filename ){
            var link = document.createElement( 'a' )
            link.style.display = 'none'
            document.body.appendChild( link ) // Firefox workaround, see #6594
            link.href = URL.createObjectURL( blob )
            link.download = filename || 'data.json'
            link.click()
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