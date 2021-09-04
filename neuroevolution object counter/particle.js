// spēlētājs
class Player{
	constructor(brain){
		// x koordinātas
		this.x = width/2;
		// sākuma y koordinātas
		this.y = height-80;
		// spēlētāja lielums
		this.l = 15;
		// kustības ātrums pa x asi
		this.xSpeed = 15;
		// saskaitītie objekti
		this.score = 0;
		// fitnesa punkti
		this.fitness = 0;
		// spēlētājam redzamie objekti
		this.obs = [];
		// NT
		if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(5,1);
		}
	}

	think() {
		// ievades vērtību masīvs
		var inputs = new Array(6);
		// noskaidro cik tālu atrodas objekts 9 virzienos
    var p = createVector(this.x, this.y);
		// katram objektam spēlētāja redzē
    for (var i = this.obs.length - 1; i >= 0; i--) {
      var point = createVector(this.obs[i].x-this.obs[i].l, this.obs[i].y-this.obs[i].l);
			// katram virzienam:
		  for(var j = 0;j<inputs.length;j++){
				// ja līnija līnija šķērso objektu
			  var hit = lineRect(this.x, this.y, this.x+(height*cos(j*PI/(inputs.length-1))), this.y-(height*sin(j*PI/(inputs.length-1))), this.obs[i].x-this.obs[i].l, this.obs[i].y-this.obs[i].l, this.obs[i].l*2, this.obs[i].l*2,point);
			  if(hit){
					// pievieno ievades vērtību masīvam normalizētu objekta distanci līdz spēlētājam
				  inputs[j] = dist(this.x,this.y,this.obs[i].x,this.obs[i].y)/height;
			  } else {
					// ja līnija līnija nešķērso objektu
					inputs[j] = 1;
				}
		  }
    }
		inputs.splice(0,1);
		inputs.splice(inputs.length-1,1);
		// pievieno ievades vērtību masīvam normalizētas spēlētāja x koordinātas
    inputs.push(this.x/width);
		// NT izvades vērtības
    var output = this.brain.predict(inputs);
		// ja izvades vērtība > 0.5
		if(output[0]> 0.5 && this.x >= this.l+2){
				this.x -= this.xSpeed;
		} else if (this.x <= width - this.l - 2){
				this.x += this.xSpeed;
		}
	}

	// mutācija
	mutate() {
		// mutācijas iespēja 10%
    this.brain.mutate(mr);
  }

	// zīmēšana
	show(){
		fill(0,255,0);
		rect(this.x,this.y,this.l,this.l);
	}

	collision(){
		// ja spēlētājs pieskaras kādam objektam
		for (var i = this.obs.length-1; i >= 0 ; i--) {
			if(this.obs[i].x + this.obs[i].l > this.x - this.l &&
				 this.obs[i].x - this.obs[i].l < this.x + this.l &&
	    	 this.obs[i].y - this.obs[i].l < this.y + this.l &&
				 this.obs[i].y + this.obs[i].l > this.y - this.l){
				// noņem objektu no spēlētāja redzes
				this.obs.splice(i, 1);
				// pieskaita objektu spēlētājam
				this.score++;
			}
		}
	}
}
