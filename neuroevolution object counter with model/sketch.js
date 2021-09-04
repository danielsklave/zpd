
var slider;
var debug;
// objektu skaits
var score = 0;
// objektu masīvs
var obsticles = [];

var player;
var cool = 0;
var avgScores = [];
var bestScores = [];
var bestBrain = {
  "input_nodes": 5,
  "output_nodes": 1,
  "weights_io": {
    "rows": 1,
    "cols": 5,
    "data": [
      [
        0.21500865253268042,
        0.6741986438763115,
        -0.8536392753500337,
        -0.2552011947767907,
        0.508939745260079
      ]
    ]
  },
  "bias_o": {
    "rows": 1,
    "cols": 1,
    "data": [
      [
        0.0526866403158662
      ]
    ]
  },
  "learning_rate": 0.1,
  "activation_function": {}
};

// function preload() {
//   bestBrain = loadJSON("bestBird final.json");
// }

function setup(){
	createCanvas(500,700);
	rectMode(RADIUS);
	textSize(30);
	textAlign(LEFT, TOP);
	slider = createSlider(1,1000,1);
  debug = createCheckbox();
	// izveido sākuma populāciju
	player = new Player(NeuralNetwork.deserialize(bestBrain));
}

// cikls
function draw(){
  // uzzīmē laukumu
  drawField();
	// slider ātrums
	for(var n = 0; n<slider.value(); n++){
		// pievieno jaunu objektu pēc nejaušības principa kādā no 3 joslām
		cool--;
		if(Math.floor(random(30)) == 0 && cool <= 0){
			// nosaka joslas numuru
			var ran = Math.floor(random(3));
			// pievieno objektu spēlētāju redzei
			player.obs.push(new Obsticle(ran));
			cool = 20;
	  }
		// spēlētājam:
			// aprēķina nākamo gājienu
			player.think();
			// atjauno objektu augstumu spēlētāja redzē
			for (var j = player.obs.length-1; j >= 0; j--) {
				player.obs[j].y += player.obs[j].ySpeed;
				// noņem objektu, ja tas nav uz laukuma
				if(player.obs[j].y >= height){
					noLoop();
				}
			}
			// pārbauda vai spēlētājs pieskaras objektam
			player.collision();
	}
}

// uzzīmē laukumu
function drawField() {
	// fons
	background(0);
	// joslas
	stroke(255);
	line(width/3,0,width/3,height);
	line(width/3*2,0,width/3*2,height);
	noStroke();
  fill(0,255,0);
	// teksts
	text("Score: "+score, 5, 5);
	// objekti
	for (var i = 0; i < player.obs.length; i++) {
		player.obs[i].show();
	}
	// spēlētāji
		player.show();
}

// nosaka vai līnija līnija šķērso objektu
function lineRect(x1, y1, x2, y2, rx, ry, rw, rh, point) {

  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  var left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh,point);
  var right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh,point);
  var top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry,point);
  var bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh,point);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    return true;
  }
  return false;
}


// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4,point) {

  // calculate the direction of the lines
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    if(!debug.checked()){
      var intersectionX = x1 + (uA * (x2-x1));
      var intersectionY = y1 + (uA * (y2-y1));
      point = createVector(intersectionX,intersectionY);
      stroke(255,0,0);
      strokeWeight(2);
      line(x1,y1,intersectionX,intersectionY);
      fill(255,0,0);
      noStroke();
      ellipse(intersectionX, intersectionY, 10, 10);
    }
    return true;
  }
  return false;
}
