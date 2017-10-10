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
          var config = scope.json
          config = _.merge({
            width: 3,
            height: 3,
            depth: 1.5,
            thickness: .25
          }, config )
          function side( w, h, thickness ){
            return texturizerUtils.notch(
              
              // path to notch
              
              _.reverse(
                texturizerUtils.anglesToCoords([
                  [ 90, h - thickness*2 ],
                  [ 90, w - thickness*2 ],
                  [ 90, h - thickness*2 ],
                  [ 90, w - thickness*2 ]
                ]).map( function( item ){
                  return [
                    item[ 0 ] + 100,
                    item[ 1 ] + 400
                  ]
                })
              ),
              
              // notch thickness
              
              thickness
            )
          }
          function draw( config ){
            var svg = $( '#polys', elem ).get( 0 )
            var dpi = utils.dpi()
            config = _.mapValues( config, function( v ){
              return v * dpi
            })
            var wxh = side( config.width, config.height, config.thickness )
            var wxd = side( config.depth, config.height, config.thickness )
            var hxd = side( config.width, config.depth, config.thickness )
            texturizerUtils.drawLine( svg, wxh )
            texturizerUtils.drawLine( svg, wxd )
            texturizerUtils.drawLine( svg, hxd )
          }
          draw( config )
        }
      }
    }
  ])
})