define([
'threejs'
],
function(){
	
	// some things have gotta move
	
	var mover = function( connector ){
		this.connector = connector;
		this.frictionOn = true;
		this.friction = 0.001;
		this.pos = {
			x: 0,
			y: 0,
			z: 0
		};
		this.stop();
	};
	
	mover.prototype.stop = function(){
		this.frictionOn = false;
		this.velo = {
			x: 0,
			y: 0,
			z: 0
		};
	};
	
	mover.prototype.spacePush = function( pos ){
		this.frictionOn = false;
		this.velo = pos;
	};
	
	mover.prototype.push = function( pos ){
		this.frictionOn = true;
		this.velo = pos;
	};
	
	mover.prototype.moveTo = function( pos ){
		this.pos = pos;
	};
	
	mover.prototype.towardZero = function( val, n ){
		if ( Math.abs( val ) < n ){
			return 0
		}
		if ( val > 0 ){ 
			return val + n*-1 
		}
		if ( val < 0 ){ 
			return val + n 
		}
	};
	
	mover.prototype.addFriction = function(){
		this.velo.x = this.towardZero( this.velo.x, this.friction );
		this.velo.y = this.towardZero( this.velo.y, this.friction );
		this.velo.z = this.towardZero( this.velo.z, this.friction );
	};
	
	mover.prototype.addForces = function(){
		if ( this.frictionOn ){ this.addFriction() }
	};
	
	mover.prototype.update = function(){
		this.addForces();
		this.pos.x += this.velo.x;
		this.pos.y += this.velo.y;
		this.pos.z += this.velo.z;
		
		// update position
		
		this.connector.update( this.pos );
	};
	
	return mover
});