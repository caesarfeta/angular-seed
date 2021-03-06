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
    'dbpediaSpecies',
    'dbpediaFungi',
    function(
      dbpediaSpecies,
      dbpediaFungi ){
      var self = this
      self.fungi = dbpediaFungi
      self.img = dbpediaSpecies
      return self
    }
  ])
  
  // search for species by keyword
  
  .service( 'dbpediaSpecies', [
    'dbpedia',
    'dbpediaQuery',
    '$http',
    'paginator',
    function(
    dbpedia,
    dbpediaQuery,
    $http,
    paginator ){
      var self = this
      self.result = null
      self.search = 'octopus'
      self.history = [ 'ghost', 'death', 'gold', 'rainbow', 'glass' ]
      self.http = function(){
        self.history = _.union( self.history, [ self.search ])
        return dbpedia.http({
          query: dbpediaQuery.img({ 
            search: self.search, 
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
            
            self.paginator = new paginator({
              list: list,
              perPage: 12,
              updateUrl: true
            })
            self.result = list
          }
        })
      }
    }
  ])
  
  // fungi specific dbpedia search
  
  .service( 'dbpediaFungi', [
    '$q',
    '$http',
    'dbpedia',
    'dbpediaQuery',
    'paginator',
    function(
      $q,
      $http,
      dbpedia,
      dbpediaQuery,
      paginator ){
      var self = this;
      self.result = null
      self.genus = null
      function prep( r, filter ){
        
        // simplify the results
        
        self.result = r.data.results.bindings.map( function( item ){
          return {
            img: item.img.value,
            name: item.name.value,
            comment: item.comment.value,
            genus: item.name.value.split(' ')[0],
            url: item.url.value
          }
        })
        
        // apply the filter
        
        if ( !!filter ){
          var re = new RegExp( filter, 'i' )
          self.result = _.filter( self.result, function( item ){
            return re.test( item.name ) || re.test( item.comment )
          })
        }
        
        // what's the genus?
        
        self.genus = _.remove( self.result, function( item ){
          return item.name == item.genus
        })
        
        // count the genus
        
        var genus = {}
        _.each( self.result, function( item ){
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
        
        _.each( self.genus, function( item ){
          var check = genus[ item.genus ] || { count: 0, species: null }
          item.count = check.count
          item.species = check.species
        })
        
        // now sort
        
        self.genus.sort( function( a, b ){
          return b.count - a.count
        })
        
        // paginator
        
        self.paginator = new paginator({
          list: self.genus,
          perPage: 12,
          updateUrl: true
        })
      }
      function httpBkup(){
        return $http.get( 'lib/dbpedia/data/fungi.bkup.json' )
      }
      self.waiting = false
      self.ready = false
      self.http = function( filter ){
        self.waiting = true
        return $q( function( yes, no ){
          dbpedia.http({
            query: dbpediaQuery.fungi(),
            success: function( r ){
              self.waiting = false
              self.ready = true
              prep( r, filter )
              yes()
            },
            error: function( r ){
              httpBkup().then(
               function( r ){
                 self.waiting = false
                 self.ready = true
                 prep( r, filter )
                 yes()
               },
               function(){
                 self.waiting = false
                 self.ready = true
                 no()
               }
              )
            }
          })
        })
      }
    }
  ])
  
  // base dbpedia query service
  
  .service( 'dbpedia', [
    '$http',
    '$q',
    'spinSvc',
    function( 
      $http, 
      $q,
      spinSvc ){
      
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
    }
  ])
})