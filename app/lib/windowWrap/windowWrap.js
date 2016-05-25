define([
'angular',
'jquery',
'jqueryUi'
], 
function( 
    angular, 
    $ ){

    angular.module('windowWrap',[ 'atCommon' ])

    .factory( 'windowItem', [
        'windowHub',
        function( windowHub ){
            var windowItem = function( id ){
                this.isOn = false;
                windowHub.register( id, this );
            };
            windowItem.prototype.toggle = function(){ 
                this.isOn = !this.isOn 
            };
            windowItem.prototype.turnOn = function(){ 
                this.isOn = true 
            };
            windowItem.prototype.turnOff = function(){ 
                this.isOn = false 
            };
            windowItem.prototype.location = function(){};
            return windowItem;
        }
    ])

    .service( 'windowHub', [
        function(){
            var self = this;
            self.items = {};
            self.error = {
                exists: function( id ){ 
                    return 'Window already exists with id='+id 
                }
            }
            self.register = function( id, item ){
                if ( id in self.items ){
                    throw self.error.exists( id )
                }
                self.items[ id ] = item;
            }
            self.get = function( id ){
                return self.items[ id ]
            }
        }
    ])

    .directive( 'windowWrap', [
        'windowItem',
        function( windowItem ){
            
            /*
            
                <div window-wrap="{ 
                    id: 'test',
                    width: '400px'
                }">
                    Content
                </div>
            
            */
            
            return {
                scope: {
                    windowWrap: '='
                },
                transclude: true,
                replace: true,
                template: [
                    
                    '<div ng-style="css()" class="window-wrap">',
                        '<div ng-if="item.isOn" class="item">',
                            '<div class="controls">',
                                '<button ng-click="item.toggle()">x</button>',
                            '<div>',
                            '<div class="content">',
                                '<ng-transclude></ng-transclude>',
                            '</div>',
                        '</div>',
                    '</div>'
                    
                ].join(' '),
                link: function( scope, elem ){

                    // get a window item

                    scope.item = new windowItem( scope.windowWrap.id );

                    // set width

                    scope.css = function(){
                        return {
                            width: scope.windowWrap.width
                        }
                    }; 

                    // draggable

                    $( elem ).draggable({
                        stack: '.window-wrap'
                    });
                }
            }
        }
    ])
});