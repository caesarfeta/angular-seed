define([
'angular',
'jquery',
'lodash',
'color-thief',
'lib/alert/atAlert',
'tinycolor'
], 
function( 
    angular, 
    $,
    _,
    colorThief ){

    angular.module( 'atColor', [ 'atAlert' ] )

    // color conversion functions

    .service( 'colorTo', [
        function(){
            this.hex = function( rgb ){
                return "#" +
                ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2)
            };
        }
    ])
    
    .directive( 'colorSwatch',[
        function(){
            return {
                scope: {
                    colorSwatch: '='
                },
                template: '<span ng-style="style()"></span>',
                link: function( scope, elem ){
                    scope.style = function(){
                        return {
                            display: 'inline-block',
                            width: '25px',
                            height: '25px',
                            'background-color': scope.colorSwatch
                        }
                    }
                }
            }
        }
    ])
    
    .service( 'mutators',[
        function(){
            return {
                
                // green stripes
                
                greenStripe: {
                    run: function( rgba, tick ){
                        return rgba.map( function( c, i ){
                            return ( i % 4 )
                                ?[ c[2], c[3], c[1], c[3] ]
                                :c
                        })
                    },
                    loop: .025
                }
            }
        }
    ])

    .factory( 'imgMutator', [
        function(){
            var imgMutator = function( config ){
                var self = this;
                self.image = new Image();
                self.canvas = config.canvas;
                self.url = config.url;
                self.mutator = config.mutator;
                self.imgData = null;
                self.ctx = null;
                self.image.crossOrigin = "anonymous";
                self.image.onload = function(){
                    self.canvas.setAttribute( 'width', self.image.width );
                    self.canvas.setAttribute( 'height', self.image.height );
                    self.ctx = self.canvas.getContext("2d");
                    self.ctx.drawImage( self.image, 0, 0 );
                    self.imgData = self.ctx.getImageData( 0, 0, self.canvas.width, self.canvas.height );
                    self.draw();
                    self.loop();
                }
                self.image.onerror = function( r ){
                    config.onError( r )
                }
                self.image.src = "http://localhost:5000/" + self.url;
            }

            imgMutator.prototype.draw = function(){
                var self = this;
                self.imgData.data.set( self.filter() );
                self.ctx.putImageData( self.imgData, 0, 0 );
            }

            imgMutator.prototype.filter = function( tick ){
                var self = this;
                tick = ( tick == undefined ) ? 0 : tick;
                return _.flatten(
                    
                    // pass colors to mutator as array of rgba arrays
                    
                    self.mutator.run(
                        _.chunk( self.imgData.data, 4 ), 
                        tick 
                    )
                );
            }

            imgMutator.prototype.loop = function(){
                var self = this;
                if ( 'loop' in self.mutator ){
                    var i = 0;
                    self.running = setInterval( 
                        function(){ self.draw( i ) }, 
                        self.mutator.loop*1000 
                    )
                }
            }

            imgMutator.prototype.stop = function(){
                var self = this;
                clearInterval( self.running );
            }

            return imgMutator
        }
    ])

    .directive( 'imgMutateLive',[
        'imgMutator',
        function( imgMutator ){
            return {
                scope: {
                    imgMutateLive: '=',
                },
                replace: true,
                template: [

                        '<div class="img-mutate-live">',
                            '<canvas></canvas>',
                            '<textarea rows="10" ng-model="input.code" ng-enter="reset()"></textarea>',
                        '</div>'

                ].join(' '),
                link: function( scope, elem ){

                    scope.input = {
                        code: 'return rgba.map( function( c ){ return [ c[1], c[2], c[3], c[0] ] })'
                    };

                    scope.mutator = null;
                    scope.reset = function(){
                        scope.mutator = new imgMutator({
                            canvas: $( 'canvas', elem ).get(0), 
                            url: scope.imgMutateLive.url, 
                            mutator: {
                                run: new Function( 'rgba', 'tick', scope.input.code )
                            },
                            onError: scope.imgMutateLive.onError 
                        });
                    }

                    //scope.reset();
                }
            }
        }
    ])

    .directive( 'imgMutate',[
        'imgMutator',
        function( imgMutator ){
            return {
                scope: {
                    imgMutate: '=',
                },
                replace: true,
                template: [
                        
                        '<canvas></canvas>',
                        
                ].join(' '),
                link: function( scope, elem ){
                    scope.mutator = new imgMutator({
                        canvas: elem.get(0), 
                        url: scope.imgMutate.url, 
                        mutator: scope.imgMutate.mutator, 
                        onError: scope.imgMutate.onError 
                    });
                }
            }
        }
    ])


    // build a strip of color swatches from a source image
    
    .directive( 'swatchStrip', [
        
        '$http',
        'colorTo',
        'spinSvc',
        '$timeout',
        
        function( 
            $http,
            colorTo,
            spinSvc,
            $timeout ){
            
            return {
                scope: {
                    swatchStrip: '@'
                },
                template:[
                    
                    '<span>',
                        '<spinner spin-id="swatch-strip"></spinner>',
                        '<span ng-if="error">{{ error }}</span>',
                        '<span ng-if="palette" ng-repeat="color in palette" color-swatch="color"></span>',
                    '</span>'
                    
                ].join(' '),
                link: function( scope, elem ){
                    
                    var spinner = spinSvc.register( "swatch-strip" );
                    spinner.on();
                    
                    function refresh(){ $timeout( function(){} )};
                    
                    // get a color thief instance
                    
                    var c = colorThief();
                    var thief = new c.ColorThief();
                    
                    // build the palette once the image is loaded
                    
                    scope.palette = null;
                    var image = new Image();
                    image.crossOrigin = "anonymous";
                    image.onload = function(){
                        
                        spinner.off();
                            
                        try { scope.palette = thief.getPalette( this, 10, 5 ) }
                        catch( e ){ 
                            scope.error = 'error retrieving palette';
                            refresh();
                            return
                        }
                        
                        scope.palette.map( function( color ){
                            return colorTo.hex( color );
                        });
                        refresh();
                    }
                    image.src = "http://localhost:5000/" + scope.swatchStrip;
                }
            }
        }
    ])
});