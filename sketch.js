const total = 500;
let counter = 0;
let pipes = [];
let birds = [];
let deadBirds = [];
let score = 0;
let generation = 1;
let best = 0;
let slider;

function setup() {
	createCanvas(480, 650);
	slider = createSlider(1, 100, 1);
	for(let i = 0; i < total; i++) {
		birds[i] = new Bird();
	}
}

function draw() {

	for(let n = 0; n < slider.value(); n++) {
		// Adding a new pipe
		if(counter % 75 == 0) {
			pipes.push(new Pipe());
		}
		counter++;

		for(let i = pipes.length - 1; i >= 0; i--) {
			pipes[i].move();
			if(pipes[i].offscreen()) {
				pipes.splice(i, 1);
				score++;
			}
		}

		for(let bird of birds) {
			bird.makeDecision(pipes);
			bird.move();
		}

		for(let i = birds.length-1; i >= 0; i--) {
			if(birds[i].y === height || birds[i].y === 0) {
				deadBirds.push(birds.splice(i, 1)[0]);
			}
		}

		for(let pipe of pipes) {
			for(let i = birds.length-1; i >= 0; i--) {
				if(pipe.hit(birds[i])) {
					deadBirds.push(birds.splice(i, 1)[0]);
				}
			}
		}

		// Restarting if no birds left
		if(birds.length === 0) {
			counter = 0;
			best = max(best, score);
			score = 0;
			nextGen();
			generation++;
			pipes = [];
		}
	}

	// Display
	background(51);
	for (let pipe of pipes) {
		pipe.show();
	}
	for (let bird of birds) {
		bird.show();
	}
	//score display
	fill(200);
	textSize(20);
	text("Generation: " + generation, 50, 80);
	text("Best score: " + best, 50, 110);
	text("Score: " + score, 50, 50);
}