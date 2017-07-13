define([
'../module',
'lodash'
], 
function( 
  module, 
  _ ){
    'use strict'
  module.service( 'dbpediaSvc', [
    '$http',
    '$q',
    'dbpediaQuery',
    'spinSvc',
    function( 
      $http, 
      $q,
      dbpediaQuery,
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
      
      self.fungi = {}
      self.fungi.result = null
      self.fungi.genus = null
      self.fungi.http = function(){
        return $q( function( yes, no ){
          self.http({
            query: dbpediaQuery.fungi(),
            success: function( r ){
              
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
              
              // self.fungi.genus.sort( function( a, b ){
              //   return b.count - a.count
              // })
              
              self.fungi.genus = self.fungi.genus.sort( function( a, b ){
                return b.count - a.count
              }).slice( 0, 10 )
              
              // done
              
              yes()
            },
            error: function( r ){
              no( r )
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