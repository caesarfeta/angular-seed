define([
'./module',
'../utils/utils',
'lodash'
], 
function(
  module,
  utils,
  _ ){
  module
  .directive( 'texturizerBox', [
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
            width: '6',
            height: '3',
            depth: '3',
            thickness: '.25'
          })
          var svg = $( '#polys', elem ).get( 0 )
          var dpi = utils.dpi()
          config = _.mapValues( config, function( v ){
            return v * dpi
          })
          function side( w, h ){
            return texturizerUtils.notch(
              
              // path to notch
              
              _.reverse(
                texturizerUtils.anglesToCoords([
                  [ 90, h ],
                  [ 90, w ],
                  [ 90, h ],
                  [ 90, w ]
                ]).map( function( item ){
                  return [
                    item[ 0 ] + 100,
                    item[ 1 ] + 400
                  ]
                })
              ),
              
              // notch thickness
              
              config.thickness
            )
          }
          var wxh = side( config.width, config.height )
          var wxd = side( config.depth, config.height )
          var hxd = side( config.width, config.depth )
          texturizerUtils.drawLine( svg, wxh )
          texturizerUtils.drawLine( svg, wxd )
          texturizerUtils.drawLine( svg, hxd )
        }
      }
    }
  ])
})