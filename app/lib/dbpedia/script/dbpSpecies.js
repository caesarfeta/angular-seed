define([
'../module',
'Masonry'
], 
function(
  module,
  Masonry ){
  module
  .directive( 'pediaShoutout', [
    function(){
      return {
        replace: true,
        template: [
          
          '<div class="pedia-shoutout">Please consider contributing to the <a href="http://wiki.dbpedia.org/about">DBpedia</a> project to keep this app and others like it alive!</div>'
          
        ].join(' ')
      }
    }
  ])
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
                 'ng-repeat="species in dbpedia.img.paginator.items()">',
              
              // title
              
              '<h2 class="name" ng-bind-html="species.name.value | highlight:dbpedia.img.search"></h2>',
              
              // img
              
              '<a href="{{ species.img.value}}"><img ng-src="{{ species.img.value }}"/></a>',
              
              // taxonomy
              
              '<table class="taxonomy">',
                '<tr><td>Kingdom</td><td>{{ species.kingdom.value | shrinkLink }}</td></tr>',
                '<tr><td>Phylum</td><td>{{ species.phylum.value | shrinkLink }}</td></tr>',
                '<tr><td>Class</td><td>{{ species.class.value | shrinkLink }}</td></tr>',
                '<tr><td>Order</td><td>{{ species.order.value | shrinkLink }}</td></tr>',
                '<tr><td>Family</td><td>{{ species.family.value | shrinkLink }}</td></tr>',
                '<tr><td>Genus</td><td>{{ species.genus.value | shrinkLink }}</td></tr>',
                '<tr><td>Species</td><td>{{ species.species.value | shrinkLink }}</td></tr>',
              '</table>',
              
              // abstract
              
              '<div class="abstract" ng-bind-html="species.abstract.value | highlight:dbpedia.img.search"></div>',
              '<div class="clearfix"></div>',
              
              // wikipedia link
              
              '<a class="fa fa-external-link wiki-link"',
                 'href="{{ species.url.value }}"',
                 'title="{{ species.url.value }}">',
              '</a>',
              
            '</div>',
            
            // paginator
            
            '<div paginator="dbpedia.img.paginator"></div>',
            
            // shoutout
            
            '<div pedia-shoutout></div>',
            
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
})