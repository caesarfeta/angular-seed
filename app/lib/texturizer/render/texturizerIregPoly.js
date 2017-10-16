define([
'../module',
'../../utils/utils',
'lodash'
], 
function(
  module,
  utils,
  _ ){
  module
  .directive( 'texturizerIregPoly', [
    'texturizerUtils',
    function( texturizerUtils ){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="polys" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = _.clone( scope.json )
          config = _.merge({
            x: 0,
            y: 0
          }, config )
          var svg = $( '#polys', elem ).get( 0 )
          if ( !!config.unit ){
            config.path = config.path.map( function( item ){
              item[ 1 ] *= config.unit
              return item
            })
          }
          var path = texturizerUtils.anglesToCoords( config.path )
          
          // notch the points
          
          if ( config.notch ){
            path = texturizerUtils.notch(
              _.reverse( path ),
              config.notchHeight
            )
          }
          path = texturizerUtils.toOrigin( path ).map( function( item ){
            return [
              item[ 0 ] + config.x,
              item[ 1 ] + config.y
            ]
          })
          
          // plot the points
          
          texturizerUtils.drawLine( svg, path )
        }
      }
    }
  ])
})