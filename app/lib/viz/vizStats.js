define([
'stats'
],
function(){
	
	var vizStats = function( config ){
		this.item = new Stats();
		this.config = config;
		this.item.domElement.style.position = 'absolute';
		this.item.domElement.style.bottom = '0';
		this.item.domElement.style.right = '0';
		this.item.domElement.style.zIndex = 100;
		this.config.elem.appendChild( this.item.domElement );
	}
	
	vizStats.prototype.update = function(){
		this.item.update();
	}
	
	return vizStats
});