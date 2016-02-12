/*

    // grab a progressBar bar instance

    var progressBar = require('lib/progress/progressBar');
    var p = new progressBar({
        elem: '#progressBar',
        barColor: 'orange',
        bgColor: 'gray',
        textColor: 'black',
        textShow: true
    });


    // set progressBar percentage ( 0 to 100 )

    p.set( 25 );


    // candy stripe animation

    p.startStripe();
    p.stopStripe();

*/
define([
'jquery'
],
function( $ ){

    var progressBar = function( config ){
        this.val = 0;
        this.dom = {};
        this.config = config;
        this.build();
        this.stripeBuilt = false;
    };

    // create the dom elements

    progressBar.prototype.build = function(){
        this.rootElem().append([

            '<span class="nd-progress">',
                '<span class="bar">',
                    '<span class="text"></span>',
                '</span>',
                '<span class="stripe"></span>',
            '</span>'

        ].join(''));
        this.css();
        this.startAnim();
        this.set( 0 );
    };

    progressBar.prototype.updateConfig = function( config ){
        $.extend( this.config, config );
    };

    progressBar.prototype.css = function( config ){
        this.updateConfig( config );
        this.rootElem().css({
            width: '100%',
            overflow: 'hidden',
            position: 'relative',  // contains stripe
            height: this.height() + 'px',
            'background-color': this.bgColor()
        });

        this.barElem().css({
            display: 'inline-block',
            height: '100%',
            'background-color': this.barColor(),
            'text-align': 'right'
        });

        this.textElem().css({
            color: this.textColor(),
            padding: '0 ' + this.height()/2 + 'px',
            'font-family': this.fontFamily(),
            'font-size': this.height() + 'px'
        });
    };


    // defaults


    progressBar.prototype.height = function(){
        return ( 'height' in this.config ) ? this.config.height : '10'
    };
    progressBar.prototype.animSecs = function(){
        return ( 'animSecs' in this.config ) ? this.config.animSecs : '.75s'
    };
    progressBar.prototype.barColor = function(){
        return ( 'barColor' in this.config ) ? this.config.barColor : 'blue'
    };
    progressBar.prototype.bgColor = function(){
        return ( 'bgColor' in this.config ) ? this.config.bgColor : '#333'
    };
    progressBar.prototype.textColor = function(){
        return ( 'textColor' in this.config ) ? this.config.textColor : 'white'
    };
    progressBar.prototype.fontFamily = function(){
        return ( 'fontFamily' in this.config ) ? this.config.fontFamily : 'Helvetica'
    };
    progressBar.prototype.textShow = function(){
        return ( 'textShow' in this.config ) ? this.config.textShow : true
    };


    // configure animation

    progressBar.prototype.startAnim = function(){
        this.barElem().css({
            '-webkit-transition': this.transCss(),
            '-moz-transition': this.transCss(),
            '-o-transition': this.transCss(),
            'transition': this.transCss()
        })
    };

    progressBar.prototype.stopAnim = function(){
        this.barElem().css({
            '-webkit-transition': 'none',
            '-moz-transition': 'none',
            '-o-transition': 'none',
            'transition': 'none'
        })
    };

    progressBar.prototype.transCss = function(){
        return 'width ' + this.animSecs() + ' ease-in-out'
    };


    // create a bar stripe

    progressBar.prototype.stripe = function(){
        if ( ! this.stripeBuilt ){
            this.stripeElem().css({
                content: "",
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                'background-image': this.stripeBg(),
                'z-index': 1,
                'background-size': '50px 50px',
                animation: 'move 2s linear infinite',
                'border-top-right-radius': '8px',
                'border-bottom-right-radius': '8px',
                'border-top-left-radius': '20px',
                'border-bottom-left-radius': '20px',
                overflow: 'hidden'
            })
        }
        this.stripeBuilt = true;
    };

    progressBar.prototype.clearStripe = function(){
        this.stripeElem().removeAttr( 'style' );
        this.stripeBuilt = false;
    };

    progressBar.prototype.stripeBg = function(){
        var config = [
            '-45deg',
            'rgba( 255, 255, 255, .2 )',
            '25%',
            'transparent 25%',
            'transparent 50%',
            'rgba( 255, 255, 255, .2 ) 50%',
            'rgba( 255, 255, 255, .2 ) 75%',
            'transparent 75%',
            'transparent'
        ];
        return 'linear-gradient( ' + config.join(',') + ' )'
    };

    progressBar.prototype.startStripe = function(){
        this.stripe();
        this.animating = true;
        this.animFrame = 0;

        var self = this;
        this.animTick = setInterval( function(){
            self.stripeElem().css({
                'background-position': self.animFrame + 'px ' + self.animFrame + 'px'
            });
            self.animFrame++;
        }, 10 );
    };

    progressBar.prototype.stopStripe = function(){
        this.animating = false;
        clearTimeout( this.animTick );
    };


    // get elements

    progressBar.prototype.rootElem = function(){
        if ( !( 'root' in this.dom )){
            this.dom.root = $( this.config.elem );
        }
        return this.dom.root
    };
    progressBar.prototype.barElem = function(){
        if ( !( 'bar' in this.dom )){
            this.dom.bar = $( '.bar', this.config.elem );
        }
        return this.dom.bar
    };
    progressBar.prototype.textElem = function(){
        if ( !( 'text' in this.dom )){
            this.dom.text = $( '.text', this.config.elem );
        }
        return this.dom.text
    };
    progressBar.prototype.stripeElem = function(){
        if ( !( 'stripe' in this.dom )){
            this.dom.stripe = $( '.stripe', this.config.elem );
        }
        return this.dom.stripe
    };


    // update percentage

    progressBar.prototype.text = function( val ){
        this.textElem().text( val );
    };

    progressBar.prototype.set = function( val ){
        if ( val > 100 || val < 0 ){ return }
        this.val = val;
        this.barElem().width( this.percent() );
        this.showText();
    };

    progressBar.prototype.percent = function(){ return this.val + '%' };
    progressBar.prototype.clearText = function(){ this.text( '' ) };
    progressBar.prototype.showText = function(){
        if ( this.textShow() ){
            this.text( this.percent() )
        }
    };
    return progressBar;
});