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
  for ( var i = 0; i < str.length; i++ ){
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
  return [ _.flatten(
    _.zip.apply( _, out ).map( 
      function( item ){
        return item.join(' ')
      }
    )
  ), item.palette ]
}
})