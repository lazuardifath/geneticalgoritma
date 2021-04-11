
//change number of generations
var Generations = 200;

//target array .. you can change it as you like
var targetArray = "1,2,3,4,5,6,7,8,0";

//starting Defenetions
var child1;
var child2;
var child3;
var child4;
var totalChildren = [];
var solutions;
var totalSolutions = 0;
var numberOfChildren;
var parent1 = [];
var parent2 = [];
var parent3 = [];
var parent4 = [];
var parent5 = [];
var parent6 = [];
var parent7 = [];
var parent8 = [];
var arrayHashmap = [];
var gen = 1;
var rand;

$(document).ready(function () {
    
    //we will take this array as a start
    var arr = [1, 2, 3, 4, 5, 6, 7, 8, 0];

    //then we will resort it randomly
    //so that this will be our starting array
    sortArray(arr);
    //show starting array graphically int the square 
    refreshSquare(arr);
    //then write to it to the log
    writeToLog("Starting From", arr, "array");

    //before we start .. first generation's children number will be between 2 - 4
    //so we will take only 2 children in this generation
    //we will make this manually untill we reach minimum child number of 8
    //because in our code we want the population to be 8 children to apply Genetic algorithm over them
    //first generation will produce 2 children (2 * the parent array)
    //second generation will produce 4 children (2 * 1.Generation children)
    //third generation will produce 8 children (2 * 2.Generation children)


    //starting of generation1
    writeToLog("Start of", "Generation " + gen, "gen");
    //empty totalChildren array from the last generation's children
    totalChildren = [];
    //by sending array .. this function return the children of it
    getChilds(arr);
    //after getting children .. check if there is any solutions
    //and calculate the fitness for each child 
    checkState();
    //write to log
    writeToLog("Solutions", solutions, "info");
    writeToLog("Number of Children", numberOfChildren, "info");
    //children number at least is 2


    //starting of generation2
    gen++;
    writeToLog("Start of", "Generation " + gen, "gen");
    totalChildren = [];
    getChilds(parent1);
    getChilds(parent2);
    checkState();
    writeToLog("Solutions", solutions, "info");
    writeToLog("Number of Children", numberOfChildren, "info");
    //children number at least is 4


     //starting of generation3
     gen++;
     writeToLog("Start of", "Generation " + gen, "gen");
     totalChildren = [];
     getChilds(parent1);
     getChilds(parent2);
     getChilds(parent3);
     getChilds(parent4);
     checkState();
     writeToLog("Solutions", solutions, "info");
     writeToLog("Number of Children", numberOfChildren, "info");
     //children number at least is 8


     //we reached for 8 children .. in the next generation we will not increase number of population (children)
     //and we will choose 8 children randomly and apply Genetic algorithm over them

    for (var start = 0; start < Generations - 3; start++) {
        gen++;
        crossover(parent5, parent6);
        crossover(parent7, parent8);
        refreshSquare(parent1, "cross1");
        refreshSquare(parent2, "cross2");
        rand = Math.floor(Math.random() * 1); // returns a random integer from 0 to 1
        if (rand == 0) {
            parent1 = mutation(parent1);
            parent3 = mutation(parent3);
            parent5 = mutation(parent5);
            parent7 = mutation(parent7);
        } else {
            parent2 = mutation(parent2);
            parent4 = mutation(parent4);
            parent6 = mutation(parent6);
            parent8 = mutation(parent8);
        }
        writeToLog("Start of", "Generation " + gen, "gen");
        totalChildren = [];
        getChilds(parent1);
        getChilds(parent2);
        getChilds(parent3);
        getChilds(parent4);
        getChilds(parent5);
        getChilds(parent6);
        getChilds(parent7);
        getChilds(parent8);
        checkState();
        writeToLog("Solutions", solutions, "info");
        writeToLog("Number of Children", numberOfChildren, "info");
    }

    //show tho total number of solutions
    writeToLog("total Solutions", totalSolutions, "info");

    function checkState() {
        numberOfChildren = 0;
        solutions = 0;
        arrayHashmap = [];

        for (var i = 0; i < totalChildren.length; i++) {
            for (var j = 0; j < 4; j++) {
                if (totalChildren[i][j]) {
                    numberOfChildren++;
                    arrayHashmap.push({child: totalChildren[i][j], fitness: fitness(totalChildren[i][j])});
                    writeToLog(numberOfChildren + ". child ", totalChildren[i][j], "array");
                    if (totalChildren[i][j].toString() == targetArray) {
                        solutions++;
                        totalSolutions++;
                    }
                }
            }
        }
        insertIntoTable(gen, solutions);
        arrayHashmap = arrayHashmap.sort(function(a, b) {
            return (a.fitness > b.fitness) ? 1 : ((b.fitness > a.fitness) ? -1 : 0)
        });
        parent1 = arrayHashmap[0].child;
        parent2 = arrayHashmap[1].child;
        if (totalChildren.length > 2) {
            parent3 = arrayHashmap[2].child;
            parent4 = arrayHashmap[3].child;
            parent5 = arrayHashmap[0].child;
            parent6 = arrayHashmap[1].child;
            parent7 = arrayHashmap[2].child;
            parent8 = arrayHashmap[3].child;
        } else {
            parent3 = arrayHashmap[0].child;
            parent4 = arrayHashmap[1].child;
        }
    }

    //get children of the array (possible moves)!
    function getChilds(data) {
        switch (spaceIndex(data)) {
            case 0:
                child1 = [data[1], data[0], data[2], data[3], data[4], data[5], data[6], data[7], data[8]];
                child2 = [data[3], data[1], data[2], data[0], data[4], data[5], data[6], data[7], data[8]];
                childs = [child1, child2];
                break;
            case 1:
                child1 = [data[1], data[0], data[2], data[3], data[4], data[5], data[6], data[7], data[8]];
                child2 = [data[0], data[2], data[1], data[3], data[4], data[5], data[6], data[7], data[8]];
                child3 = [data[0], data[4], data[2], data[3], data[1], data[5], data[6], data[7], data[8]];
                childs = [child1, child2, child3];
                break;
            case 2:
                child1 = [data[0], data[2], data[1], data[3], data[4], data[5], data[6], data[7], data[8]];
                child2 = [data[0], data[1], data[5], data[3], data[4], data[2], data[6], data[7], data[8]];
                childs = [child1, child2];
                break;
            case 3:
                child1 = [data[3], data[1], data[2], data[0], data[4], data[5], data[6], data[7], data[8]];
                child2 = [data[0], data[1], data[2], data[4], data[3], data[5], data[6], data[7], data[8]];
                child3 = [data[0], data[1], data[2], data[6], data[4], data[5], data[3], data[7], data[8]];
                childs = [child1, child2, child3];
                break;
            case 4:
                child1 = [data[0], data[4], data[2], data[3], data[1], data[5], data[6], data[7], data[8]];
                child2 = [data[0], data[1], data[2], data[4], data[3], data[5], data[6], data[7], data[8]];
                child3 = [data[0], data[1], data[2], data[3], data[5], data[4], data[6], data[7], data[8]];
                child4 = [data[0], data[1], data[2], data[3], data[7], data[5], data[6], data[4], data[8]];
                childs = [child1, child2, child3, child4];
                break;
            case 5:
                child1 = [data[0], data[1], data[5], data[3], data[4], data[2], data[6], data[7], data[8]];
                child2 = [data[0], data[1], data[2], data[3], data[5], data[4], data[6], data[7], data[8]];
                child3 = [data[0], data[1], data[2], data[3], data[4], data[8], data[6], data[7], data[5]];
                childs = [child1, child2, child3];
                break;
            case 6:
                child1 = [data[0], data[1], data[2], data[6], data[4], data[5], data[3], data[7], data[8]];
                child2 = [data[0], data[1], data[2], data[3], data[4], data[5], data[7], data[6], data[8]];
                childs = [child1, child2];
                break;
            case 7:
                child1 = [data[0], data[1], data[2], data[3], data[7], data[5], data[6], data[4], data[8]];
                child2 = [data[0], data[1], data[2], data[3], data[4], data[5], data[7], data[6], data[8]];
                child3 = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[8], data[7]];
                childs = [child1, child2, child3];
                break;
            case 8:
                child1 = [data[0], data[1], data[2], data[3], data[4], data[8], data[6], data[7], data[5]];
                child2 = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[8], data[7]];
                childs = [child1, child2];
                break;
        }
        totalChildren.push(childs);
    }
    
    // make mutation for an array by swapping 2 elements
    function mutation(data) {
        var x = Math.floor(Math.random() * 9);
        var y = Math.floor(Math.random() * 9);
        var temp = data[x];
        data[x] = data[y];
        data[y] = temp;
        return data;
    }

    // make crossover for 2 arrays
    function crossover(dataA, dataB) {
        var crossed1 = [dataB[0], dataB[1], dataB[2], dataB[3], dataA[4], dataA[5], dataA[6], dataA[7], dataA[8]];
        var crossed2 = [dataA[0], dataA[1], dataA[2], dataA[3], dataB[4], dataB[5], dataB[6], dataB[7], dataB[8]];
        parent1 = checkCrossOver(crossed1);
        parent2 = checkCrossOver(crossed2);
    }

    //due to crossover process .. some numbers may be missing or repeated in the result array 
    function checkCrossOver(data) {
        var missing = [];
        var indexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        for (var i = 0; i < 9; i++) {
            if (data.indexOf(i) > -1) {
                indexes[data.indexOf(i)] = -1;
            } else {
                missing.push(i);
            }
        }
        while (indexes.indexOf(-1) > -1) {
            indexes.splice(indexes.indexOf(-1), 1);
        }
        while (missing.length > 0) {
            data[indexes[0]] = missing[0];
            missing.splice(0, 1);
            indexes.splice(0, 1);
        }
        return data;
    }

    //find the index of the space tile
    function spaceIndex(data) {
        return data.indexOf(0);
    }

    //random sort
    function sortArray(data) {
        data.sort(function (a, b) {
            return 0.5 - Math.random()
        });
        return data;
    }

    //calculate the overall fitness value for an array
    function fitness(data) {
        var x, y;
        var sum = 0;
        x = getCoordinates(data.indexOf(1));
        y = getCoordinates(0);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(2));
        y = getCoordinates(1);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(3));
        y = getCoordinates(2);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(4));
        y = getCoordinates(3);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(5));
        y = getCoordinates(4);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(6));
        y = getCoordinates(5);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(7));
        y = getCoordinates(6);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(8));
        y = getCoordinates(7);
        sum += calcDistance(x, y);
        x = getCoordinates(data.indexOf(0));
        y = getCoordinates(8);
        sum += calcDistance(x, y);
        return sum;
    }

    //get coordinates of the index
    function getCoordinates(data) {
        switch (data) {
            case 0:
                return [-1, 1];
                break;
            case 1:
                return [0, 1];
                break;
            case 2:
                return [1, 1];
                break;
            case 3:
                return [-1, 0];
                break;
            case 4:
                return [0, 0];
                break;
            case 5:
                return [1, 0];
                break;
            case 6:
                return [-1, -1];
                break;
            case 7:
                return [0, -1];
                break;
            case 8:
                return [1, -1];
                break;
        }
    }

    //calculate Manhatten distance
    //it equales the number of moves that a tile must do to be in the right place
    function calcDistance(dataA, dataB) {
        var distance = Math.abs(dataA[0] - dataB[0]) + Math.abs(dataA[1] - dataB[1]);
        return distance;
    }

    //write into log
    function writeToLog(dataName, data, type) {
        $("#info").append('<p class="text-muted">' + dataName + ':	<span class="' + type + '">' + data + '</span></p>');
    }

    //refresh square
    function refreshSquare(data) {
        for (var i = 0; i < 9; i++) {
            $("#index-" + i).text(data[i]);
        }
        $("#array").text("[" + data + "]");
    }

    function insertIntoTable(genData, solData) {
        $("#tableBody").append("<tr><td>Generation " + genData + "</td><td>" + solData + "</td></tr>");
    }

    //scroll to end of log
    $(function () {
        var log = $('#log');
        var endOfLog = log[0].scrollHeight;
        log.scrollTop(endOfLog);
    });
});