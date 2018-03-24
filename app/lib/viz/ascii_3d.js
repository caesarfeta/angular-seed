define([
'lodash',
'./ascii_font',
'THREE',
'./objects/cube'
],
function(
  _,
  ascii,
  THREE,
  Cube ){
  return function( str, id ){
    var group = new THREE.Object3D()
    var config = ascii( str, id )
    var palette = config[1]
    var out = []
    _.each( palette, function( sc ){
      _.each( config[0], function( str, i ){
        _.each( str.split(''), function( l, j ){
          if ( !out[i] ){
            out[i]=[]
          }
          out[i][j] = ( l == sc[0] ) ? sc[1] : out[i][j]
        })
      })
    })
    var cubes = []
    _.each( out, function( chars, r ){
      r = out.length - r
      cubes[r]=[]
      
      // columns
      
      _.each( chars, function( char, c ){
        if ( char == undefined ){
          return
        }
        var cube = new Cube({ 
          color: char
        })
        cube.position.x = cube.scale.x*c - (chars.length/2)*cube.scale.x
        cube.position.y = cube.scale.y*r - (out.length/2)*cube.scale.y
        cube.position.z = 0
        cubes[r][c] = cube
        group.add( cube )
      })
    })
    return group
  }
})