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
          
          '<div>',
            '<audio id="myAudio" autoplay></audio>',
            '<input ',
              'type="file" ',
              'webkitdirectory ',
              'mozdirectory ',
              'nv-file-select ',
              'uploader="uploader" />',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          $( elem ).addClass( 'animpng' )
          window.save = []
          
          // show and hide layers
          
          function show( me ){
            $( me.canvas ).css({ 
              'top': 0 
            })
          }
          function hide( me ){
            $( me.canvas ).css({ 
              'top': me.height * -1 
            })
          }
          function getMe( key ){
            return _.find( items, function( o ){
              return o.key == key.toUpperCase()
            })
          }
          
          // register key presses
          
          function register( key, downpress ){
            
            // if audio isn't playing don't bother
            
            try{
              if ( $audio.paused() ){
                console.log( 'get outta hea!' )
                return
              }
            } catch {}
            
            // save alpha key presses
            
            key = key.toUpperCase()
            if ( !key.match( /[A-Z]/ )){
              return
            }
            try {
              
              // save current
              
              window.save.push([ $audio.currentTime, key, downpress ])
            }
            catch( e ) {
              console.log( 'not a valid layer key', e )
            }
          }
          var firstPress = false
          window.addEventListener( 'keydown',
            function( e ){
              
              // play and pause audio with 'SPACE'
              
              if ( !!$audio && e.keyCode == 32 ){
                if ( $audio.paused ){
                  $audio.play()
                }
                else {
                  $audio.pause()
                }
              }
              register( e.key, true )
              var me = getMe( e.key )
              if ( !!me ){
                show( me )
              }
            },
          false )
          window.addEventListener( 'keyup',
            function( e ){
              register( e.key, false )
              var me = getMe( e.key )
              if ( !!me ){
                hide( me )
              }
            },
            false
          )
          
          // load folder contents
          
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
          var conf = { file: 'config.json', json: {}}
          var $audio = undefined
          var audioPass = 0
          scope.uploader.onAfterAddingFile = function( item ){
            
            // configure file
            
            if ( item.file.name == conf.file ){
              var reader = new FileReader()
              reader.onload = ( function( e ){
                conf.json = JSON.parse( e.target.result )
              })
              reader.readAsText( item._file )
              return
            }
            
            // audio file
            
            if ( item.file.name == 'audio.mp3' ){
              $audio = $( '#myAudio' )
              var reader = new FileReader()
              reader.onload = function( e ){
                $audio.attr( 'src', e.target.result )
                $audio = document.getElementById( 'myAudio' )
                $audio.onloadstart = function( e ){
                  $audio.pause()
                }
                $audio.ended = function( e ){
                  audioPass++
                }
                
                // time change handler
                
                $audio.ontimeupdate = function( e ){
                  console.log( $audio.currentTime, audioPass )
                }
              }
              reader.readAsDataURL( item._file )
            }
            
            // remove everything visible but the canvases
            
            $( 'input', elem ).remove()
            $( 'body .menu').remove()
            
            // .png file handling
            
            if ( item.file.name.substr( item.file.name.length - 3  ) == "png"
                 && !!_.first( item.file.name ).match( /[A-Z]/ )
                 || item.file.name == "_bg.png" ){
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
    }
  ])
})