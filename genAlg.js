function nextGen() {
	calculateFitness();
	for (let i = 0; i < total; i++) {
		birds[i] = pickBird();
	}
	deadBirds = [];
}

function pickBird() {
	// pick a bird from the dead ones based on it's fitness
	var index = 0;
	var r = random(1); // picks a random +ve no. less than one
	while (r > 0) { // chooses an index based on where the random number falls on the prob distro of the fitness vals
		r -= deadBirds[index].fitness;
		index++;
	}
	index--;	
	let bird = deadBirds[index];
	let child = new Bird(bird.brain);
	child.mutate();
	return child;
}

function calculateFitness() {
	// fitness is the probabilty that the bird gets chosen
	// it is calculated by normalizing the score using the softmax function so that all values 
	// are between 0 and 1 and they all add up to 1
	s = 0
	for (let bird of deadBirds) {
		s += exp(bird.score);
	}
	for (let bird of deadBirds) {
		bird.fitness = exp(bird.score) / s;
	}
}