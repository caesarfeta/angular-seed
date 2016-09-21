define([
'lodash',
'stats'
],
function( _ ){
    
    var vizStats = function( config ){
        var self = this;
        self.item = new Stats();
        self.config = config;
        _.merge( self.item.domElement.style, {
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100
        })
        _.merge( self.item.domElement.style, config )
        self.config.elem.appendChild( self.item.domElement );
    }
    
    vizStats.prototype.update = function(){
        var self = this;
        self.item.update();
    }
    
    return vizStats
});