define([
'angular',
'lodash',
'../utils/utils'
],
function(
  angular,
  _,
  utils ){
  
  /*
    
    SHIFT+CMD+F for full screen mode
    Used for transparent .png animation
    
  */
  
  angular.module( 'animpng', [ 'angularFileUpload' ])
  .directive( 'animpng', [
    function(){
      return {
        scope: true,
        template: [
          
          '<style>.animpng img { width: 800px; height: 400px; position: absolute }</style>',
          
          '<input ',
            'type="file" ',
            'webkitdirectory ',
            'mozdirectory ',
            'nv-file-select ',
            'uploader="uploader" />',
          
          '<div class="animpng">',
            '<img src="/app/lib/animpng/test/test00.png" />',
            '<img src="/app/lib/animpng/test/test01.png" />',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem, ){
          scope.uploader.onAfterAddingFile = function( fileItem ){
            console.info( fileItem )
          }
        }
      }
    }
  ])
})