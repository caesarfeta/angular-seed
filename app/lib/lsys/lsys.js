define([
'angular',
'lodash'
], 
function(
  angular,
  _ ){
  Math.toRad = function( degrees ) {
    return degrees * Math.PI / 180
  }
  Math.toCart = function( radius, angle ) {
    return [ radius * Math.cos( angle ), radius * Math.sin( angle ) ]
  }
  return angular.module( 'lsys', [ 'atCommon' ])
  .directive( 'lsysCard', [
    function( $http ){
      return {
        scope: {
          lsysCard: '=',
          id: '='
        },
        template: [
          
          '<div class="lsysCard">',
            '<label>{{ lsys.label }}</label>',
            '<div lsys="lsys"></div>',
            
            // play
            
            '<button class="btn btn-sm" ng-click="lsys.draw()">',
              '<i class="fa fa-play"></i>',
            '</button>',
            
            // edit
            
            '<button class="btn btn-sm edit" href="" ng-class="{ \'active\': !!editor }" ng-click="editor = !editor">',
              '{{ ( !editor ) ? "more" : "less" }}',
            '</button>',
            
            // editor 
            
            '<div ng-if="editor" lsys-ctrl="lsys"></div>',
              
//            '<button class="btn btn-sm" href="#/lsys/{{ id }}">edit</button>',
//            '<button class="btn btn-sm" ng-click="lsys.xMirror()">x-mirror</button>',
//            '<button class="btn btn-sm" ng-click="lsys.yMirror()">y-mirror</button>',
//            '<button class="btn btn-sm" ng-click="lsys.clear()">clear</button>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.lsys = scope.lsysCard
          scope.editor = false
        }
      }
    }
  ])
  .directive( 'lsysLib', [
    '$http',
    'lsys',
    'paginator',
    function(
      $http,
      lsys,
      paginator ){
      return {
        template: [
          
          '<div style="background:#DDD">',
            '<div lsys-card="sys" id="$index" ng-repeat="sys in paginator.items()"></div>',
            '<div class="clearfix"></div>',
            '<div paginator="paginator"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          $http.get( './lib/lsys/lsys.json' ).then(
            function( d ){
              scope.paginator = new paginator({
                list: d.data.map( function( item ){
                  return new lsys( item )
                }),
                perPage: 12
              })
            }
          )
        }
      }
    }
  ])
  .directive( 'lsysCtrl', [
    function(){
      return {
        scope: {
          lsysCtrl: '='
        },
        template: [
          
          '<div class="lsysCtrl">',
            
            '<div>',
              '<label>start</label>',
              '<input type="text" ng-model="lsys.start" />',
            '</div>',
            
            '<div>',
              '<label>rules</label>',
              '<div ng-repeat="i in lsys.rules track by $index">',
                '<input type="text" ng-model="lsys.rules[ $index ]" />',
                '<button class="btn btn-sm" ng-click="lsys.rules.splice( $index, 1 )">',
                  '<i class="fa fa-close"></i>',
                '</button>',
              '</div>',
              '<button class="btn btn-sm" ng-click="lsys.rules.push( \'\' )">add</button>',
            '</div>',
            
            '<div>',
              '<label>angle</label>',
              '<input type="number" ng-model="lsys.angle" />',
            '</div>',
            
            '<div>',
              '<label>times</label>',
              '<input type="number" ng-model="lsys.times" />',
            '</div>',
            
            '<div>',
              '<label>duration</label>',
              '<input type="number" ng-model="lsys.duration" />',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.lsys = scope.lsysCtrl
          console.log( scope.lsysCtrl )
        }
      }
    }
  ])
  .directive( 'lsysSketch', [
    '$http',
    'lsys',
    function( $http ){
      return {
        scope: {
          lsysSketch: '='
        },
        template: [
          
          '<div>',
            '<h1>lsysSketch</h1>',
            '<label>{{ lsys.label }}</label>',
            '<div lsys="lsys"></div>',
            '<div lsysCtrl="lsys"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          $http.get( './lib/lsys/lsys.json' ).then(
            function( d ){
              scope.lsys = d.data[ scope.lsysSketch ]
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
          angle: undefined,
          seed: undefined,
          rules: [],
        })
        _.merge( self, config )
      }
      lsys.prototype.update = function(){
        var self = this
        
        // build output
        
        self.n = 0
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
        
        // build coordinates
        
        var angle = self.angle
        var x = 0
        var y = 0
        var maxX = 0
        var maxY = 0
        var minX = 0
        var minY = 0
        self.coords = []
        self.coords.push([ x, y ])
        _.each( self.output.split(''), function( char ){
          switch( char ){
            case '+':
              angle += self.angle
              break
            case '-':
              angle -= self.angle
              break
            default:
              var vector = Math.toCart( 1, Math.toRad( angle ))
              x += vector[0]
              y += vector[1]
              self.coords.push([ x, y ])
              maxX = ( x > maxX ) ? x : maxX
              maxY = ( y > maxY ) ? y : maxY
              minX = ( x < minX ) ? x : minX
              minY = ( y < minY ) ? y : minY
              break
          }
        })
        
        // something funky here VVVV
        
         self.nudgeX = ( minX < 0 ) ? minX * -1 : 0
         self.nudgeY = ( minY < 0 ) ? minY * -1 : 0
        
        var rx = self.canvas.width / ( maxX + self.nudgeX )
        var ry = self.canvas.height / ( maxY + self.nudgeY )
        self.scale = ( rx < ry ) ? rx : ry
        
        // calc draw delay
        
        self.delay = ( self.duration * 1000 ) / self.coords.length
      }
      
      lsys.prototype.init = function( canvas ){
        var self = this
        self.canvas = canvas
        
        // draw the thing
        
        self.draw()
      }
      
      lsys.prototype.clear = function(){
        var self = this
        self.ctx.clearRect( 0, 0, self.canvas.width, self.canvas.height )
        self.fresh = true
      }
      
      lsys.prototype.next = function( i ){
        var self = this
        self.ctx.moveTo(
          ( self.coords[ i ][0] + self.nudgeX ) * self.scale,
          ( self.coords[ i ][1] + self.nudgeY ) * self.scale
        )
        self.ctx.lineTo(
          ( self.coords[ i+1 ][0] + self.nudgeX ) * self.scale,
          ( self.coords[ i+1 ][1] + self.nudgeY ) * self.scale
        )
        self.ctx.stroke()
        if ( i < self.coords.length - 2 ){
          setTimeout(
            function(){
              self.next( i+1 )
            }, self.delay
          )
        }
      }
      
      lsys.prototype.draw = function(){
        var self = this
        self.update()
        self.ctx = self.canvas.getContext( '2d' )
        self.ctx.strokeStyle ='#000'
        self.clear()
        self.ctx.beginPath()
        self.next( 0 )
        self.ctx.closePath()
      }
      
      lsys.prototype.xMirror = function(){
        var self = this
        self.output = self.output + _.reverse( self.output.split('')).join('')
        self.update()
        self.draw()
      }
      
      lsys.prototype.yMirror = function(){
        var self = this
        console.log( 'yMirror' )
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
            
            scope.lsys.init( $( 'canvas', elem ).get(0))
          }
          
          // make sure height and width are calculated before drawing
          
          $timeout( init )
        }
      }
    }
  ])
})