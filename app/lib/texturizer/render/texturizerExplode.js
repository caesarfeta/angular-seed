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
  .directive( 'texturizerExplode', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="explode" fill="none"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          function draw( svg, config ){
            var points = utils.math.circle.nCoords( config.total )
            _.each( points, function( point ){
              var r = _.clone( config.r ).sort()
              var space = r[1]
              var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' )
              path.setAttribute( 'd', [
                
                `M ${ point[0] * r[0] + space + config.x } ${ point[1] * r[0] + space + config.y }`,
                `L ${ point[0] * r[1] + space + config.x } ${ point[1] * r[1] + space + config.y }`
                
              ].join(' '))
              path.setAttribute( 'stroke-width', config.width )
              path.setAttribute( 'stroke', 'black' )
              path.setAttribute( 'fill', 'none' )
              svg.appendChild( path )
            })
          }
          _.each( scope.json.explosions, function( config ){
            draw(
              $( '#explode', elem ).get( 0 ),
              config
            )
          })
        }
      }
    }
  ])
})