define([
'../module',
'lodash'
], 
function( 
  module, 
  _ ){
  'use strict'
  module
  .directive( 'paginator', [
    function(){
      return {
        scope: {
          paginator: '='
        },
        template: [
        
          '<ul ng-if="!!paginator"',
              'class="pagination-sm pagination">',
            
            // group back
            
            '<li ng-if="paginator.showGroupBack()"',
                'class="pagination-first">',
              '<a ng-click="paginator.groupBack()">&lt;&lt;</a>',
            '</li>',
            
            // back
            
            '<li ng-if="paginator.showBack()"',
                'class="pagination-prev">',
              '<a ng-click="paginator.back()">back</a>',
            '</li>',
            
            // pages
            
            '<li ng-repeat="n in paginator.pages"',
                'class="pagination-page"',
                'ng-class="{ active: paginator.isActive( $index + 1 ) }">',
              '<a ng-click="paginator.goTo( $index + 1 )">{{ $index + 1 }}</a>',
            '</li>',
            
            // next
            
            '<li ng-if="paginator.showNext()"',
                'class="pagination-next">',
              '<a ng-click="paginator.next()">next</a>',
            '</li>',
            
            // group next
            
            '<li ng-if="paginator.showGroupNext()"',
                'class="pagination-last">',
              '<a ng-click="paginator.groupNext()">&gt;&gt;</a>',
            '</li>',
          
          '</ul>'
        
        ].join(' ')
      }
    }
  ])
  .factory( 'paginator', [
    function(){
      var paginator = function( config ){
        var self = this
        _.merge( self, {
          list: undefined,
          total: undefined,
          pages: [],
          currentPage: 1,
          perPage: 50,
          inGroup: 10
        })
        _.merge( self, config )
        self.total = self.list.length
        self.pages = _.chunk( self.list, self.perPage )
      }
      paginator.prototype.index = function(){
        var self = this
        return self.currentPage - 1
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
          self.currentPage = self.pageCount
        }
      }
      paginator.prototype.back = function(){
        var self = this
        self.currentPage--
        self.pageRange()
      }
      paginator.prototype.next = function(){
        var self = this
        self.currentPage++
        self.pageRange()
      }
      paginator.prototype.goTo = function( n ){
        var self = this
        self.currentPage = n
        self.pageRange()
      }
      paginator.prototype.groupBack = function(){
        var self = this
        self.currentPage = self.currentPage - self.inGroup
        self.pageRange()
      }
      paginator.prototype.groupNext = function(){
        var self = this
        self.currentPage = self.currentPage + self.inGroup
        self.pageRange()
      }
      paginator.prototype.items = function(){
        var self = this
        return self.pages[ self.index() ]
      }
      return paginator
    }
  ])
  .service( 'dbpediaSvc', [
    '$http',
    '$q',
    'dbpediaQuery',
    'spinSvc',
    'paginator',
    function( 
      $http, 
      $q,
      dbpediaQuery,
      spinSvc,
      paginator ){
      
      var spinner = spinSvc.register( 'dbpedia-http' )
      function spinnerOff(){
        spinner.off( 2 )
      }
      
      var url = "http://dbpedia.org/sparql"
      var self = this
      self.buildUrl = function( query ){
        return encodeURI( url + "?query=" + query + "&format=json" )
      }
      self.waiting = false
      self.http = function( config ){
        spinner.on()
        self.waiting = true
        return $q( function( yes, no ){
          $http.get( self.buildUrl( config.query ) ).then(
            
            // success
          
            function( r ){
              config.success( r )
              spinnerOff()
              self.waiting = false
              yes( r )
            },
          
            // error
          
            function( r ){
              config.error( r )
              spinnerOff()
              self.waiting = false
              no( r )
            }
          )
        })
      }
      
      self.fungi = {}
      self.fungi.result = null
      self.fungi.genus = null
      function prep( r ){
        
        // simplify the results
        
        self.fungi.result = r.data.results.bindings.map( function( item ){
          return {
            img: item.img.value,
            name: item.name.value,
            comment: item.comment.value,
            genus: item.name.value.split(' ')[0]
          }
        })
        
        // what's the genus?
        
        self.fungi.genus = _.remove( self.fungi.result, function( item ){
          return item.name == item.genus
        })
        
        // count the genus
        
        var genus = {}
        _.each( self.fungi.result, function( item ){
          if ( !!genus[ item.genus ] ){
            genus[ item.genus ].count += 1
            genus[ item.genus ].species.push( item )
            return
          }
          genus[ item.genus ] = {
            count: 1,
            species: [ item ]
          }
        })
        
        // put them in place
        
        _.each( self.fungi.genus, function( item ){
          var check = genus[ item.genus ] || { count: 0, species: null }
          item.count = check.count
          item.species = check.species
        })
        
        // now sort
        
        self.fungi.genus.sort( function( a, b ){
          return b.count - a.count
        })
        
        // paginator
        
        self.fungi.paginator = new paginator({
          list: self.fungi.genus
        })
      }
      function httpBkup(){
        return $http.get( 'lib/dbpedia/data/fungi.bkup.json' )
      }
      self.fungi.waiting = false
      self.fungi.ready = false
      self.fungi.http = function(){
        self.fungi.waiting = true
        return $q( function( yes, no ){
          self.http({
            query: dbpediaQuery.fungi(),
            success: function( r ){
              self.fungi.waiting = false
              self.fungi.ready = true
              prep( r )
              yes()
            },
            error: function( r ){
              httpBkup().then(
               function( r ){
                 self.fungi.waiting = false
                 self.fungi.ready = true
                 prep( r )
                 yes()
               },
               function(){
                 self.fungi.waiting = false
                 self.fungi.ready = true
                 no()
               }
              )
            }
          })
        })
      }
      
      // query search
      
      self.query = {}
      self.query.result = null
      self.query.http = function( query ){
        return self.http({
          query: query,
          success: function( r ){ self.query.result = r },
          error: function( r ){ self.query.result = r }
        })
      }
      
      // img search
      
      self.img = {}
      self.img.result = null
      self.img.search = null
      self.img.history = [ 'ghost', 'death', 'gold', 'rainbow', 'glass' ]
      self.img.http = function(){
        return self.http({
          query: dbpediaQuery.img({ 
            search: self.img.search, 
            limit: 25 
          }),
          success: function( r ){
            console.log( JSON.stringify( r, ' ', 2 ))
            self.img.result = r.data.results.bindings
          },
          error: function( r ){}
        }).then( 
          
          // success
          
          function(){ 
            self.img.history = _.union( self.img.history, [ self.img.search ])
          },
          
          // error
          
          function(){}
        )
      }
    }
  ])
})