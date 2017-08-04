define([
'angular',
'lodash',
  
], 
function(
  angular,
  _,
  LSYS ){
  
  Math.toRad = function( degrees ) {
    return degrees * Math.PI / 180
  }
  
  Math.toCart = function( radius, angle ) {
    return [ radius * Math.cos( angle ), radius * Math.sin( angle ) ]
  }
  
  return angular.module( 'lsys', [
  ])
  .factory( 'lsys', [
    function(){
      var lsys = function( config ){
        var self = this
        _.merge( self, {
          canvas: undefined,
          rules: []
        })
        _.merge( self, config )
        console.log( self )
      }
      return lsys
    }
  ])
  .directive( 'lsys', [
    'lsys',
    function( lsys ){
      return {
        scope: {
          lsys: '='
        },
        replace: true,
        template: [
          
          '<div class="lsys">',
            '<canvas height="100%" width="100%"></canvas>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.dump = JSON.stringify( scope.lsys, ' ', 2 )
          new lsys( _.merge( 
            scope.lsys,
            { canvas: $( 'canvas', elem ).get(0) }
          ))
          
          // var sys = new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' )
          // console.log( sys )
          // sys.run()
          // sys.draw({
          //   init: function( _a, _b, _i ){
          //     return _i * _b / 5000
          //   }
          // })
        }
      }
    }
  ])
})