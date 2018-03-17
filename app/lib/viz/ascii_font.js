define([
'lodash',
'./fonts/poison',
'./fonts/elec',
'./fonts/space_invaders'
],
function(
  _,
  poison,
  elec,
  space_invaders ){
config = [
  poison,
  elec,
  space_invaders
]
return function( str, id ){
  var item = _.find( config, function( item ){
    return item.id == id
  })
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var out = []
  for ( var i=0; i < str.length; i++ ){
    var glyph = item.glyphs[ 
      alpha.indexOf( str.charAt( i ).toUpperCase() )
    ].split( "\n" )
    glyph.shift()
    glyph.pop()
    var longest = 0
    _.each( glyph, function( w ){
      longest = ( longest < w.length ) ? w.length : longest
    })
    out.push( glyph.map( function( w ){
      return w + Array( longest+2 - w.length ).join(' ')
    }))
  }
  
  var tallest=0
  for ( var i=0; i < out.length; i++ ){
    tallest = ( out[i].length > tallest ) ? out[i].length : tallest
  }
  for ( var i=0; i < out.length; i++ ){
    if ( tallest > out[i].length ){
      var sp = Array( out[i][0].length ).join(' ')
      var n = tallest - out[i].length
      while ( n > 0 ){
        out[i].unshift( sp )
        n--
      }
    }
  }
  
  return [ _.flatten(
    _.zip.apply( _, out ).map( 
      function( item ){
        return item.join(' ')
      }
    )
  ), item.palette ]
}
})