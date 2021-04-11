class Pipe {
	constructor() {
		// gap between pipes
		let gap = random(150, 200);
		// center of gap
		let centerHeight = random(gap, height-gap);
		// top and bottom
		this.top = centerHeight - gap/2;
		this.bottom = centerHeight + gap/2;
		this.x = width;
		// width
		this.w = 100;
		this.speed = 6;
	}

	hit(bird) {
		if((bird.y-bird.r) < this.top || (bird.y+bird.r) > this.bottom) {
			return (bird.x > this.x && bird.x < this.x + this.w);
		}
		return false;
	}

	show() {
		stroke(0);
		fill(100, 20, 230);
		// top pipe
		rect(this.x, 0, this.w, this.top);
		// bottom pipe
		rect(this.x, this.bottom, this.w, height-this.bottom);
	}

	move() {
		this.x -= this.speed;
	}

	offscreen() {
		return this.x < -this.w;
	}
}
