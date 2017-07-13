define([
'../module',
'Masonry'
], 
function(
  module,
  Masonry ){
  module
  .directive( 'dbpSpecies', [
    'dbpediaSvc',
    function( dbpedia ){
      return {
        restrict: 'E',
        replace: true,
        scope: {},
        template: [
          
          '<div class="dbpedia-bio-species-bg" ng-show="on()">',
            '<div class="dbpedia-bio-species clearfix"',
                 'ng-repeat="species in dbpedia.img.result">',
              '<h2 class="name" ng-bind-html="species.name.value | highlight:dbpedia.img.search"></h2>',
              '<div img-kit="{{ species.img.value }}"><img ng-src="{{ species.img.value }}"/></div>',
              '<table class="taxonomy">',
                '<tr><td>Kingdom</td><td>{{ species.kingdom.value | shrinkLink }}</td></tr>',
                '<tr><td>Phylum</td><td>{{ species.phylum.value | shrinkLink }}</td></tr>',
                '<tr><td>Class</td><td>{{ species.class.value | shrinkLink }}</td></tr>',
                '<tr><td>Order</td><td>{{ species.order.value | shrinkLink }}</td></tr>',
                '<tr><td>Family</td><td>{{ species.family.value | shrinkLink }}</td></tr>',
                '<tr><td>Genus</td><td>{{ species.genus.value | shrinkLink }}</td></tr>',
                '<tr><td>Species</td><td>{{ species.species.value | shrinkLink }}</td></tr>',
              '</table>',
              '<div class="abstract" ng-bind-html="species.abstract.value | highlight:dbpedia.img.search"></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.dbpedia = dbpedia
          scope.on = function(){
            return dbpedia.img.result != null && dbpedia.img.result.length > 0 && !dbpedia.waiting
          }
        }
      }
    }
  ])
  .config([
    '$routeProvider',
    function( $routeProvider ){
      $routeProvider.when( '/fungi', {
        template: [
          
          '<div dbp-fungi-genus-list></div>'
          
        ].join(' '),
        controller: function(){}
      })
      $routeProvider.when( '/fungi/:genus*', {
        template: [
          
          '<div dbp-fungi-species-list></div>'
          
        ].join(' '),
        controller: [ 
          '$scope',
          '$routeParams',
          function( scope, $routeParams ){
            scope.genus = $routeParams.genus
          }
        ]
      })
    }
  ])
  .directive( 'dbpFungiSpeciesList', [
    'dbpediaSvc',
    '$timeout',
    function(
      dbpedia,
      $timeout ){
      return {
        scope: true,
        template: [
          
          '<div class="container">',
            '<div ng-repeat="item in ::list()">',
              '<div dbp-fungi-item></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          scope.list = function(){
            return _.filter( dbpedia.fungi.result, function( item ){
              return item.genus == scope.genus
            })
          }
          $timeout( function(){
            new Masonry( $( '.container', elem ).get(0), {
              itemSelector: '.masonry-brick',
              columnWidth: 300
            })
          })
        }
      }
    }
  ])
  .directive( 'dbpFungiItem', [
    '$location',
    function( $location ){
      return {
        scope: true,
        replace: true,
        template: [
          
          '<div style="width:300px;padding:10px" class="masonry-brick">',
            
            // link
            
            '<a href="{{ ::url( item.name ) }}" ng-if="!!item.count">',
              '<div style="clear:both">',
                '<h2 style="display:inline-block">{{ ::item.name }}</h2>',
                '<span>{{ ::item.count }}</span>',
              '</div>',
              '<img ng-src="{{ ::item.img }}" style="width:100%" />',
            '</a>',
            
            // no link
            
            '<div ng-if="!item.count">',
              '<h2>{{ ::item.name }}</h2>',
              '<img ng-src="{{ ::item.img }}" style="width:100%" />',
            '</div>',
            
            // comment
            
            // '<more-text max-lines="10">{{ ::item.comment }}</more-text>',
            '<div>{{ ::item.comment }}</div>',
            
            // species list
            
            '<ul ng-if="!!item.count">',
              '<li ng-repeat="species in ::item.species">',
                '{{ ::species.name }}',
              '</li>',
            '</ul>',
            
          '</div>'
          
        ].join(' '),
        link: function( scope ){
          scope.url = function( name ){
            return $location.absUrl() + '/' + name
          }
        }
      }
    }
  ])
  .directive( 'dbpFungiGenusList', [
    'dbpediaSvc',
    '$timeout',
    function(
      dbpedia,
      $timeout ){
      return {
        scope: {},
        template: [
          
          '<div ng-if="!!dbpedia.fungi.genus"',
               'class="container">',
            '<div ng-repeat="item in dbpedia.fungi.genus">',
              '<div dbp-fungi-item></div>',
            '</div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          dbpedia.fungi.http().then( function(){
            $timeout( function(){
              new Masonry( $( '.container', elem ).get(0), {
                itemSelector: '.masonry-brick',
                columnWidth: 300
              })
            })
          })
          scope.dbpedia = dbpedia
        }
      }
    }
  ])
  .directive( 'moreText', [
    '$timeout',
    '$compile',
    function(
      $timeout,
      $compile ){
      return {
        restrict: 'E',
        scope: {
          'maxLines': '@'
        },
        link: function( scope, elem ){
          var lineHeight, lines = null
          $timeout( function(){
            scope.text = elem.text()
            
            // get line height
            
            elem.html( '1<br/>2<br/>3<br/>4<br/>5' )
            lineHeight = elem.height() / 5
            
            // get the number of lines
            
            elem.html( scope.text )
            lines = Math.floor( elem.height()/lineHeight )
            if ( lines/scope.maxLines > 1 ){
              
              // split into two
              
              text = scope.text.split(' ')
              text2 = _.take( text, Math.floor( text.length * 1-scope.maxLines/lines ))
              
              scope.text = text.join(' ')
              scope.text2 = text2.join(' ')
              scope.open = false
              elem.html( $compile([
                
                '<div>',
                  
                  // text
                  
                  '{{ ::text }}',
                  '<span ng-if="!!open">{{ ::text2 }}</span>',
                  
                  // more or less
                  
                  '<a ng-click="open=!open">',
                    '<span ng-if="!open">more &#9660;</span>',
                    '<span ng-if="!!open">&#9650; less</span>',
                  '</a>',
                  
                '</div>'
                
              ].join(' '))( scope ))
            }
            
          })
        }
      }
    }
  ])
})