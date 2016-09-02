define([
'stats'
],
function(){
    
    var vizStats = function( config ){
        var self = this;
        self.item = new Stats();
        self.config = config;
        self.item.domElement.style.position = 'absolute';
        self.item.domElement.style.bottom = '0';
        self.item.domElement.style.right = '0';
        self.item.domElement.style.zIndex = 100;
        self.config.elem.appendChild( self.item.domElement );
    }
    
    vizStats.prototype.update = function(){
        var self = this;
        self.item.update();
    }
    
    return vizStats
});