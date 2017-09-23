define([
'angular'
], 
function( angular ){
  angular.module( 'texturizer', [])
  .directive( 'texturizerStarter', [
    function(){
      return {
        scope: true,
        template: [
          
          '<div class="btn-group" uib-dropdown>',
            
            // button
            
            '<button id="single-button"',
                    'type="button"',
                    'class="btn btn-sm"',
                    'uib-dropdown-toggle>',
              'starter <span class="caret"></span>',
            '</button>',
            
            // menu
            
            '<ul class="dropdown-menu" uib-dropdown-menu role="menu">',
              '<li role="menuitem">',
                '<a href="" ng-click="change( \'livingHinge\' )">living hinge</a>',
              '</li>',
            '</ul>',
          '</div>',
          
        ].join(''),
        link: function( scope ){
          var config = {
            "livingHinge": { "json": "mainline" }
          }
          scope.change = function( id ){
            scope.config.json = JSON.stringify( config[ id ], ' ', 2 )
          }
        }
      }
    }
  ])
  .directive( 'texturizerCtrl', [
    function(){
      return {
        scope: true,
        template: [
          
          '<textarea ng-enter="update()"',
                    'ng-model="config.json">',
          '</textarea>'
          
        ].join(' '),
        link: function( scope ){
          scope.update = function(){
            console.log( 'update' )
          }
        }
      }
    }
  ])
  .directive( 'texturizerSvg', [
    function(){
      return {
        scope: true,
        template: [
          
          '<svg width="1000" height="1000">',
              '<line x1="-1" y1="90.30110189154914" x2="0" y2="90.10641753376618" style="stroke:black;stroke-width:1"></line><line x1="0" y1="90.10641753376618" x2="1" y2="90.01058658160228" style="stroke:black;stroke-width:1"></line><line x1="1" y1="90.01058658160228" x2="2" y2="90.01456654625395" style="stroke:black;stroke-width:1"></line><line x1="2" y1="90.01456654625395" x2="3" y2="90.11831766123" style="stroke:black;stroke-width:1"></line><line x1="3" y1="90.11831766123" x2="4" y2="90.32080327968514" style="stroke:black;stroke-width:1"></line><line x1="4" y1="90.32080327968514" x2="5" y2="90.62000023225261" style="stroke:black;stroke-width:1"></line><line x1="5" y1="90.62000023225261" x2="6" y2="91.01291904188373" style="stroke:black;stroke-width:1"></line><line x1="6" y1="91.01291904188373" x2="7" y2="91.49563379371435" style="stroke:black;stroke-width:1"></line><line x1="7" y1="91.49563379371435" x2="8" y2="92.06332136150847" style="stroke:black;stroke-width:1"></line><line x1="8" y1="92.06332136150847" x2="9" y2="92.71030959874123" style="stroke:black;stroke-width:1"></line><line x1="9" y1="92.71030959874123" x2="10" y2="93.4301340128121" style="stroke:black;stroke-width:1"></line><line x1="10" y1="93.4301340128121" x2="11" y2="94.215602356118" style="stroke:black;stroke-width:1"></line><line x1="11" y1="94.215602356118" x2="12" y2="95.05886648861392" style="stroke:black;stroke-width:1"></line><line x1="12" y1="95.05886648861392" x2="13" y2="95.95150079383401" style="stroke:black;stroke-width:1"></line><line x1="13" y1="95.95150079383401" x2="14" y2="96.88458636486621" style="stroke:black;stroke-width:1"></line><line x1="14" y1="96.88458636486621" x2="15" y2="97.84880011912185" style="stroke:black;stroke-width:1"></line><line x1="15" y1="97.84880011912185" x2="16" y2="98.83450795149507" style="stroke:black;stroke-width:1"></line><line x1="16" y1="98.83450795149507" x2="17" y2="99.83186099515649" style="stroke:black;stroke-width:1"></line>',
          '</svg>'
          
        ].join(''),
        link: function( scope ){
          scope.$watch(
            function(){ return scope.config.json },
            function(){
              console.log( 'do something' )
            }
          )
        }
      }
    }
  ])
  .directive( 'texturizer', [
    function(){
      return {
        scope: true,
        template: [
          
          '<div class="texturizer">',
            '<div texturizer-starter></div>',
            '<div texturizer-ctrl></div>',
            '<div texturizer-svg></div>',
          '</div>'
          
        ].join(''),
        link: function( scope ){
          scope.config = {
            json: null
          }
        }
      }
    }
  ])
})