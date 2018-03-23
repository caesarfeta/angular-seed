define([
'lodash',
'./fonts/poison',
'./fonts/elec',
'./fonts/space_invaders',
'./fonts/pattern_pow'
],
function(
  _,
  poison,
  elec,
  space_invaders,
  pattern_pow ){
config = [
  poison,
  elec,
  space_invaders,
  pattern_pow
]
return function( str, id ){
  var item = _.find( config, function( item ){
    return item.id == id
  })
  var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  var out = []
  var tallest = 0
  for ( var i=0; i < str.length; i++ ){
    var glyph = item.glyphs[ 
      alpha.indexOf( str.charAt( i ).toUpperCase() )
    ].split( "\n" )
    var longest = 0
    _.each( glyph, function( w ){
      longest = ( longest > w.length ) ? longest : w.length
    })
    out.push( glyph.map( function( w ){
      return w + Array( longest+1 - w.length ).join(' ') + ' '
    }))
  }
  var tallest = 0
  var lengths = out.map( function( item ){
    tallest = ( item.length > tallest ) ? item.length : tallest
    return item.length
  })
  for ( var i=0; i<lengths.length; i++ ){
    var pad = tallest - lengths[i]
    var spacer = Array( out[i][0].length+1 ).join(' ')
    while ( pad > 0 ){
      out[i].unshift( spacer )
      pad--
    }
  }
  return [ _.flatten(
    _.zip.apply( _, out ).map( 
      function( item ){
        return item.join('')
      }
    )
  ), item.palette ]
}
})