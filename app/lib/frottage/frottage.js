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
        template: [
          '<button class="btn btn-sm" ng-click="redraw()">redraw</button>',
          '<canvas id="frottage" width="500" height="500">'
        
        ].join(' '),
        link: function( scope, elem ){
          var canvas = $( '#frottage', elem ).get( 0 )
          var colors = [ '#AAA', '#BBB', '#CCC', '#DDD', '#EEE', '#FFF' ]
          // var colors = [ '#111', '#222', '#333', '#444', '#555', '#666' ]
          //var colors = [ '#DDD', '#EEE', '#FFF' ]
          //var colors = [ 'blue', 'red', 'green' ]
          var rows = 80
          var cols = 80
          var ix = canvas.height / rows
          var jx = canvas.width / cols
          var ctx = canvas.getContext( '2d' )
          var grid = []
          
          function build(){
            for ( var i=0; i<rows/2; i++ ){
              grid[i]=[]
              for ( var j=0; j<cols/2; j++ ){
                grid[i][j] = colors[ Math.floor( Math.random() * colors.length )]
              }
              grid[i] = grid[i].concat( grid[i].slice().reverse() )
            }
            grid = grid.concat( grid.slice().reverse() )
          }
          
          function draw(){
            for ( var i=0; i<rows; i++ ){
              for ( var j=0; j<cols; j++ ){
                ctx.beginPath()
                ctx.rect( jx*j+10, jx*i+10, jx, jx )
                ctx.fillStyle = grid[i][j]
                ctx.fill()
              }
            }
          }
          scope.redraw = function(){
            build()
            draw()
          }
          scope.redraw()
        }
      }
    }
  ])
})