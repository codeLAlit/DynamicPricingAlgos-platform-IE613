
var prices = document.getElementById("prices");

prices.addEventListener('input', function (event){
    var num_prices = prices.value;
    
    if(num_prices){
        
        var pri = document.getElementById("initial_prices");
        pri.innerHTML = "<p> Enter price for each item.</p> <br>";
        pri.style.visibility="visible";

        for(let i=0; i<num_prices; i++){
            let elem3 = document.createElement('input');
                // <input type="number" id="prices" name="num_prices" required value="1" min="1" max="10">

            elem3.type = "number";
            elem3.step = "0.01";
            elem3.min = "0.00";
            elem3.max = "100.0";
            elem3.id = "pri_"+String(i);
            elem3.value = "12.00";
            elem3.required = true;
            pri.appendChild(elem3);
        }

        pri.appendChild(document.createElement('br'));
    }
})

function createRequest(){
    var num_prices = Number(prices.value);
    var time_h = Number(document.getElementById("time_h").value);
    var mu_max = Number(document.getElementById("mu_max").value);
    var initial_prices = [];
    var algo = document.getElementById("algos").value;
    if(!num_prices){
        alert("Please fill form correctly");
        return false;
    }
    for(let i=0; i<num_prices; i++){
        
        if(!document.getElementById("pri_"+String(i))){
            alert("Please fill form correctly. Initial Constriants not filled or wrong.");
            return false;
        }

        var pri = Number(document.getElementById("pri_"+String(i)).value);
        
        initial_prices.push(pri);
        
    }


    var endpoint = '/api2';
    $.ajax({
        url: endpoint,
        type: 'POST',
        data: {
            algo : JSON.stringify(algo),
            num_prices: JSON.stringify(num_prices),
            mu_max : JSON.stringify(mu_max),
            time_h: JSON.stringify(time_h),
            initial_prices: JSON.stringify(initial_prices),
        },    
        success: function(data) {
            drawLineGraph(data, data.chartdata, 'myChartline');
            //drawLineGraph(data, data.chartrevenue, 'myChartline_rev');
        },
        error: function(error_data) {
            console.log("Error")
        }
      });
    
}

function drawLineGraph(data, plotdata, id) {
    console.log(plotdata);
    var labels = data.labels;
    var chartLabel = data.chartLabel;
    var chartdata = plotdata;
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          backgroundColor: 'rgb(255, 100, 200)',
          borderColor: 'rgb(55, 99, 132)',
          data: chartdata,
        }]
      },

      // Configuration options go here
      options: {
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }

    });
  }

  function drawBarGraph(data, id) {
    var labels = data.labels;
    var chartLabel = data.chartLabel;
    var chartdata = data.chartdata;
    var ctx = document.getElementById(id).getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: chartdata,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }