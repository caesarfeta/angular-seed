define([
'./LSYS.ThreeD',
], 
function( LSYS ){
    // 3D
    
    LSYS.Lib = function( scene ){
        
        // build the renderer object
        
        var renderer = new LSYS.ThreeD({ 'delay': .001 });
        function build( sys, func ){
            sys.run();
            return renderer.draw( sys, func, scene );
        }
        
        return {
            dragonCurve: function(){
                return build(
                    new LSYS.Sys( 12, 90, 'FX', 'X=X+YF+', 'Y=-FX-Y' ),
                    function( _a, _b, _i ){
                        return _i*_b/5000;
                    }
                )
            },
            hexTri: function(){
                return build(
                    new LSYS.Sys( 8, 60, 'A', 'A=B-A-B', 'B=A+B+A' ),
                    function( _a, _b, _i ){
                        return _i*_b/2000;
                    }
                )
            },
            shrimp: function(){
                return build(
                    new LSYS.Sys( 8, 60, 'A', 'A=B+A+B', 'B=A-BB' ),
                    function( _x, _y, _i, _total ){
                        return 10*Math.sin( (_i%_total) * Math.toRad( 15 ) );
                    }
                )
            },
            coil: function(){
                return build(
                    new LSYS.Sys( 6, 4, 'ABA', 'A=BB', 'B=A-BB' ),
                    function( _x, _y, _i, _total ){
                        return _i*_y/200;
                    }
                )
            },
            chip: function(){
                return build(
                    new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' ),
                    function( _x, _y, _i, _total ){
                        return _i/100;
                    }
                )
            },
            tornChip: function(){
                return build(
                    new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' ),
                    function( _x, _y, _i, _total ){
                        return _y+900/_x;
                    }
                )
            }
        }
    }

    
    LSYS.ThreeD_Chip = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _i/100;
        });
        var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_Chip.prototype = Object.create( LSYS.ThreeD.prototype );
    
    LSYS.ThreeD_ChipTear = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _y+900/_x;
        });
        var sys = new LSYS.Sys( 8, 90, 'BA', 'A=+BAB+', 'B=--ABA--' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_ChipTear.prototype = Object.create( LSYS.ThreeD.prototype );
    
    LSYS.ThreeD_U = function( _canvas ) {
        LSYS.ThreeD.call( this, _canvas, { 'delay': .001 } );
        this.init( function( _x, _y, _i, _total ) {
            return _i/_total;
        });
        var sys = new LSYS.Sys( 4, 270, 'A', 'A=--AA' );
        sys.run();
        sys.draw( this );
    }
    LSYS.ThreeD_U.prototype = Object.create( LSYS.ThreeD.prototype );
    
    LSYS.Renderer = function( _canvas ) {
      this.canvas = _canvas;
      this.constants = {
        '+': 'COUNTERCLOCK',
        '-': 'CLOCKWISE',
        '[': 'PUSH',
        ']': 'POP',
        'C': 'COLOR'
      };
    }
    
    //  2D renderer class
    
    LSYS.TwoD = function( _canvas, _options ){
      LSYS.Renderer.call( this, _canvas );
      this.ctx = this.canvas.getContext('2d');
      this.options = ( _options == undefined ) ? {} : _options;
      this.options['delay'] = ( this.options['delay'] == undefined ) ? 0 : this.options['delay'];
      self.i = 1;
    }
    LSYS.TwoD.prototype = Object.create( LSYS.Renderer.prototype );
    LSYS.TwoD.prototype.draw = function( _input, _angle, _reset ) {
      
      //  Get the coordinates with unit distance
      
      var angle = _angle;
      var x = 0;
      var y = 0;
      var maxX = 0;
      var maxY = 0;
      var minX = 0;
      var minY = 0;
      coords = [];
      coords.push( [x,y] );
  
      //------------------------------------------------------------
      //  Loop through the LSys input string
      //------------------------------------------------------------
      var chars = _input.split('');
      for ( var i in chars ) {
        if ( chars[i] in this.constants ) {
          switch ( this.constants[ chars[i] ] ) {
            case 'COUNTERCLOCK':
              angle += _angle;
              break;
            case 'CLOCKWISE':
              angle -= _angle;
              break;
            case 'PUSH':
              var vector = Math.toCart( 1, Math.toRad( angle ) );
              x += vector[0];
              y += vector[1];
              coords.push( [x,y] );
              break;
            case 'POP':
              coords.pop();
              break;
          }
        }
        else {
          var vector = Math.toCart( 1, Math.toRad( angle ) );
          x += vector[0];
          y += vector[1];
          coords.push( [x,y] );
      
          //------------------------------------------------------------
          //  Keep track of the biggest and smallest coordinates so 
          //  we can determine the boundary box of the image
          //------------------------------------------------------------
          maxX = ( x > maxX ) ? x : maxX;
          maxY = ( y > maxY ) ? y : maxY;
          minX = ( x < minX ) ? x : minX;
          minY = ( y < minY ) ? y : minY;
        }
      }
  
      //------------------------------------------------------------
      //  Get the values you need to nudge the shape in place
      //------------------------------------------------------------
      var nudgeX = ( minX < 0 ) ? minX*-1 : 0;
      var nudgeY = ( minY < 0 ) ? minY*-1 : 0;  
  
      //------------------------------------------------------------
      //  Scale the thing up to the size of the canvas
      //------------------------------------------------------------
      var rx = this.canvas.width / ( maxX + nudgeX );
      var ry = this.canvas.height / ( maxY + nudgeY );
      var scale = ( rx < ry ) ? rx : ry;
  
      //------------------------------------------------------------
      //  Center the shape into the center of the canvas
      //------------------------------------------------------------
      var centerX = this.canvas.width / 2;
  
      //------------------------------------------------------------
      //  If reset draw very quickly what's already been drawn
      //------------------------------------------------------------
      if ( _reset == true ) {
        var i=1;
        while ( i < this.current ) {
          this.toCanvas( coords, i, scale, centerX, nudgeY );
          i++;
        }
        _reset = false;
        return;
      }
  
      //------------------------------------------------------------
      //  Draw with a delay
      //------------------------------------------------------------
      var i=1
      while ( i < coords.length ) {
        setTimeout( this.timeToCanvas(coords, i, scale, centerX, nudgeY), this.options['delay']*1000*i );
        i++;
      }
    }
    LSYS.TwoD.prototype.timeToCanvas = function( _coords, _i, _scale, _centerX, _nudgeY ) {
      var self = this;
      return function() {
        self.current = _i;
        self.toCanvas( _coords, _i, _scale, _centerX, _nudgeY );
      }
    }
    LSYS.TwoD.prototype.toCanvas = function( _coords, _i, _scale, _centerX, _nudgeY ) {
      var self = this;
      self.ctx.beginPath();
      self.ctx.moveTo( (_coords[_i-1][0])*_scale + _centerX, (_coords[_i-1][1]+_nudgeY)*_scale);
      self.ctx.lineTo( (_coords[_i][0])*_scale + _centerX, (coords[_i][1]+_nudgeY)*_scale);
      self.ctx.stroke();
      self.ctx.closePath();
      self.ctx.stroke();
    }
    
    return LSYS
})