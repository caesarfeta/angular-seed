define([
'../module',
'lodash'
], 
function( 
  module, 
  _ ){
  'use strict'
  module
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
          list: self.fungi.genus,
          perPage: 12
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
      self.img.search = 'octopus'
      self.img.history = [ 'ghost', 'death', 'gold', 'rainbow', 'glass' ]
      self.img.http = function(){
        self.img.history = _.union( self.img.history, [ self.img.search ])
        return self.http({
          query: dbpediaQuery.img({ 
            search: self.img.search, 
            limit: 25 
          }),
          success: function( r ){
            var list = _.uniqBy( r.data.results.bindings, function( item ){
              return item.name.value
            })
            
            // some quick cleanup
            
            _.each( list, function( item ){
              if ( !!item.species ){
                item.species.value = item.species.value.replace( /^\w+\. /, '' )
                item.species.value = item.species.value.charAt( 0 ).toUpperCase() + item.species.value.slice( 1 )
              }
              if ( !!item.genus ){
                item.genus.value = item.genus.value.split('_')[ 0 ]
              }
            })
            
            // paginator
            
            self.img.paginator = new paginator({
              list: list,
              perPage: 12,
              updateUrl: true
            })
            self.img.result = list
          },
          error: function( r ){}
        }).then( 
          
          // success
          
          function(){},
          
          // error
          
          function(){}
        )
      }
    }
  ])
})