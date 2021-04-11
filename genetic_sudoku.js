

function GeneticSudoku(original) {
    var grid = null;
    var steps;

    var getRandomNumber = function(max) {
        var limit = max ? max : 9;
        var d = new Date();
        var n = Math.floor(((d.getSeconds() * Math.random()) % 1) * limit); 
        return n;
    }

    var arr_copy = function(gr) {
        return JSON.parse(JSON.stringify(gr));
    }

    var generateEmpty = function() {
        var hr = [];
        for(var r=0; r<9; r ++) {
            var hc = [];
            for(var c=0; c<9; c++) 
                hc.push(0);
            hr.push(hc);
        };
        return hr;
    }

    var gridCount = function() {
        var t = 0;
        for(r=0; r<9; r++) 
            for(c=1; c<9; c++) 
                if(grid[c][r]>0) t++;
        return t;
    }

    var nextEmpty = function() {
        for(var c=0; c<9; c++) {
            for(var r=0; r<9; r++) {
                if(parseInt(grid[r][c])==0) 
                    return { row: r, col: c};
            }
        }
        return {row: -1, col: -1};
    }   

    var checkGrid = function(prow,pcol, num) {
        for (var sh = 0; sh < 9; sh++) {     
            if (grid[prow][sh] == num) return false;
            if (grid[sh][pcol] == num) return false;
        }    
        var row = Math.floor(prow / 3) * 3;
        var col = Math.floor(pcol / 3) * 3;
        for (var r = 0; r < 3; r++) 
            for (var c = 0; c < 3; c++) 
                if (grid[row + r][col + c] == num)
                    return false;
        return true;
    }

    grid = generateEmpty();
    if(original) grid = arr_copy(original);

    var methods  = { 
        rnd: function(n) {
            return getRandomNumber(n);
        },
        setGrid: function(g) {
            grid = arr_copy(g);
        },    
        getGrid: function() {
            return arr_copy(grid);
        },
        mix: function(gadded) {
            var g2 = gadded.getGrid();
            for(var c=0; c<9; c++) 
                for(var r=0; r<9; r++) 
                    if(parseInt(grid[c][r])==0 && parseInt(g2[c][r])>0) 
                        grid[c][r]=n2;
            return true;
        },
        empty: function() {
            grid = generateEmpty();
            return true;
        },
        removeRandom: function(max) {            
            var n = (max) ? max : 1;
            var valid = [];
            var rr,rc;
            for(var r=0; r<9; r++)
                for(var c=0; c<9; c++) 
                    if(grid[r][c]>0) 
                        valid.push({row: r, col: c});                
            while(valid.length>0 && valid.length>n) { // removing O(n)
                var pos = getRandomNumber(valid.length);
                grid[valid[pos].row][valid[pos].col] = 0;
                valid.splice(pos,1);
            }
            return valid.length;

        },        
        addRandom: function(maxnum) {
            var valid = [];
            var n,rr,rc,pos;
            var failsafe = 0;
            var max = maxnum ? maxnum : 1;
            for(var r=0; r<9; r++)
                for(var c=0; c<9; c++) 
                    if(grid[r][c] == 0) 
                        valid.push({row: r, col: c});   
            while(valid.length>0 && max>0 && failsafe<3000) {                
                do {
                    n = getRandomNumber() + 1;
                    pos = getRandomNumber(valid.length);
                } while(!checkGrid(valid[pos].row,valid[pos].col,n) && failsafe<3000);
                if(failsafe<3000) {
                    grid[valid[pos].row][valid[pos].col] = n;
                    valid.splice(pos,1);
                    max--;
                }
            }
            return true;
        },
        getDispersion: function() {
            var disp = 0;
            for(r=0; r<9; r++) 
                for(c=1; c<9; c++) {
                    if(grid[c][r]==0 && grid[c-1][r]==0) disp++;
                    if(grid[r][c]==0 && grid[r][c-1]==0) disp++;
                }  
            return disp/18;
        },
        count: function() {
           return gridCount();
        },
        solve: function(){
            steps = 0;
            // var failsafe = 0;
            var solveGrid = function() {
                // failsafe++;
                var cell = nextEmpty();
                if (cell.row == -1) return true;
                for (var num = 1; num <= 9; num++) {
                    if (checkGrid(cell.row, cell.col, num) ) {                           
                        //if(n==2000 || failsafe>8000) return false;
                        grid[cell.row][cell.col] = num;
                        steps++;
                        if (solveGrid()) return true;
                        grid[cell.row][cell.col] = 0;
                        steps--;
                    }
                }
                return false; // trigger back
            };        
            return solveGrid();
        },
        display: function() {
            console.log(grid);
        }
    }
    return methods;
}


var MAIN = (function(){
    var grid,partial,disp,c;
    grid = new GeneticSudoku();
    var minclue = 28;
    var maxclue = 35;
    do {
        do {
            grid.empty();
            grid.addRandom(25);
            var d = grid.getDispersion();
            var partial;    
            if(grid.solve()) {
                grid.removeRandom(minclue + grid.rnd(maxclue-minclue));
                partial = grid.getGrid();
            };          
        }while(!grid.solve());
        console.log("candidate found");
        grid.setGrid(partial);    
        disp = grid.getDispersion();
    } while(disp>=10);
    c = grid.count();
    grid.display();        
    console.log("dispersion: " + disp,"count: " + c);
})();


