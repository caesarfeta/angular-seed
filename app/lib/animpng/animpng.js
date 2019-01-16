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
              frameToggle( e, true )
              $( '.frame', elem ).mouseenter( function( e ){
                frameToggle( e, false )
              })
              $( window ).mouseup( function(){
                $( '.frame', elem ).off( 'mouseenter' )
              })
            })
          }
          
          var clear = false
          function frameToggle( e, click ){
            var frame = $( e.target ).attr( 'id' )
            var key = _.first( frame )
            frame = frame.substr( 1 )
            if ( click ){
              clear = _.includes( window.save[ frame ], key )
            }
            if ( !clear ){
              if ( !window.save[ frame ] ){
                window.save[ frame ] = []
              }
              window.save[ frame ].push( key )
              $( e.target, elem ).css( 'background-color', 'blue' )
            }
            else {
              _.remove( window.save[ frame ], key )
              $( e.target, elem ).css( 'background-color', 'red' )
            }
          }
          
          // color the grid
          
          window.colorGrid = function(){
            for ( var j=0; j<nFrames; j++ ){
              var keys = window.save[ j ]
              if ( !!keys && !!keys.length ){
                _.each( keys, function( key ){
                  var uid = '#' + key + j
                  try {
                    $( uid, elem ).css( 'background-color', 'blue' )
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
          function register( key, backfill ){
            
            // if audio isn't playing don't bother
            
            try{
              if ( $audio.played.end( 0 ) == $audio.duration ){
                return
              }
            } catch {}
            
            // save alpha key presses
            
            key = key.toUpperCase()
            if ( !key.match( /[A-Z]/ )){
              return
            }
            try {
              
              // time to frame index
              
              var t = getTimeCode( $audio.currentTime ).toFixed( 3 )
              var i = timeToIndex( t, $audio.duration )
              
              // save current
              
              if ( !window.save[ i ] ){
                window.save[ i ] = []
              }
              window.save[ i ].push( key)
              
              // backfill
              
              if ( backfill ){
                i--
                while( i > 0 && !_.includes( window.save[ i ], key )){
                  if ( !window.save[ i ] ){
                    window.save[ i ] = []
                  }
                  window.save[ i ].push( key )
                  i--
                }
              }
            }
            catch( e ) {
              console.log( e )
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
              
              // play and pause audio with 'SPACE'
              
              if ( !!$audio && e.keyCode == 32 ){
                if ( $audio.paused ){
                  $audio.play()
                }
                else {
                  $audio.pause()
                  pressed = {}
                  window.colorGrid()
                }
              }
              
              // 1 key toggles grid
              
              if ( e.keyCode == '49' ){
                if ( !gridBuilt ){
                  buildGrid( $audio.duration )
                }
                
                // TODO toggle
                
              }
              
              // handle fresh press
              
              if ( !pressed[ e.key.toUpperCase() ] ){
                pressed[ e.key.toUpperCase() ] = true
                var me = getMe( e.key )
                if ( !!me ){
                  show( me )
                }
                register( e.key )
              }
            },
          false )
          var pressed = {}
          window.addEventListener( 'keyup',
            function( e ){
              pressed[ e.key.toUpperCase() ] = false
              register( e.key, true )
              var me = getMe( e.key )
              if ( !!me ){
                hide( me )
              }
            },
            false
          )
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
                
                // time change handler
                
                $audio.ontimeupdate = function( e ){
                  var t = getTimeCode( $audio.currentTime ).toFixed( 3 )
                  var now = timeToIndex( t, $audio.duration )
                  $( '#clock', elem ).text( t )
                  _.each( items, function( item ){
                    if ( _.includes( window.save[ now ], item.key )){
                      show( item )
                    }
                    else if ( item.key != '_bg' && !pressed[ item.key ] ){
                      hide( item )
                    }
                  })
                  if ( $audio.currentTime == $audio.duration ){
                    window.colorGrid()
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