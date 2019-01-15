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
          var keys = []
          var charKeys = []
          window.loopSave = {}
          
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
          function buildFrameGrid( duration ){
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
                $( div ).attr( 'id', items[i].key + getNth( j ))
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
              var tcode = getNth( j )
              var item = window.loopSave[ tcode ]
              if ( !!item ){
                _.each( item, function( key ){
                  var keyname = charKeys[ key[0] ]
                  if ( key[1]  && keyname){
                    var uid = '#' + keyname.toUpperCase() + tcode.replace( '.', '\\.' )
                    try {
                      $( uid, elem ).css(
                        'background-color', 'blue'
                      )
                    }
                    catch{
                      console.log( 'lil error', item )
                    }
                  }
                })
              }
            }
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
          function register( keyCode, isOn ){
            try {
              var cTime = getTimeCode( $audio.currentTime ).toFixed( 3 )
              if ( !window.loopSave[ cTime ] ){
                window.loopSave[ cTime ] = []
              }
              window.loopSave[ cTime ].push([ keyCode, isOn ])
            }
            catch {
              console.log( 'key registration error' )
            }
          }
          var firstPress = false
          window.addEventListener( 'keydown',
            function( e ){
              if ( !firstPress ){
                _.each( conf.json.startOn, function( id ){
                  var me = getMe({ key: id })
                  show( me )
                })
                firstPress = true
                
                // build the frame grid
                
                buildFrameGrid( $audio.duration )
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
              
              // handle weird keycodes which could fuck-up the EXPERIENCE, man
              
              if ( e.keyCode == '91' ){
                throw e
              }
              charKeys[ e.keyCode ] = e.key
              keys[ e.keyCode ] = e.keyCode
              
              // single mode
              
              var me = getMe( e )
              if ( !!me ){
                show( me )
              }
              
              // audio and grid schtuff
              
              window.$audio = $audio
              
              // store keypresses for looping with aliasing.
              
              register( e.keyCode, true )
            },
          false )
          window.addEventListener( 'keyup',
            function( e ){
              register( e.keyCode, false )
              
              // single mode
              
              keys[ e.keyCode ] = false
              
              var me = getMe( e )
              if ( !!me ){
                hide( me )
              }
            },
            false
          )
          function getNumberArray( arr ){
            var newArr = new Array()
            for( var i = 0; i < arr.length; i++ ){
              if ( typeof arr[ i ] == "number" ){
                newArr[ newArr.length ] = arr[ i ]
              }
            }
            return newArr
          }
          
          // showing and hiding layers
          
          function getMe( e ){
            return _.find( items, function( o ){
              return o.key == e.key.toUpperCase()
            })
          }
          
          function getMeNum( n ){
            return getMe({ key: charKeys[ n ] })
          }
          
          function getSibs( e ){
            return _.filter( items, function( o ){
              return o.key[0] == e.key[0] && o.key != e.key
            })
          }
          
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
          window.$audio = $audio
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
                
                var lastCode = 0.0
                $audio.ontimeupdate = function( e ){
                  var now = getTimeCode( $audio.currentTime )
                  while ( lastCode <= now ){
                    $( '#clock', elem ).text( lastCode.toFixed( 3 ) )
                    
                    // Check da loop!
                    
                    lastCode += parseFloat(( 1 / fps ))
                    var loop = window.loopSave[ lastCode.toFixed( 3 ) ]
                    if ( !!loop ){
                      _.each( loop, function( keyCode ){
                        var me = getMeNum( keyCode[0] )
                        if ( !!me ){
                          ( keyCode[1] ) ? show( me ) : hide( me )
                        }
                      })
                    }
                  }
                  
                  // loop check
                  
                  if ( $audio.currentTime == $audio.duration ){
                    lastCode = 0.0
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