define([
'angular',
'jquery',
'../utils/utils'
], 
function(
  angular,
  $,
  utils ){
  
  angular.module( 'atCommon', [] )
  .directive( 'paginator', [
    function(){
      return {
        scope: {
          paginator: '='
        },
        template: [
      
          '<ul ng-if="!!paginator"',
              'class="paginator pagination-sm pagination">',
          
            // group back
          
            '<li ng-if="paginator.showGroupBack()"',
                'class="pagination-first">',
              '<a href="" ng-click="paginator.groupBack()">&lt;&lt;</a>',
            '</li>',
          
            // back
          
            '<li ng-if="paginator.showBack()"',
                'class="pagination-prev">',
              '<a href="" ng-click="paginator.back()">back</a>',
            '</li>',
          
            // pages
          
            '<li ng-repeat="n in paginator.pageNs()"',
                'class="pagination-page"',
                'ng-class="{ active: paginator.isActive( n ) }">',
              '<a href="" ng-click="paginator.goTo( n )">{{ n }}</a>',
            '</li>',
          
            // next
          
            '<li ng-if="paginator.showNext()"',
                'class="pagination-next">',
              '<a href="" ng-click="paginator.next()">next</a>',
            '</li>',
          
            // group next
          
            '<li ng-if="paginator.showGroupNext()"',
                'class="pagination-last">',
              '<a href="" ng-click="paginator.groupNext()">&gt;&gt;</a>',
            '</li>',
        
          '</ul>'
      
        ].join(' ')
      }
    }
  ])
  
  .factory( 'paginator', [
    '$location',
    function( $location ){
      var paginator = function( config ){
        var self = this
        _.merge( self, {
          list: undefined,
          total: undefined,
          pages: [],
          currentPage: 1,
          perPage: 25,
          inGroup: 10,
          updateUrl: false
        })
        _.merge( self, config )
        self.total = self.list.length
        self.pages = _.chunk( self.list, self.perPage )
      }
      paginator.prototype.index = function(){
        var self = this
        return parseInt( self.currentPage ) - 1
      }
      paginator.prototype.pageCount = function(){
        var self = this
        return Math.ceil( self.total / self.perPage )
      }
      paginator.prototype.firstPage = function(){
        var self = this
        var group = Math.floor( self.index() / self.inGroup )
        return group * self.inGroup + 1
      }
      paginator.prototype.lastPage = function(){
        var self = this
        var last = self.firstPage() + self.inGroup - 1
        return ( last > self.pageCount() ) ? self.pageCount() : last
      }
      paginator.prototype.pageNs = function(){
        var self = this
        return utils.range( self.lastPage() ).slice( self.firstPage()-1 )
      }
      paginator.prototype.showBack = function(){
        var self = this
        return self.currentPage > 1
      }
      paginator.prototype.showNext = function(){
        var self = this
        return self.currentPage < self.pageCount()
      }
      paginator.prototype.showGroupBack = function(){
        var self = this
        return self.currentPage > self.inGroup
      }
      paginator.prototype.showGroupNext = function(){
        var self = this
        return self.pageCount() != self.lastPage()
      }
      paginator.prototype.isActive = function( n ){
        var self = this
        return self.currentPage == n
      }
      paginator.prototype.pageRange = function(){
        var self = this
        if ( self.currentPage < 1 ){
          self.currentPage = 1
        }
        if ( self.currentPage > self.pageCount() ){
          self.currentPage = parseInt( self.pageCount )
        }
      }
      paginator.prototype.back = function(){
        var self = this
        self.goTo( parseInt( self.currentPage ) - 1 )
      }
      paginator.prototype.next = function(){
        var self = this
        self.goTo( parseInt( self.currentPage ) + 1 )
      }
      paginator.prototype.goTo = function( n ){
        var self = this
        if ( self.updateUrl ){
          $location.url( $location.url().replace( /\/\d+$/, '' )  + '/' + n )
          return
        }
        self.currentPage = n
      }
      paginator.prototype.groupBack = function(){
        var self = this
        self.goTo( parseInt( self.currentPage ) - self.inGroup )
      }
      paginator.prototype.groupNext = function(){
        var self = this
        self.goTo( parseInt( self.currentPage ) + self.inGroup )
      }
      paginator.prototype.items = function(){
        var self = this
        return self.pages[ self.index() ]
      }
      return paginator
    }
  ])
  
  // run function on input enter
  
  .directive('ngEnter', function(){
    return function( scope, elem, attrs ){
      elem.bind( "keydown keypress", function( e ){
        if ( e.which === 13 ){
          
          // if shift key is pressed exit
          
          if ( e.shiftKey ){ return }
          
          scope.$apply(
            function(){
              scope.$eval( attrs.ngEnter )
            }
          )
          e.preventDefault()
        }
      })
    }
  })
  
  .directive( 'scrollStick', [
    '$window',
    function( $window ){
      return {
        link: [ 
        '$scope', 
        '$element', 
        function( scope, elem ){
        
          // on scroll
        
          var top = elem.offset().top
          angular.element( $window ).bind( "scroll", function() {
            if ( this.pageYOffset >= top ){
              elem.addClass('stick')
            } 
            else {
              elem.removeClass('stick')
            }
          
          })
        }]
      }
    }
  ])
  
  // shrink a resource link
  
  .filter('shrinkLink', function(){
    return function( input ){
      if ( input == undefined ){ return '...' }
      if ( input.indexOf( 'http' ) == 0 ){
        return input.substr( input.lastIndexOf('/') + 1 )
      }
      return input
    }
  })
  
  // spin service
  
  .service( 'spinSvc', [
    'spinItem',
    function( spinItem ){
      var self = this
      self.ids = {}
      
      // build the spinItem
      // if it doesn't exist currently
      
      self.register = function( id ){
        if ( ! ( id in self.ids )){
          self.ids[ id ] = new spinItem()
        }
        return self.ids[ id ]
      }

      self.ready = function( id ){
        return id in self.ids
      }
    }
  ])
  
  .factory( 'spinItem', [
    '$timeout',
    function( $timeout ){
      var wait = .5
      var spinItem = function(){
        this.skip = false
        this.elem = undefined
        this.show = false
      }

      spinItem.prototype.off = function( secs ){
        var self = this
        self.skip = false
        secs = ( secs == undefined ) ? wait : secs
        $timeout(
          function(){
            if ( !self.skip ){
              $( self.elem ).hide()
              self.show = false
            }
          },
          secs*1000
        )
      }

      spinItem.prototype.on = function(){
        var self = this
        self.skip = true
        self.show = true
        if ( self.elem != undefined ){
          $( self.elem ).show()
        }
      }

      spinItem.prototype.setElem = function( elem ){
        var self = this
        self.elem = elem
        if ( self.show == true ){
          self.on()
        }
        else {
          self.off( 0 )
        }
      }

      return spinItem
    }
  ])
  
  .directive( 'spinner', [
    'spinSvc',
    function( spinSvc ){
      return {
        template: [
          
          '<div class="spinner">',
            '<div class="rect1"></div>',
            '<div class="rect2"></div>',
            '<div class="rect3"></div>',
            '<div class="rect4"></div>',
            '<div class="rect5"></div>',
          '</div>'
          
        ].join(''),
        replace: true,
        scope: {
          spinId: '@'
        },
        link: function( scope, elem ){
  
          // watch for spinSvc registration
          
          var unbind = scope.$watch(
            function(){ return spinSvc.ready( scope.spinId )},
            function( n, o ){
              if ( n == undefined ){ return }
              if ( n === true ){
                start()
                unbind()
              }
            }
          )
          
          // start
          
          function start(){
            scope.spin = spinSvc.ids[ scope.spinId ]
            scope.spin.setElem( elem )
          }
        }
      }
    }
  ])
  
  // highlight text
  
  .filter( 'highlight',[ 
    '$sce', 
    function( $sce ) {
      return function( text, phrase ){
        if ( phrase && text ){
          text = text.replace(
            new RegExp( '(' + phrase + ')', 'gi' ),
            '<span class="highlight">$1</span>'
          )
        } 
        return $sce.trustAsHtml( text )
      }
    }
  ])
  
  // id generator
  
  .service( 'atGen', [
    function(){
      var self = this
      self.elemId = function(){
        function s4() {
          return Math.floor(( 1 + Math.random()) * 0x10000 )
              .toString( 16 )
              .substring( 1 )
        }
        return 'at' + s4() + s4()
      }
    }
  ])
  .directive( 'atMenu', [
    '$location',
    function( $location ){
      return {
        template: [
          
          '<ul class="menu">',
            '<li ng-repeat="( name, url ) in atMenu">',
              '<a ng-class="style( url )" href="#/{{ url }}">{{ name }}</a>',
            '</li>',
            '<li><i class="fa fa-{{ last() }}"></i></li>',
          '</ul>'
          
        ].join(''),
        scope: {
          atMenu: '='
        },
        replace: true,
        link: function( scope, elem ){
          
          scope.last = function(){
            return $location.url().substr( 
              $location.url().lastIndexOf('/') + 1
            )
          }
          
          scope.style = function( url ){
            return {
              selected: $location.url().lastIndexOf( url ) != -1
            }
          }
          
        }
      }
    }
  ])
  .directive( 'atYear', [
    function(){
      return {
        template: '<span class="at-date">{{ time | date: "yyyy" }}</span>',
        replace: true,
        link: function( scope, elem ){
          scope.time = Date.now()
        }
      }
    }
  ])
  .directive( 'atVersion', [
    function(){
      return {
        template: '<div class="at-version">v<span app-version></span></div>',
        replace: true
      }
    }
  ])
})