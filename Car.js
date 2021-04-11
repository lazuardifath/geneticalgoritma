class Car{
    constructor(){
        this.pos=createVector(width/2,height-50);
        this.velocity=createVector();
        this.acceleration=createVector();
        this.genes=[];
        this.fitness=0;
        this.dead=false;
        this.win=false;
        for(var i=0;i<lifespan;i++){
            this.genes[i]=p5.Vector.random2D();
            this.genes[i].setMag(0.15);
        }
    }
    applyForce(force){
        this.acceleration.add(force);
    }
    update(){
        if(!this.dead && !this.win){
            this.velocity.add(this.acceleration);
            this.pos.add(this.velocity);
            this.acceleration.mult(0);
        }
        if(collideRectRect(this.pos.x,this.pos.y,30,6,target.x,target.y,10,10)){
            this.win=true;   
        }
        if(collideRectRect(this.pos.x,this.pos.y,30,6,ob.x,ob.y,300,20)|| this.pos.x>width ||this.pos.x<0 ||this.pos.y>height ||this.pos.y<0){
            this.dead=true;
        }
    }
    show(){
        stroke(255);
        fill(255,100);
        rectMode(CENTER);
        push();
        translate(this.pos.x,this.pos.y)
        rotate(this.velocity.heading());
        rect(0,0,30,6);
        pop();
    }
}