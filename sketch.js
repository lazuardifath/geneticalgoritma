var lifespan=400;
var population;
var target;
var ob;
var max=0;
function setup(){
    createCanvas(500,500);
    target=createVector(width/2,30)
    ob=createVector(width/2-150,height/2);
    population=new Population();
}
function draw(){
    background(0);
    stroke(255);
    noFill();
    rectMode(CORNER);
    rect(target.x,target.y,10,10);
    rect(ob.x,ob.y,300,20);
    population.update();
    population.show();
}
