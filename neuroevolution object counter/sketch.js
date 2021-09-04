
var slider;
var debug;
// objektu skaits
var score = 0;
// objektu limits
var lim = 1000;
// spēlētāju skaits
var population = 100;
// paaudzes numurs
var gen = 0;
// mutācijas rate
var mr = 0.1;
// objektu masīvs
var obsticles = [];
// spēlētāju masīvs
var players = [];
// saglabāto spēlētāju masīvs
var savedPlayers = [];
var avgScores = [];
var bestScores = [];
var bestBrain;
var cooldown = 20;

function keyPressed(){
	if(key === 'S'){
		saveJSON(bestScores, 'best_scores.json');
		saveJSON(avgScores, 'avg_scores.json');
		saveJSON(bestBrain, 'bestBird.json');
	}
}

function setup(){
	createCanvas(500,700);
	rectMode(RADIUS);
	textSize(30);
	textAlign(LEFT, TOP);
	slider = createSlider(1,500,500);
	debug = createCheckbox();
	// izveido sākuma populāciju
	for (var i = 0; i < population; i++) {
		players.push(new Player());
	}
}

// cikls
function draw(){
	// uzzīmē laukumu
	drawField();
	// slider ātrums
	for(var n = 0; n<slider.value(); n++){
		// pievieno jaunu objektu pēc nejaušības principa kādā no 3 joslām
		cooldown--;
		if(Math.floor(random(45)) == 0 && cooldown <= 0){
			// nosaka joslas numuru
			var ran = Math.floor(random(3));
			// pievieno objektu laukumam
	    obsticles.push(new Obsticle(ran));
			// pievieno objektu spēlētāju redzei
			for (p of players) {
				p.obs.push(new Obsticle(ran));
			}
			cooldown = 20;
	  }
		// katram objektam:
		for (var i = obsticles.length-1; i >= 0; i--) {
			// atjauno augstumu
			obsticles[i].y += obsticles[i].ySpeed;
			// noņem objektu, ja tas nav uz laukuma
			if(obsticles[i].y >= height){
  			obsticles.splice(i, 1);
  			score++;
				// noņem spēlētājus, kuri nav pieskārušies tam objektam un tos ievieto saglabāto spēlētāju masīvā
				// for (var j = players.length-1; j>=0; j--) {
				// 	if (players[j].score != score) {
				// 		savedPlayers.push(players.splice(j,1)[0]);
				// 	}
				// }
			}
		}
		// katram spēlētājam:
		for (var i = players.length-1; i>=0; i--) {
			// aprēķina nākamo gājienu
			players[i].think();
			// pārbauda vai spēlētājs pieskaras objektam
			players[i].collision();
			// atjauno objektu augstumu spēlētāja redzē
			for (var j = players[i].obs.length-1; j >= 0; j--) {
				players[i].obs[j].y += players[i].obs[j].ySpeed;
					if(players[i].obs[j].y >= height){
						savedPlayers.push(players.splice(i,1)[0]);
						break;
					}
			}
		}
		// ja beigušies spēlētāji vai objektu limits ir sasniegts
		if (players.length == 0 || score >= lim) {
			// noņem no laukuma atlikušos spēlētājus
			var m = 0;
			for (p of players) {
			savedPlayers.push(p);
			m++;
			}
			//mr = (1 - m/population)/10;
			if (mr< 0.01) {
				mr = 0;
			}
			bestScores.push(m);
			// aprēķina vidējo punktu skaitu
			var sc = 0;
			for(let p of savedPlayers){
				sc += p.score;
			}
			avgScores.push(sc/savedPlayers.length);
			bestBrain = savedPlayers[savedPlayers.length-1].brain;
			console.log("Generation: "+gen, "Score: "+score,"p: "+m,"Avg: "+(sc/savedPlayers.length));
			// uzģenerē jaunu paaudzi
			nextGeneration();
			gen++;
			// iztukšo objektu masīvu
			obsticles = [];
			score = 0;
		}
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
	// teksts
	text("Alive: "+players.length, 5, 30);
	text("Score: "+score, 5, 5);
	// objekti
	for (var i = 0; i < obsticles.length; i++) {
		obsticles[i].show();
	}
	// spēlētāji
	for (player of players) {
		player.show();
		if(debug.checked()){
				break;
			}
	}
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
    return true;
  }
  return false;
}
