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
            '<div id="timeGrid"></div>',
            '<audio id="myAudio" autoplay></audio>',
            '<input ',
              'type="file" ',
              'webkitdirectory ',
              'mozdirectory ',
              'nv-file-select ',
              'uploader="uploader" />',
            '<div id="clock"></div>',
          '</div>'
          
        ].join(' '),
        link: function( scope, elem ){
          $( elem ).addClass( 'animpng' )
          var fps = 12
          window.save = []
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
          function getNth( n ){
            return ( n*1/fps ).toFixed( 3 )
          }
          
          // build the frame grid
          
          var nFrames = undefined
          var padding = 25
          function buildGrid( duration ){
            nFrames = Math.ceil( duration * fps )
            _.remove( items, function( item ){
              return item.key == '_bg'
            })
            for ( var i=0; i<items.length; i++ ){
              
              // row label
              
              var div = document.createElement( 'div' )
              $( div ).addClass( 'row_label' )
              $( div ).text( items[i].key )
              $( div ).css({
                top: i * 20 + padding - 3,
                left: 5
              })
              $( '#timeGrid', elem ).append( div )
              
              // frames
              
              for ( var j=0; j<nFrames; j++ ){
                var div = document.createElement( 'div' )
                $( div ).addClass( 'frame' )
                $( div ).css({
                  top: i * 20 + padding,
                  left: j * 20 + padding * 1.5 
                })
                $( div ).attr( 'id', items[i].key + j )
                $( '#timeGrid', elem ).append( div )
              }
            }
            
            // grid frame mouse controls
            
            $( '.frame', elem ).mousedown( function( e ){
              frameToggle( e )
              $( '.frame', elem ).mouseenter( function( e ){
                frameToggle( e )
              })
              $( window ).mouseup( function(){
                $( '.frame', elem ).off( 'mouseenter' )
              })
            })
          }
          
          function frameToggle( e ){
            var frame = $( e.target ).attr( 'id')
            var key = _.first( frame )
            frame = frame.substr( 1 )
            
            console.log( key, frame )
          }
          
          // color the grid
          
          window.colorGrid = function(){
            for ( var j=0; j<nFrames; j++ ){
              var keys = window.save[ j ]
              if ( !!keys && !!keys.length ){
                _.each( keys, function( key ){
                  var uid = '#' + key + j
                  try {
                    $( uid, elem ).css(
                      'background-color', 'blue'
                    )
                  }
                  catch{
                    console.log( 'lil error', key )
                  }
                })
              }
            }
          }
          function getMe( key ){
            return _.find( items, function( o ){
              return o.key == key.toUpperCase()
            })
          }
          function getFrame( n ){
            return Math.round(( ( n % 1 ).toFixed( 3 ) * fps-1 ) + 1 ) / fps
          }
          function getSeconds( n ){
            return Math.floor( n )
          }
          function getTimeCode( n ){
            return getSeconds( n ) + getFrame( n )
          }
          function timeToIndex( t, dur ){
            return Math.ceil( Math.ceil( dur * fps ) * t / dur )
          }
          function register( key ){
            
            // if audio isn't playing don't bother
            
            try {
              if ( $audio.played.end( 0 ) == $audio.duration ){
                return
              }
            }
            catch{}
            
            // only alpha keys
            
            if ( !key.match( /[a-zA-Z]/ )){
              return
            }
            
            // register code
            
            try {
              var t = getTimeCode( $audio.currentTime ).toFixed( 3 )
              var i = timeToIndex( t, $audio.duration )
              if ( !window.save[ i ] ){
                window.save[ i ] = []
              }
              window.save[ i ].push( key.toUpperCase() )
            }
            catch {
              console.log( 'key registration error' )
            }
          }
          var firstPress = false
          var gridBuilt = false
          window.addEventListener( 'keydown',
            function( e ){
              if ( !firstPress ){
                _.each( conf.json.startOn, function( id ){
                  var me = getMe( id )
                  show( me )
                })
                firstPress = true
              }
              
              // play and pause audio with SPACE
              
              if ( !!$audio && e.keyCode == 32 ){
                if ( $audio.paused ){
                  $audio.play()
                }
                else {
                  $audio.pause()
                  window.colorGrid()
                }
              }
              
              // tab toggles grid
              
              if ( e.keyCode == '9' ){
                if ( !gridBuilt ){
                  buildGrid( $audio.duration )
                }
                
                // toggle
                
              }
              
              // single mode
              
              var me = getMe( e.key )
              if ( !!me ){
                show( me )
              }
              
              // store keypresses
              
              register( e.key )
            },
          false )
          window.addEventListener( 'keyup',
            function( e ){
              var me = getMe( e.key )
              if ( !!me ){
                hide( me )
              }
            },
            false
          )
          
          /* FILE LOADING */
          
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
          var uploadTimes = 0
          scope.uploader.onAfterAddingFile = function( item ){
            uploadTimes++
            console.log( scope.uploader.queue.length, uploadTimes )
            
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
                
                // time change handler
                
                var last = 0
                $audio.ontimeupdate = function( e ){
                  var t = getTimeCode( $audio.currentTime ).toFixed( 3 )
                  var now = timeToIndex( t, $audio.duration )
                  $( '#clock', elem ).text( t )
                  
                  // Check da loop!
                  var i = last + 1
                  while ( i <= now ){
                    var pFrame = window.save[ i-1 ]
                    var cFrame = window.save[ i ]
                    // var diff = _.pullAll( cFrame, pFrame )
                    console.log( i, i-1, cFrame, pFrame )
                    i++
                  }
                  if ( $audio.currentTime == $audio.duration ){
                    last = 0
                    window.colorGrid()
                  }
                  else {
                    last = now
                  }
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