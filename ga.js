// function cariPrediksi(){
    var nameStock =  document.getElementById("nameStock").value;
    var data = dataSelection()
    var dataTarget = getFirstDayInOneMonth(data, '03', '2020')

    var dataTrain = getAllDataInOneMonth(data, '01', '2020')

    var dataSecondMonth = getAllDataInOneMonth(data, '02', '2020')

    for(var i = 0; i < dataSecondMonth.length; i++) {
      dataTrain.push(dataSecondMonth[i])
      if(dataTrain.length == 30) break
    }

    var kromosom = init()
    var iterasi = 10
    var threshold = 5.0
    var best_chromosome = []
    var temp = kromosom
    for(var i = 0;; i++) {
      // console.log("Generation 1")
      // console.log("Hasil Generation 1")
      kromosom = selection(kromosom, dataTrain, dataTarget)
      kromosom = crossover(kromosom)
      kromosom = mutation(kromosom)
      // console.log("Generation 2")
      // console.log(kromosom)
      // console.log("Hasil Generation 2")
      var res = getPredictedPrice(kromosom, dataTrain, dataTarget)
      console.log(i + ' --> ' + res + ' --> ' + parseFloat(dataTarget['4. close']))
      if(Math.abs(res - parseFloat(dataTarget['4. close'])) < threshold) {
        best_chromosome = kromosom
        break
      }
    }
    console.log("Iterasi = " + i)
    console.log("Res = " + getPredictedPrice(kromosom, dataTrain, dataTarget))
    console.log(best_chromosome)

    // TO DO: 
    // - coba predik harga 1 april pake data bulan maret dgn best_chromosome (jul)
    // - hosting di herokuapp (jul)
    // - mobile dev (jul)

    // END OF MAINNNNNNNNNNNNNNNNNNNNNN
    // --------------------------------------------------------------------------
    // FUNCTIONNNNNNNNNNNNNNNNNNNNNNNNN

    function getPredictedPrice(kromosom, data, dataTarget) {
      var fitnessScore = 0.0;
      var totalPopulation = kromosom.length
      var prediksi = 0
      for(var i = 0; i < totalPopulation; i++) {
        var hasil = parseFloat(kromosom[i][0])*SMA(data) + 
                    parseFloat(kromosom[i][1])*EMA(data,30) + 
                    parseFloat(kromosom[i][2])*BB(data) +
                    parseFloat(kromosom[i][3])*RSI(data) +
                    parseFloat(kromosom[i][4])*MACD(data)
        prediksi += hasil
        fitnessScore += Math.abs(hasil - parseFloat(dataTarget['4. close']))
      }
      fitnessScore /= totalPopulation
      prediksi /= totalPopulation
      return prediksi;
    }

    function init() {
      var counter = 0
      var totalPopulation = 20
      var population = new Array(totalPopulation)
      for(var i = 0; i < totalPopulation; i++) {
        population[i] = []
      }
      for(var i = 0; i < totalPopulation; i++) {
          var sum = 0
          var genes = []
          for(var j = 0; j < 5; j++) { 
            // ada 5 indikator, jadi 5 loop
            var rand = Math.floor(Math.random() * 100)
            sum += rand
            genes[j] = rand
          }
          for(var j = 0; j < 5; j++) {
            genes[j] /= sum
            genes[j] = genes[j].toFixed(4)
          }
          population[counter++] = genes;
      }
      return population;
    }

    function numToString(day) {
      if(day < 10) {
        return '0' + day.toString()
      } else {
        return day.toString()
      }
    }

    function getFirstDayInOneMonth(data, month, year) {
      var result
      var param1 = 'Time Series (Daily)'
      var day = 1
      var param2 = year + '-' + month + '-' + numToString(day)
      while(!data[param1][param2]) {
        day++
        param2 = year + '-' + month + '-' + numToString(day)
      }
      result = data[param1][param2]
      return result
    }

    function getAllDataInOneMonth(data, month, year) {
      var result = []
      var param1 = 'Time Series (Daily)'
      var day = 1
      var param2
      while(day < 32) {
        param2 = year + '-' + month + '-' + numToString(day)
        if(data[param1][param2]) {
          var temp = data[param1][param2]
          temp['date'] = param2
          result.push(data[param1][param2])
        }
        day++
      }
      return result
    }

    function SMA(data) {
      var res = 0.0;
      var period = data.length;
      for(var i = 0; i < period; i++) {
        res += parseFloat(data[i]['4. close'])
      }
      return res / period;
    }

    function EMA(data, period) {
      var res = 0.0
      var k = 2/(period +1)
      for(var i = 0; i < period; i++) {
        if(res == 0) {
          res = (parseFloat(data[i]['4. close'])  * k + (SMA(data) * (1 - k)))
        }
        else {
          res = (parseFloat(data[i]['4. close']) * k +( res * (1 - k)))
        }
      }
      return res
    }

    function BB(data) {
      var res = 0.0
      const D = 2
      const period = 20
      var middleBand = SMA(data)

      for(var i = 0; i < period; i++) {
        res = Math.pow(parseFloat(data[i]['4. close']) - middleBand, 2)
      }
      res /= period
      var upperBand = middleBand + (D * res)
      var lowerBand = middleBand - (D * res)
      return upperBand
    }

    function RSI(data){
      var RSI;
      var RSup = 0;
      var RSdown = 0;
      var AvgUpClose = 0;
      var AvgDownClose = 0;
      var countUp = 0;
      var countDown = 0;
      var n = data.length
      for(var i = 1; i<n; i++){
        if(parseFloat(data[i-1]['4. close']) < parseFloat(data[i]['4. close']))
        {
          RSup += parseFloat(data[i]['4. close']);
          countUp++;
        }
        else
        {
          RSdown += parseFloat(data[i]['4. close']);
          countDown++;
        }
      }
      avgUpClose = RSup / countUp;
      avgDownClose = RSdown / countDown;
    
      RSI = 100-(100/(1+(avgUpClose/avgDownClose)));
      return RSI
    }

    function MACD(data){
      var res=0.0;
      res += (EMA(data, 12)-(EMA(data,26)));
      return res;
    }

    function dataSelection() {
      var data
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //var data = JSON.parse(this.responseText);
                    data = JSON.parse(this.responseText)
                    ////return data.coord
                }
            };
        // xmlhttp.open("GET","https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="+nameStock+"&apikey=DVBV7U5PAU4WVL8M",false);
         xmlhttp.open("GET","https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=BBCA&apikey=DVBV7U5PAU4WVL8M",false);
        xmlhttp.responseType = 'json'
        xmlhttp.send();
      return data
      // alert(data[0])
      // return data;
    }

    function fitness(gen, data, dataTarget) {
      var hasil = parseFloat(gen[0])*SMA(data) + 
                  parseFloat(gen[1])*EMA(data,30) + 
                  parseFloat(gen[2])*BB(data) +
                  parseFloat(gen[3])*RSI(data) +
                  parseFloat(gen[4])*MACD(data)
      var fitnessScore = 0.0;
      
      fitnessScore += Math.abs(hasil - parseFloat(dataTarget['4. close']))
      
      return fitnessScore; 
    }

    function selection(kromosom, data, dataTarget) {
      var selected = [];
      var totalFitness = 0.0
      var i, j

      for(i = 0; i < kromosom.length; i++) {
        totalFitness += 1 / fitness(kromosom[i], data, dataTarget);
      }
      
      for(i = 0; i < kromosom.length; i++) { // probabilitas
        selected[i] = (1 / fitness(kromosom[i], data, dataTarget)) / totalFitness;
      }

      for(i = 1; i < kromosom.length; i++) { // kumulatif probabilitas
        selected[i] += selected[i-1]
      }

      selected[kromosom.length - 1] = 1.0 // jaga" klo sum ngga 1

      var new_chromosome = []

      for(i = 0; i < kromosom.length; i++) {
        var rand = Math.random();
        var idx = 0;
        for(j = 0; j < selected.length; j++) {
          if(rand < selected[j]) {
            new_chromosome[i] = kromosom[j]
            break
          }
        }
      }
      return new_chromosome
    }

    function crossover(kromosom) {
      var COB = 0.25; //CrossOverProbability
      var position = [];
      var count=0;
      for(i = 0;i < kromosom.length; i++)
      {
        var rand = Math.random();
        if(rand < COB)
        {
          position[count] = i;
          count++;
        }
        else {
          position[count] = -1
        }
      }
      var COP = []; //CrossOverPosition
      for(i = 0;i < count; i++)
      {
        COP[i] = Math.floor(Math.random() * (kromosom[0].length)) + 1
      }
      var offSpring = new Array(count)
      for(var i = 0; i < count; i++) {
        offSpring[i] = []
      }
      
      for (i = 0; i < count; i++) {
        var pos = position[i]
        var now = kromosom[i]
        var next = kromosom[(i+1)%kromosom.length]
        for(j = 0; j < 5; j++) {
          if(j < COP[i]) {
            offSpring[i].push(now[j])
          } else {
            offSpring[i].push(next[j])
          }
        }
      }

      var new_chromosome = new Array(kromosom.length);
      for(i = 0; i < kromosom.length; i++)
      {
        if(i == position[i])
        {
          new_chromosome[i] = offSpring[i];
        }
        else
        {
          new_chromosome[i] = kromosom[i];
        }
      }

      return new_chromosome
    }

    function mutation(kromosom) {
      var MR = 0.2;
      var total = kromosom.length
      var totalGen = kromosom.length * 5;
      var jumlahMutasi = Math.floor(MR * totalGen);
      var done = new Array(totalGen + 5)
      var genMutasi = []

      while(jumlahMutasi--) {
        var rand = Math.floor(Math.random() * totalGen)
        if(done[rand] == 1) {
          jumlahMutasi++
        } else {
          done[rand] = 1
          genMutasi.push(rand)
        }
      }
    //rulseny SMA(10) ama SMA(30) dibandingin lalu kalo nilai SMA(10day) == SMA(30day), liat nilai SMA(10 day). Klo nilai lbh tinggi dr pd yg sm itu, jdny bakal naik. kalo nilai lbh rendah jd bakal turun, EMA carany sama, MACD sama,  
      var size = genMutasi.length 
      mutated = new Array(kromosom.length + 5)
      for(var i = 0; i < kromosom.length; i++) {
        mutated[i] = []
      }
      for(i = 0; i < size; i++) {
        // kromosom[genMutasi[i]/5][genMutasi[i]%5] = Math.random();
        var row = Math.floor(genMutasi[i] / 5)
        var col = genMutasi[i] % 5
        mutated[row].push(col)
      }
      for(i = 0; i < total; i++) {
        if(mutated[i].length < 2) continue;
        var sum = 0
        var sumRand = 0
        for(j = 0; j < mutated[i].length; j++) {
          var rand = Math.floor(Math.random() * 100)
          sumRand += rand
          sum += parseFloat(kromosom[i][mutated[i][j]])
          kromosom[i][mutated[i][j]] = rand
        }
        for(j = 0; j < mutated[i].length; j++) {
          kromosom[i][mutated[i][j]] /= sumRand
          kromosom[i][mutated[i][j]] *= sum
          kromosom[i][mutated[i][j]] = kromosom[i][mutated[i][j]].toFixed(4)
        }
      }

      return kromosom
    }
     document.getElementById('hasilPrediksi').innerHTML = best_chromosome;
// }
