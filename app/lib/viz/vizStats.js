define([
'stats'
],
function(){
	
	var vizStats = function(){
		this.item = new Stats();
		this.item.domElement.style.position = 'absolute';
		this.item.domElement.style.bottom = '0';
		this.item.domElement.style.right = '0';
		this.item.domElement.style.zIndex = 100;
		document.body.appendChild( this.item.domElement );
	}
	
	vizStats.prototype.update = function(){
		this.item.update();
	}
	
	return vizStats
});