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
    var group = new THREE.Group()
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
        cube.position.x = cube.scale.x*c
        cube.position.y = cube.scale.y*r
        cube.position.z = 0
        cubes[r][c] = cube
        group.add( cube )
      })
    })
    return group
  }
})