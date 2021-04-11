let gravity = 0.7;

class Bird {
	constructor(brain) {
		this.x = 200;
		this.y = height/2;
		this.velocity = 0;
		this.lift = -15;
		this.r = 36;
		this.score = 0;
		this.fitness = 0;
		if (brain) {
			this.brain = brain.copy();
		} else {
			this.brain = new NeuralNetwork(4, 4, 1);
		}
	}

	show() {
		fill(22, 192, 120, 50);
		ellipse(this.x, this.y, this.r, this.r);
	}

	mutate() {
		this.brain.mutate(0.1);
	}

	makeDecision(pipes) {
		// find closest pipe
		let closest = null;
		let closestDist = Infinity;
		for(let i = 0; i < pipes.length; i++) {
			let currDist = pipes[i].x - this.x; // Not using abs so that the pipes behind dont count
			if(0 < currDist < closestDist) {
				closestDist = currDist;
				closest = pipes[i];
			}
		}
		let inputs = [];
		// normalized inputs
		inputs[0] = this.y / height;
		inputs[1] = closest.x / width;
		inputs[2] = closest.top / height;
		inputs[3] = closest.bottom / height;
		let outputs = this.brain.predict(inputs);
		if(outputs[0] > 0.5) {
			this.jump();
		}
	}

	move() {
		this.score++;	// Every time the bird moves futher the score increases
		this.velocity += gravity;
		this.y += this.velocity;
		this.y = constrain(this.y, 0, height);
	}

	jump() {
		this.velocity += this.lift;
		this.velocity = constrain(this.velocity, -8.5, 0);
	}
}
