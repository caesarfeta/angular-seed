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
          var rows = 100
          var cols = 50
          var ix = canvas.height / rows
          var jx = canvas.width / cols
          for ( var i=0; i<ix; i++ ){
            for ( var j=0; j<jx; j++ ){
              console.log( i, j )
            }
          }
        }
      }
    }
  ])
})