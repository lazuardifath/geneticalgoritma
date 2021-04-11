class Population{
    constructor(){
        this.cars=[];
        this.populationCount=50;
        this.count=0;
        this.generation=0;
        this.pool=[];
        for(var i=0;i<this.populationCount;i++){
            this.cars.push(new Car());
        }
    }
    update(){
        for(var i in this.cars){
            this.cars[i].applyForce(this.cars[i].genes[this.count]);
            this.cars[i].update();
        }
        this.count++;
        if(this.count==lifespan){
            this.count=0;
            lifespan+=10;
            this.generation++;
            document.getElementById("gen").innerHTML="Generation= "+this.generation;
            this.fitness();
            document.getElementById("fit").innerHTML="Max fitness= "+max;
            this.selection();
        }
    }
    fitness(){
        max=0;
        for(var i in this.cars){
            var d=dist(this.cars[i].pos.x,this.cars[i].pos.y,target.x,target.y);
            this.cars[i].fitness=map(d,0,width,width,0);
            if(this.cars[i].win){
                this.cars[i].fitness*=10;
            }
            else if(this.cars[i].dead){
                this.cars[i].fitness/=20;
            }
            if(this.cars[i].fitness>max){
                max=this.cars[i].fitness;
            }   
        }
        for(var i in this.cars){
            this.cars[i].fitness/=max;
        }
    }
    selection(){
        this.pool=[];
        var newCars=[];
        for(var i in this.cars){
            for(var j=0;j<(this.cars[i].fitness*100);j++){
                this.pool.push(this.cars[i]);
            }
        }
        for(var i=0;i<this.populationCount;i++){
            var index=floor(random(this.pool.length));
            var pa=this.pool[index];
            index=floor(random(this.pool.length));
            var pb=this.pool[index];
            var child=new Car();
            var mid=pa.genes.length/2;
            for(var j=0;j<pa.genes.length;j++){
                if(j<mid){
                    child.genes[j]=pa.genes[j];
                }
                else{
                    child.genes[j]=pb.genes[j];
                }
            }
            for(var j=0;j<pa.genes.length;j++){
                if(random(1)<0.001){
                    child.genes[j]=p5.Vector.random2D();
                    child.genes[j].setMag(0.15);
                }
            }
            newCars.push(child);
        }
        this.cars=newCars;
    }
    show(){
        for(var i in this.cars){
            this.cars[i].show();
        }
    }
}