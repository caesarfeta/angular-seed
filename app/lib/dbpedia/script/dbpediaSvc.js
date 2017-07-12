define([
'../module',
'lodash'
], 
function( 
  module, 
  _ ){
  module.service( 'atFungus', [
    '$http',
    '$q',
    function(
      $http,
      $q ){
      var self = this
      self.phylum = function(){
        [
          'PREFIX dbpedia2: <http://dbpedia.org/property/>',
          'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
          'SELECT DISTINCT ?phylum',
          'WHERE {',
            '?s dbpedia2:regnum :Fungus;',
               'dbpedia2:phylum ?phylum',
          '}'
        ].join(' ')
      }
      
      self.class = function( phylum ){
        [
          'PREFIX dbpedia2: <http://dbpedia.org/property/>',
          'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
          'SELECT DISTINCT ?class',
          'WHERE { ',
          '?s dbpedia2:phylum :' + phylum + ';',
             'dbpedia2:classis ?class',
          '}'
        ].join(' ')
      }
      
      self.order = function( _class ){
        [
          'PREFIX dbpedia2: <http://dbpedia.org/property/>',
          'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
          'SELECT DISTINCT ?ordo',
          'WHERE { ',
          '?s dbpedia2:classis :' + _class + ';',
             'dbpedia2:ordo ?ordo',
          '}'
        ].join(' ')
      }
      
      self.family = function( order ){
        [
          'PREFIX dbpedia2: <http://dbpedia.org/property/>',
          'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
          'SELECT DISTINCT ?family',
          'WHERE { ',
          '?s dbpedia2:ordo :' + order + ';',
             'dbpedia2:familia ?family',
          '}'
        ].join(' ')
      }
      
      self.genus = function( family ){
        [
          'PREFIX dbpedia2: <http://dbpedia.org/property/>',
          'PREFIX foaf: <http://xmlns.com/foaf/0.1/>',
          'SELECT DISTINCT ?genus',
          'WHERE { ',
          '?s dbpedia2:familia :' + family + ';',
             'dbpedia2:genus ?genus',
          '}'
        ].join(' ')
      }
      
      
    }
  ])
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
        
      var spinner = spinSvc.register( 'dbpedia-http' );
      function spinnerOff(){
        spinner.off( 2 );
      }
      
      var url = "http://dbpedia.org/sparql";
      var self = this;
      self.buildUrl = function( query ){
        return encodeURI( url + "?query=" + query + "&format=json" );
      };
      self.waiting = false;
      self.http = function( config ){
        spinner.on();
        self.waiting = true;
        return $q( function( yes, no ){
          $http.get( self.buildUrl( config.query ) ).then(
            
            // success
          
            function( r ){
              config.success( r );
              spinnerOff();
              self.waiting = false;
              yes( r );
            },
          
            // error
          
            function( r ){
              config.error( r );
              spinnerOff();
              self.waiting = false;
              no( r );
            }
          );
        })
      };
      
      // query search
      
      self.query = {};
      self.query.result = null;
      self.query.http = function( query ){
        return self.http({
          query: query,
          success: function( r ){ self.query.result = r },
          error: function( r ){ self.query.result = r }
        })
      }
      
      // img search
      
      self.img = {};
      self.img.result = null;
      self.img.search = null;
      self.img.history = [ 'ghost', 'death', 'gold', 'rainbow', 'glass' ];
      self.img.http = function(){
        return self.http({
          query: dbpediaQuery.img({ 
            search: self.img.search, 
            limit: 25 
          }),
          success: function( r ){ self.img.result = r.data.results.bindings },
          error: function( r ){}
        }).then( 
          
          // success
          
          function(){ 
            self.img.history = _.union( self.img.history, [ self.img.search ])
          },
          
          // error
          
          function(){}
        );
      };
    }
  ])
})