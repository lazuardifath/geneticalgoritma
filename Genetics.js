"use strict"

/*
    Project 3 - Phase 5
    Jason Streeter
    Implements genetic operators we can use to alter chromosomes.
*/

class Genetics
{
    constructor(chromLength, popSize)
    {
        this.chromLength = chromLength;
        this.popSize = popSize;
        this.chromPool = [];
        this.fitnessPool = [];
    }
    
    // Changes the chromosome to a new, random sequence of bits
    randomChrom()
    {
        let chrom = Math.floor(random(8192));
        
        return chrom;
    }
    
    // Randomly chooses a single bit to flip in the bite sequence, returns mutated chromosome
    // with a bit flipped
    mutation(chrom)
    {
        let bitLocation = Math.floor(random(0, this.chromLength));
        let newChrom = 2 ** bitLocation;
        
        newChrom = chrom ^ newChrom;
        
        return newChrom;
    }
    
    
    // Takes two parent chromosome, combines genes in bit sequence, returns child chromosome
    crossover(chrom1, chrom2)
    {
        let crossPoint = Math.floor(random(1, this.chromLength - 1));
        let newChrom = (2 ** crossPoint) - 1;
        
        let parentGenes_1 = chrom1 >>> crossPoint;
        let parentGenes_2 = chrom2 & newChrom;
        let childGenes = parentGenes_1 | parentGenes_2;
        
        return childGenes;
    }
    
    // Tournament method where two random individuals are choosen, returns specified chromosome 
    select()
    {
        // Chooses two random fitness values from two random individuals
        let index1 = Math.floor(Math.random(0, 9));
        let selection1 = this.fitnessPool[index1];
        let index2 = Math.floor(Math.random(0, 9));
        let selection2 = this.fitnessPool[index2];
        
        // Compares an returns chromosome with higher fitness
        if(selection1 > selection2)
        {
            return this.chromPool[index1];
        }
        else
        {
            return this.chromPool[index2];
        }
    }
    
    // Chooses two parents with select function, crosses genes to make child, mutates child chrom
    // Returns child chromosome
    breed1()
    {
        let parent1 = this.select();
        let parent2 = this.select();
        
        let child = this.crossover(parent1, parent2);
        child = this.mutation(child);
        
        return child;
    }
    
    adjustFitness(index, increment)
    {
        this.fitnessPool[index] += increment;
        print('Individual Number: ' + index + ' -- New Fitness: ' + this.fitnessPool[index])
    }
    
    newIndividual(index, chromosome, fitness)
    {
        this.chromPool[index] = chromosome;
        this.fitnessPool[index] = fitness;
    }
    
    // Returns most fit individual from current generation
    getFittest()
    {
        let highestFitness = this.fitnessPool[0];
        let best = this.chromPool[0];
        
        for(let i = 1; i < this.popSize; i++)
        {
            if(highestFitness < this.fitnessPool[i])
            {
                highestFitness = this.fitnessPool[i];
                best = this.chromPool[i];
            }
        }
        
        return best;
    }
}