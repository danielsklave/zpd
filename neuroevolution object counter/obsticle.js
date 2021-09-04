// objekts
function Obsticle(x){
	// x koordinātas
	this.x = (x*width/3+85);
	// sākuma y koordinātas
	this.y = 0;
	// objekta lielums
	this.l = 50;
	// kustības ātrums pa y asi
	this.ySpeed = random(9,10);
	// zīmēšana
	this.show = function(){
		fill(255);
		rect(this.x,this.y,this.l,this.l);
	}
}
