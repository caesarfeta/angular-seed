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
          
          '<input ',
            'type="file" ',
            'webkitdirectory ',
            'mozdirectory ',
            'nv-file-select ',
            'uploader="uploader" />',
          
        ].join(' '),
        link: function( scope, elem ){
          $( elem ).addClass( 'animpng' )
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
            console.log( keyToFile[ e.key.toUpperCase() ] )
          })
          
          var fileQ = []
          var reader = new FileReader()
          reader.onload = onLoadFile
          function onLoadFile( e ){
            console.log( e.target.result )
            var img = new Image()
            img.onload = onLoadImage
            img.src = e.target.result
          }
          function onLoadImage( e ) {
            var canvas = document.createElement( 'canvas' )
            $( elem ).append( canvas )
            $( canvas ).attr({
              width: this.width,
              height: this.height
            })
            console.info( this, e )
            canvas.getContext('2d').drawImage( this, 0, 0, this.width, this.height )
            
            // check the queue
            
            if ( fileQ.length != 0 ){
              reader.readAsDataURL( fileQ.shift() )
            }
            else {
              
              // remove everything visible but the canvases
              
              $( 'input', elem ).remove()
              $( 'body .menu').remove()
            }
          }
          
          scope.uploader.onAfterAddingFile = function( item ){
            var key = item.file.name.substring( 0, item.file.name.length - 4 )
            if ( key != '_bg' ){
              keyToFile[ key ] = item._file
            }
            
            // load image
            
            try {
              reader.readAsDataURL( item._file )
            }
            catch ( e ){
              fileQ.unshift( item._file )
            }
          }
        }
      }
    }
  ])
})