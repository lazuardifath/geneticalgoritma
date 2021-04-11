"use strict"

/*
    Project 3 - Phase 5
    Jason Streeter
    HueGrid class - implements 2D array of hue values and uses a "chromosome" to determine atributes of each hue grid.
*/

class HueGrid
{
    constructor(chrom, x, y, width, height)
    {
        this.chrom = chrom;   //Chromosome decoded to find values for each gene
        this.cellSize;    // Cell size for each of the squares in the grid
        this.opacity;   // Opacity for each square
        this.initMethod; // Value to be decoded for init method
        this.altMethod; // Value to be decoded for alt method
        this.strokeOn;  // Value to be read for stroke (on/off)
        
        this.hueVal;           // Global 2D array of hue values
        this.maxDev;       // Maximum deviation of the hue values each frame
        this.hueOff = 0.0;      // Controls offset for Perlin Noise algorithm for hues
        
        this.x = x;             // X position of top left of grid
        this.y = y;             // y position of top left of grid
        this.width = width;     // Width of grid
        this.height = height;   // Height of grid
        
        this.reset(chrom);
    }
    
    // Reset function resets the hue Grid, takes in chromosome value
    reset(chrom)
    {
        background(100);
        
        this.chrom = chrom;
        this.hueOff = 0;
        
        // Decoding values from chromosome
        
        this.cellSize = (this.chrom & 15) + 3;  // Decodes cell size
        
        let unscaledOpacity = (this.chrom >>> 4) & 7;   // Decodes opacity
        this.opacity = (unscaledOpacity + 1) * 0.1;     // Scaled raw opacity value to set range (1 - 0.1)
        
        this.initMethod = (this.chrom >>> 7) & 7;       // Decodes initialization method
        
        this.altMethod = (this.chrom >>> 10) & 3;       // Decodes alteration method
        
        let rawStrokeValue = this.chrom >>> 12;         // Decodes stroke value
        if(rawStrokeValue == 1) { this.strokeOn = true; }   // Sets stroke value
        else { this.strokeOn = false; }

        // Calculate row & column lengths from window dimensions & cellsize
        // Have to round down to get integer values for array dimensions
        
        let rowLeng = Math.floor(this.width / this.cellSize);
        let colLeng = Math.floor(this.height / this.cellSize);

        this.hueVal = [];                   // It's an array (of arrays)
        let scale = 360 / (rowLeng + colLeng);  // Used for single stripe

        for (let i = 0; i < rowLeng; i++) 
        {
            this.hueVal[i] = [];              // Each element is an array
            
            for (let j = 0; j < colLeng; j++) 
            {
                this.hueVal[i][j] = this.initHue(i, j, scale);
            }
	    }
    }
    
    initHue(i, j, hueScale)
    {
        let hue = 0;
        
        switch(this.initMethod)
        {
            case 0:
                    hue = random(360); // White-noise random
                    break;
            case 1:
                    hue = ((i + j) * 15) % 360; // Stripes
                    break;
            case 2:
                    hue = i * j % 360; // Hyperbolic stripes
                    break;
            case 3:
                    hue = (i + j) * hueScale; // Single stripe
                    break;
            case 4:
                    hue = ((i * i) + (j * j)) % 360;  // Circular
                    break;
            case 5:
                    hue = (i * hueScale) * (j * hueScale) % 360;    // Spirals
                    break;
            case 6:
                    hue = Math.pow(i + j, hueScale) % 360; // Rainbow Stripes
                    break;
            case 7:
                    hue = 0;    //Blank
                    break;
            default:
                    hue = i * j % 360; // Default is hyperbolic stripes
                    break;
        }
        
        return hue;
    }
    
    // Displays each pixel in the hueGrid
    display()
    {
        // Set stroke() or noStroke() once here, not inside the nested loops
        if (this.strokeOn)
            stroke(0);
        else
            noStroke();
        
        this.maxDev = devSlider.value();

        // Draw all the cells in the 2D array on the canvas
        for (let i = 0; i < this.hueVal.length; i++) 
        {
            for (let j = 0; j < this.hueVal[i].length; j++) 
            {
                // Perturb the hue value for this cell and wrap around color wheel
                this.hueVal[i][j] = this.alterHue(this.hueVal[i][j]);

                // Use the hueValue to set the fill for this cell
                fill(this.hueVal[i][j], 100, 100, this.opacity);
                // Location is the loop indices scaled by the cell size
                rect((i * this.cellSize) + this.x, (j * this.cellSize) + this.y, this.cellSize, this.cellSize);
            }
	    }
    }
    
    // Alters hueValue of pixel in grid with selected method
    alterHue(hue)
    {
        // Perturb the hue value & wrap around the color wheel
        switch(this.altMethod)
        {
            case 0:
                hue += random(-this.maxDev, this.maxDev);
                break;
            case 1:
                let bound = random(this.maxDev);
                hue += random(-bound, bound);
                break;
            case 2:
                this.hueOff = this.hueOff + 0.01;
                hue += Math.round(noise(this.hueOff) * this.maxDev);
                break;
            case 3:
                hue += this.maxDev;
                break;
            default:
                break;
        }

        if (hue > 360)
            hue -= 360;
        else if (hue < 0)
            hue += 360;

        return hue;
    }
    
    isMouseTouching()
    {
        if(mouseX >= this.x && mouseX <= this.x + this.width)
        {
            if(mouseY >= this.y && mouseY <= this.y + this.height)
            {
                return true;
            }
        }
        
        return false;
    }
}