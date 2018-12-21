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
          
          /*
          '<div class="animpng">',
            '<img src="/app/lib/animpng/test/test00.png" />',
            '<img src="/app/lib/animpng/test/test01.png" />',
          '</div>'
          */
          
        ].join(' '),
        link: function( scope, elem, ){
          
          var lkup = {
            'A': 65,
            'B': 66,
            'C': 67,
            'D': 68,
            'E': 69,
            'F': 70,
            'G': 71,
            'H': 72,
            'I': 73,
            'J': 74,
            'K': 75,
            'L': 76,
            'M': 77,
            'N': 78,
            'O': 79,
            'P': 80,
            'Q': 81,
            'R': 82,
            'S': 83,
            'T': 84,
            'U': 85,
            'V': 86,
            'W': 87,
            'X': 88,
            'Y': 89,
            'Z': 90
          }
          
          var keyToFile = {}
          $( 'html' ).keydown(function( e ){
            console.log( e, keyToFile )
          })
          
          var reader = new FileReader()
          reader.onload = onLoadFile
          
          function onLoadFile( e ){
            var img = new Image()
            img.onload = onLoadImage
            img.src = e.target.result
          }
          
          function onLoadImage() {
            console.log( this )
            /*
              var width = params.width || this.width / this.height * params.height;
              var height = params.height || this.height / this.width * params.width;
              canvas.attr({ width: width, height: height });
              canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            */
          }
          
          scope.uploader.onAfterAddingFile = function( item ){
            
            var key = item.file.name.substring( 0, item.file.name.length - 4 )
            
            // put background in place
            
            if ( key == '_bg' ){
              console.log( 'background' )
              return
            }
            
            // map image to keypress
            
            keyToFile[ key ] = item
//            console.log( item )
            reader.readAsDataURL( item._file )
          }
        }
      }
    }
  ])
})