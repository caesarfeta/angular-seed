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
          '<audio controls id="myAudio" autoplay></audio>',
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
          
          var fps = 16
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
            var cTime = getTimeCode( $audio.currentTime )
            if ( !window.loopSave[ cTime ] ){
              window.loopSave[ cTime ] = []
            }
            window.loopSave[ cTime ].push([ keyCode, isOn ])
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
              }
              
              // play and pause audio with SPACE
              
              if ( !!$audio && e.keyCode == 32 ){
                ( $audio.paused ) ? $audio.play() : $audio.pause()
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
                
                // initial audio config and events
                
                $audio.onloadstart = function( e ){
                  $audio.pause()
                }
                var lastCode = 0.0
                $audio.ontimeupdate = function( e ){
                  var now = getTimeCode( $audio.currentTime )
                  while ( lastCode <= now ){
                    lastCode += ( 1 / fps ).toFixed( 4 )
                    var loop = window.loopSave[ lastCode ]
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