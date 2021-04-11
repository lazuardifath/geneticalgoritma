"use strict"

/* P3 - Phase 5 HueGrid Array Controlled by Chromosome w/ genetic operators - Jason Streeter
    Begins with a random Hue Grid based on chromosome genes that were given when chromosome
    was assigned with a random value. Hit the reset buttom to generate another random
    Hue Grid. Genetic operators can be used to mutate, cross, or breed entierly new grids.
 */

let cnv;              // Global variable for the canvas

let resetButton;    // Buttons resets canvas
let mutateButton;   // Button mutates hueGrids
let selectButton;   // Button breeds two randomly selected hueGrids together
let crossButton;    // Button breeds two set hueGrids
let breedButton;    // Button breeds two hue grids and mutates the child
let newGenButton;   // Button breeds a new generation of hue grids

let devSlider;      // Button controls max deviation

let hGArray;             // Global hueGrid variable
let gen;                // Global genetics variable

function setup() {
	cnv = createCanvas(960, 800); // Create & position canvas on window
	cnv.position(0, 0);
	colorMode(HSB);
	background(100);               // White background - same as window's
	
	noStroke();
    
    // Set action for reset button
    resetButton = createButton("Reset");
    resetButton.mousePressed(reset);
    resetButton.position(190, 30);
    
    // Set action for mutate button
    mutateButton = createButton("Mutate");
    mutateButton.mousePressed(doMutate);
    mutateButton.position(250, 30);
   
    //Set action for cross button
    crossButton = createButton("Crossover");
    crossButton.mousePressed(doCross);
    crossButton.position(315, 30);
    
    //Set action for select button
    selectButton = createButton("Selection");
    selectButton.mousePressed(doSelect);
    selectButton.position(400, 30);
    
    // Set action for breed button
    breedButton = createButton("Breed");
    breedButton.mousePressed(doBreed);
    breedButton.position(480, 30);
    
    // Set action for new gen button
    newGenButton = createButton("Breed New Generation");
    newGenButton.mousePressed(newGen);
    newGenButton.position(540, 30);
    
    // Set action for deviation slider
    devSlider = createSlider(0, 20, 5, 0);
    devSlider.position(50, 35);
    
    // Creates hueGrid with a random chromosome
    hGArray = []; 
    
    // Initializes our Genetics class for genetic operators
    gen = new Genetics(13, 9);
    
    for(let i = 0; i < gen.popSize; i++)
    {
        let mult1 = i % 3;
        let mult2 = Math.floor(i / 3);
        
        // Creates a new object in hue Grid array with specified dimensions
        hGArray[i] = new HueGrid(Math.floor(random(8192)), 20 + (mult1 * 320), 80 + (mult2 * 220), 300, 200);
        
        // Updates fitness and chromosome arrays in genetics class
        gen.newIndividual(i, hGArray[i].chrom, 0);
    }
}


function draw() 
{
    let label = createP("Max Deviation")
    label.position(70, 0);
    
    for(let i = 0; i < gen.popSize; i++)
    {
        hGArray[i].display();
    }
}

// Breeds top left hue grid with one next to it, resets first
// hueGrid with child
function doCross()
{
    let childChrom = gen.crossover(hGArray[0].chrom, hGArray[1].chrom);
    hGArray[0].reset(childChrom);
    
    // Updates fitness and chromosome arrays in genetics class
    gen.newIndividual(0, hGArray[0].chrom, 0);
}

// Mutates grid in upper left corner
function doMutate()
{
    let mutChrom = gen.mutation(hGArray[0].chrom);
    hGArray[0].reset(mutChrom);
    
    // Updates fitness and chromosome arrays in genetics class
    gen.newIndividual(0, hGArray[0].chrom, 0);
}

// Breeds two selected hueGrids together, child replaces upper left hue grid
function doSelect()
{
    let childChrom = gen.crossover(gen.select(), gen.select());
    hGArray[0].reset(childChrom);
    
    // Updates fitness and chromosome arrays in genetics class
    gen.newIndividual(0, hGArray[0].chrom, 0);
}

// Breeds two randomly selected huegrids and then mutates child
function doBreed()
{
    let newChild = gen.breed1();
    hGArray[0].reset(newChild);
    
    // Updates fitness and chromosome arrays in genetics class
    gen.newIndividual(0, hGArray[0].chrom, 0);
}

// Breeds two hue grids to create a new generation of hue grids. Keeps most fit.
function newGen()
{
    let nextGen = [];
    let bestIndividual = gen.getFittest();
    nextGen[0] = bestIndividual;
    
    // Breeds new children to fill spaces 2-9
    for(let i = 1; i < gen.popSize; i++)
    {
        nextGen[i] = gen.breed1();
    }
    
    // Resets grids 1-9
    for(let i = 0; i < gen.popSize; i++)
    {
        // Resets fitness and chrom arrays in gen class
        gen.newIndividual(i, nextGen[i], 0);
        
        // Resets all hueGrids
        hGArray[i].reset(nextGen[i]);
    }
}

function reset()
{
    for(let i = 0; i < 9; i++)
    {
        // Generates another random hueGrid
        hGArray[i].reset(gen.randomChrom());
        
        // Updates fitness and chromosome arrays in genetics class
        gen.newIndividual(i, hGArray[i].chrom, 0);
    }
}

function keyTyped()
{
    for(let i = 0; i < gen.popSize; i++)
    {
        if(hGArray[i].isMouseTouching())
        {
            if(key == '+') 
            {
                gen.adjustFitness(i, 1);
            } 
            else if(key == '-')
            {
                gen.adjustFitness(i, -1);
            }
        }
    }
}