define([
'angular',
'lodash',
'../utils/utils'
],
function(
  angular,
  _,
  utils ){
  angular.module( 'frottage', [])
  .directive( 'frottage', [
    function(){
      return {
        scope: {},
        
        // 8.5 * 300 x 11 * 300 - Natch
        
        template: [
          
          '<canvas id="frottage" width="2550" height="3300" style="border:1px solid">'
        
        ].join(' '),
        link: function( scope, elem ){
          var canvas = $( '#frottage', elem ).get( 0 )
          var colors = [ '#AAA', '#BBB', '#CCC', '#DDD', '#EEE', '#FFF' ]
          var rows = 50
          var cols = 50
          var ix = canvas.height / rows
          var jx = canvas.width / cols
          var ctx = canvas.getContext( '2d' )
          var grid = []
          
          function build(){
            for ( var i=0; i<ix; i++ ){
              grid[i]=[]
              for ( var j=0; j<jx/2; j++ ){
                grid[i][j] = colors[ Math.floor( Math.random() * colors.length )]
              }
              grid[i] = grid[i].concat( grid[i].slice().reverse() )
            }
          }
          
          function draw(){
            for ( var i=0; i<ix; i++ ){
              for ( var j=0; j<jx; j++ ){
                ctx.beginPath()
                ctx.rect( jx*j, ix*i, jx, ix )
                ctx.fillStyle = grid[i][j]
                ctx.fill()
              }
            }
          }
          
          build()
          draw()
          
        }
      }
    }
  ])
})