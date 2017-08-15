define([
'angular',
'lodash',
'../utils/utils'
], 
function(
  angular,
  _,
  utils ){
  Math.toRad = function( degrees ) {
    return degrees * Math.PI / 180
  }
  Math.toCart = function( radius, angle ) {
    return [ radius * Math.cos( angle ), radius * Math.sin( angle ) ]
  }
  return angular.module( 'lsys', [ 'atCommon' ])
  .service( 'lsysHttp', [
    '$http',
    '$q',
    function(
      $http,
      $q ){
      var self = this
      self.list = undefined
      self.load = function(){
        return $q( function( yes, no ){
          if ( !!self.list ){
            return yes( self.list )
          }
          $http.get( './lib/lsys/lsys.json' ).then(
            function( d ){
              self.list = d.data
              return yes( self.list )
            },
            function( e ){
              return no( e )
            }
          )
        })
      }
      return self
    }
  ])
  .directive( 'lsysJson', [
    function(){
      return {
        scope: true,
        template: [
          
          '<div class="lsysJson">',
            '<label>save starter</label>',
            '<textarea>{{ text() }}</textarea>',
          '</div>',
          
        ].join(''),
        link: function( scope ){
          scope.text = function(){
            return JSON.stringify({
              label: 'untitled',
              times: scope.lsys.times,
              angle: scope.lsys.angle,
              start: scope.lsys.start,
              rules: scope.lsys.rules,
              duration: scope.lsys.duration
            }, ' ', 2 )
          }
        }
      }
    }
  ])
  .directive( 'lsysDrawPath', [
    function(){
      return {
        scope: true,
        template: [
          
          '<div ng-if="!!lsys.output" class="lsysDump">',
            '<label>draw path</label>',
            '<p>',
              '{{ lsys.output }}',
            '</p>',
          '</div>'
          
        ].join(''),
        link: function( scope ){}
      }
    }
  ])
  .directive( 'lsysCard', [
    '$location',
    'lsys',
    function(
      $location,
      lsys ){
      return {
        scope: {
          lsysCard: '='
        },
        template: [
          
          '<div class="lsysCard">',
            
            // display
            
            '<div class="lsysDisplay">',
              '<label><a href="" ng-click="goTo( lsys.id )">{{ lsys.label }}</a></label>',
              '<div lsys="lsys"></div>',
              
              // play
              
              '<button class="btn btn-sm" ng-click="lsys.draw()">',
                '<i class="fa fa-play"></i>',
              '</button>',
              
              // tweak
              
              '<button class="btn btn-sm"',
                      'href=""',
                      'ng-class="{ \'active\': !!tweak }"',
                      'ng-click="tweak = !tweak">',
                '{{ ( !tweak ) ? "tweak" : "done" }}',
              '</button>',
            '</div>',
            
            // controls
            
            '<div class="lsysCtrl">',
              
              // editor 
              
              '<div ng-if="tweak" lsys-ctrl></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.lsys = new lsys( scope.lsysCard )
          scope.tweak = false
          scope.goTo = function( id ){
            $location.url( '/lsys/' + id )
          }
        }
      }
    }
  ])
  .directive( 'lsysLib', [
    'lsysHttp',
    'paginator',
    function(
      lsysHttp,
      paginator ){
      return {
        scope: {
          lsysLib: '='
        },
        template: [
          
          '<div class="lsysLib">',
            '<div lsys-card="sys" ng-repeat="sys in paginator.items()"></div>',
            '<div class="clearfix"></div>',
            '<div paginator="paginator"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          lsysHttp.load().then(
            function( list ){
              scope.paginator = new paginator({
                list: list,
                perPage: 4,
                updateUrl: true,
                currentPage: scope.lsysLib
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
        scope: true,
        template: [
          
          '<div class="lsysCtrl">',
            
            '<div>',
              '<label>start</label>',
              '<input type="text" ng-model="lsys.start" ng-enter="lsys.draw()" />',
            '</div>',
            
            '<div class="lsysRules">',
              '<label>rules</label>',
              '<div ng-repeat="i in lsys.rules track by $index">',
                '<input type="text" ng-model="lsys.rules[ $index ]" ng-enter="lsys.draw()" />',
                '<button class="btn btn-sm" ng-click="lsys.rules.splice( $index, 1 )">',
                  '<i class="fa fa-close"></i>',
                '</button>',
              '</div>',
              '<button class="btn btn-sm" ng-click="lsys.rules.push( \'\' )">add</button>',
            '</div>',
            
            '<div>',
              '<label>angle</label>',
              '<input type="number" ng-model="lsys.angle" ng-enter="lsys.draw()" />',
            '</div>',
            
            '<div>',
              '<label>times</label>',
              '<input type="number" ng-model="lsys.times" ng-enter="lsys.draw()" />',
            '</div>',
            
          '</div>'
          
        ].join(' ')
      }
    }
  ])
  .directive( 'lsysSketch', [
    'lsysHttp',
    'lsys',
    '$timeout',
    function(
      lsysHttp,
      lsys,
      $timeout ){
      return {
        scope: {
          lsysSketch: '='
        },
        template: [
          
          '<div ng-if="!!lsys" class="lsysSketch">',
            '<div lsys-card="lsys"></div>',
            '<div lsys-draw-path></div>',
            
            // json config
            
            '<div lsys-json></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          lsysHttp.load().then(
            function( list ){
              var json = _.find( list, function( sys ){
                return !!sys.label && utils.sha( sys.label ) == scope.lsysSketch
              })
              scope.lsys = new lsys( json )
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
          label: undefined,
          times: undefined,
          angle: undefined,
          seed: undefined,
          rules: [],
        })
        _.merge( self, config )
        
        // generage id by hashing unique label
        
        self.id = utils.sha( self.label )
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