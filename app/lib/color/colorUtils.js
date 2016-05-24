define([ 
'tinycolor',
'lodash' 
],
function( tinycolor, _ ){
    var self = this;

    var square = function( n ){ return n*n }

    // get the RGB distance between two colors

    self.rgbDist = function( c1, c2 ){
        var c1 = tinycolor( c1 ).toRgb();
        var c2 = tinycolor( c2 ).toRgb();
        
        return Math.sqrt(
            square( c1.r-c2.r )+
            square( c1.g-c2.g )+
            square( c1.b-c2.b )
        )
    };

    // find the closest color in array p that match color c

    self.rgbClose = function( c, p ){
        var min = null;
        var minIndex = null;
        _.each( p, function( pc, i ){
            var d = self.rgbDist( c, pc );
            if ( min == null || d < min  ){ 
                min = d;
                minIndex = i;
            }
        });
        return p[ minIndex ]
    };

    // group closest colors together

    self.palGroup = function( p1, p2 ){
        return p1.map( function( p ){
            return [ p, self.rgbClose( p, p2 ) ]
        })
    };

    return self
})