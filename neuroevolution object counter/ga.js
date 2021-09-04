// jauna paaudze
function nextGeneration() {
  // fitnesa funkcija
  calculateFitness();
  // izveido jaunu paaudzi
  for(var i = 0; i < population; i++){
    // pievieno populācijai jaunu spēlētāju
    players[i] = pickOne();
  }
  // iztukšo vecās paaudzes masīvu
  savedPlayers = [];
}

// selekcija
function pickOne() {
  // nejauši izvēlas spēlētāju pēc fitnesa punktiem
  var index = 0;
  var r = random(1);
  while (r > 0) {
    r = r-savedPlayers[index].fitness;
    index++;
  }
  index--;
  // definē jaunu spēlētāju ar izvēlētā "vecāka" NT
  var child = new Player(savedPlayers[index].brain);
  // mutācija
  child.mutate();
  // atgriež jauno spēlētāju
  return child;
}

// fitnesa funkcija
function calculateFitness() {
  // saskaita kopā spēlētāju saskaitītos objektus
  var sum = 0;
  for(let player of savedPlayers){
    sum += player.score;
  }
  // katram spēlētājam:
  for(let player of savedPlayers){
    // aprēķina fitnesa punktu saskaitu, izdalot spēlētāja saskaitītos objektus ar saskaitīto objektu summu
    player.fitness = player.score / sum;
  }
}
