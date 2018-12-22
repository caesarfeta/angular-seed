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
          
          // showing and hiding layers
          
          function getMe( e ){
            return _.find( items, function( o ){
              return o.key == e.key.toUpperCase()
            })
          }
          $( 'html' ).keydown( function( e ){
            var me = getMe( e )
            $( me.canvas ).css({ 'top': 0 })
          })
          $( 'html' ).keyup( function( e ){
            var me = getMe( e )
            $( me.canvas ).css({ 'top': me.height * -1 })
          })
          
          // loading files
          
          function onLoadFile( e ){
            var self = this
            var me = _.find( items, function( o ){ 
              return o.reader === self 
            })
            me.src = e.target.result
            var img = new Image()
            img.onload = onLoadImage
            img.src = e.target.result
          }
          function onLoadImage( e ) {
            var me = _.find( items, function( o ){
              return o.src === e.path[0].currentSrc
            })
            me.canvas = document.createElement( 'canvas' )
            me.height = this.height
            $( elem ).append( me.canvas )
            $( me.canvas ).attr({
              width: this.width,
              height: this.height
            })
            if ( me.key == '_bg' ){
              $( me.canvas ).css( 'z-index', 0 )
            }
            else {
              $( me.canvas ).css({ 'z-index': 1, 'top': this.height * -1 })
            }
            me.canvas.getContext('2d').drawImage( this, 0, 0, this.width, this.height )
          }
          
          var items = []
          scope.uploader.onAfterAddingFile = function( item ){
            
            // remove everything visible but the canvases
            
            $( 'input', elem ).remove()
            $( 'body .menu').remove()
            
            // read the file
            
            var reader = new FileReader()
            reader.onload = onLoadFile
            items.push({
              key: item.file.name.substring( 0, item.file.name.length - 4 ),
              reader: reader
            })
            reader.readAsDataURL( item._file )
          }
        }
      }
    }
  ])
})