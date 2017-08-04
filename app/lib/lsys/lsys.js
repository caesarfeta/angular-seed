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
  return angular.module( 'lsys', [])
  .directive( 'lsysLib', [
    '$http',
    function( $http ){
      return {
        template: [
          
          '<div style="width:300px;height:300px" ng-repeat="sys in lsys">',
            '<div lsys="sys"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          $http.get( './lib/lsys/lsys.json' ).then(
            function( d ){
              scope.lsys = d.data
            }
          )
        }
      }
    }
  ])
  .factory( 'lsys', [
    function(){
      var lsys = function( config ){
        var self = this
        _.merge( self, {
          times: undefined,
          n: 0,
          angle: undefined,
          seed: undefined,
          rules: [],
        })
        _.merge( self, config )
        self.vars = {}
        _.each( self.rules, function( rule ){
          var map = rule.split( '=' )
          self.vars[map[0]] = map[1]
        })
        self.output = self.start
        while( self.n < self.times ){
          var chars = self.output.split('')
          for ( var i in chars ){
            if ( chars[i] in self.vars ){
              chars[i] = self.vars[ chars[i] ]
            }
          }
          self.output = chars.join('')
          self.n++
        }
      }
      return lsys
    }
  ])
  .directive( 'lsys', [
    'lsys',
    '$timeout',
    function(
      lsys,
      $timeout ){
      return {
        scope: {
          lsys: '='
        },
        replace: true,
        template: [
          
          '<div class="lsys">',
            '<canvas height="{{ ::height }}" width="{{ ::width }}"></canvas>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.height = elem.height()
          scope.width = elem.width()
          function init(){
            
            // turn l-system directions into coordinates
            
            var sys = new lsys( scope.lsys )
            var angle = scope.lsys.angle
            var x = 0
            var y = 0
            var maxX = 0
            var maxY = 0
            var minX = 0
            var minY = 0
            var coords = []
            coords.push([ x, y ])
            _.each( sys.output.split(''), function( char ){
              switch( char ){
                case '+':
                  angle += scope.lsys.angle
                  break
                case '-':
                  angle -= scope.lsys.angle
                  break
                case '[':
                  var vector = Math.toCart( 1, Math.toRad( angle ))
                  x += vector[0]
                  y += vector[1]
                  coords.push([ x, y ])
                  break
                case ']':
                  coords.pop()
                  break
                default:
                  var vector = Math.toCart( 1, Math.toRad( angle ))
                  x += vector[0]
                  y += vector[1]
                  coords.push([ x, y ])
                  maxX = ( x > maxX ) ? x : maxX
                  maxY = ( y > maxY ) ? y : maxY
                  minX = ( x < minX ) ? x : minX
                  minY = ( y < minY ) ? y : minY
                  break
              }
            })
            
            // figure out scale and centering
            
            var canvas = $( 'canvas', elem ).get(0)
            var nudgeX = ( minX < 0 ) ? minX * -1 : 0
            var nudgeY = ( minY < 0 ) ? minY * -1 : 0
            var rx = canvas.width / ( maxX + nudgeX )
            var ry = canvas.height / ( maxY + nudgeY )
            var scale = ( rx < ry ) ? rx : ry
            var centerX = canvas.width / 2
            
            // draw the thing
            
            var ctx = canvas.getContext( '2d' )
            ctx.strokeStyle ='#000'
            var i = 0
            while ( i < coords.length-1 ){
              setTimeout(
                draw( ctx, coords, i, scale, centerX, nudgeY ),
                scope.lsys.delay * 1000 * i
              )
              i++
            }
          }
          
          function draw( ctx, coords, i, scale, centerX, nudgeY ){
            ctx.moveTo(
              (coords[ i ][0] ) * scale + centerX,
              ( coords[ i ][1] + nudgeY ) * scale
            )
            ctx.lineTo(
              ( coords[ i+1 ][0] ) * scale + centerX,
              ( coords[ i+1 ][1] + nudgeY ) * scale
            )
            ctx.stroke()
          }
          
          // make sure height and width are calculated before drawing
          
          $timeout( init )
        }
      }
    }
  ])
})