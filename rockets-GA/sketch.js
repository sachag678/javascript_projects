var rocket;
var population;
var lifespan = 200;
var lifeP;
var count =0
var target;

function setup() {

	createCanvas(400,300);
	population = new Population();
	lifeP = createP();
	target = createVector(width/2,50);
}

function draw(){
	background(0);
	population.run();
	lifeP.html(count);
	count++;

	if(count==lifespan){
		population.evluate();
		population.selection();
		//population = new Population();
		count =0;
	}

	ellipse(target.x,target.y,16,16);
}

function Population(){
	this.rockets = [];
	this.popsize = 25;
	this.matingpool = [];
	

	for (var i =0;i<this.popsize;i++){
		this.rockets[i] = new Rocket();
	}

	this.evluate = function(){

		var maxfit = 0;

		for(var i =0;i<this.popsize;i++){
			this.rockets[i].calcFitness();
			if(this.rockets[i].fitness > maxfit){
				maxfit = this.rockets[i].fitness;
			}
		}
		createP(maxfit);

		for(var i =0;i<this.popsize;i++){
			this.rockets[i].fitness/=maxfit;
		}

		this.matingpool = [];

		for(var i =0;i<this.popsize;i++){
			var n = this.rockets[i].fitness*100;
			for(var j =0;j<n;j++){
				this.matingpool.push(this.rockets[i]);
			}
		}
	}

	this.selection = function(){
		var newRockets = [];
		for(var i=0;i<this.rockets.length;i++){
			var parentA = random(this.matingpool).dna;
			var parentB = random(this.matingpool).dna;
			var child = parentA.crossover(parentB);
			child.mutation();
			newRockets[i] = new Rocket(child);
		}

		this.rockets = newRockets;
	}



	this.run = function(){
		for (var i =0;i<this.popsize;i++){
			this.rockets[i].update();
			this.rockets[i].show();
		}
	}
}

function DNA(genes){
	if(genes){
		this.genes = genes;
	}else{
		this.genes = [];
		for(var i =0;i<lifespan;i++){
			this.genes[i]= p5.Vector.random2D();
			this.genes[i].setMag(0.4);
		}
	}

	this.crossover = function(partner){
		var newgenes = [];
		var mid = floor(random(this.genes.length));
		for (var i =0;i<this.genes.length;i++){
			if(i>mid){
				newgenes[i]=this.genes[i];
			}else{
				newgenes[i] = partner.genes[i];
			}
			
		}

		return new DNA(newgenes);
	}

	 this.mutation = function() {
    	for (var i = 0; i < this.genes.length; i++) {
      		if (random(1) < 0.01) {
        		this.genes[i] = p5.Vector.random2D();
        		this.genes[i].setMag(0.4);
      		}
    	}
  	}
}

function Rocket(dna){
	this.pos = createVector(width/2,height);
	this.vel = createVector();
	this.acc = createVector();
	this.completed = false;
	this.recordDist = 10000;
	this.finishTime = 0;

	if(dna){
		this.dna = dna;
	}else{
		this.dna = new DNA();
	}
	this.fitness =0;
	

	this.applyForce = function(force){
		this.acc.add(force);
	}

	this.calcFitness = function(){
		var d = dist(this.pos.x,this.pos.x,target.x,target.y);
		//if(d<this.recordDist) this.recordDist = d;

		if (!this.completed) {
      		this.finishTime++;
    	}

    	//if (this.recordDist < 1) {
      	//	this.recordDist = 1;
    	//}

    	this.fitness = map(d,0,width,width,0);
    	//this.fitness = (1/(this.finishTime*this.recordDist));
    	
    	if(this.finishTime!=0){
    		this.fitness = this.fitness/this.finishTime
    	}
    	//this.fitness = pow(this.fitness, 2);

		if (this.completed) {
      		this.fitness *= 10;
    	}
	}

	this.update = function(){

		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    	if (d < 10) {
      		this.completed = true;
      		this.pos = target.copy();
    	}

		this.applyForce(this.dna.genes[count]);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.vel.limit(4);
	}

	this.show = function(){
		push();
		noStroke();
		fill(255, 150);
		translate(this.pos.x,this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0,0,25,5);
		pop();
	}
}