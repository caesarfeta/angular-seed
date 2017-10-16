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
  .directive( 'texturizerSineWave', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg xmlns="http://www.w3.org/2000/svg"',
               'width="100%" height="800">',
            '<g id="waves"></g>',
          '</svg>'
          
        ].join(' '),
        link: function( scope, elem ){
          var config = scope.json
          function position( x, config ){
            return Math.sin( x / config.frequency ) * config.amplitude
          }
          function drawWave( svg, config, n ){
            config = _.merge({
              frequency: 0.25,
              amplitude: 1,
              unit: 1
            }, config )
            var i = 0
            while ( i < config.total ){
              var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" )
              var x = 0
              var data = []
              while ( x < config.width ){
                var pre = ( x == 0 ) ? 'M' : 'L'
                var y = position( x, config ) + i * config.space
                data.push( pre + ' ' + x + ' ' + y )
                x += config.unit
              }
              path.setAttribute( 'd', data.join(' ') )
              path.setAttribute( 'stroke', 'black' )
              path.setAttribute( 'stroke-width', 2 )
              path.setAttribute( 'fill', 'none' )
              svg.appendChild( path )
              i++
            }
          }
          var n = 0
          while( n < config.waves.length ){
            drawWave(
              $( '#waves', elem ).get( 0 ),
              config.waves[ n ],
              n
            )
            n++
          }
        }
      }
    }
  ])
})