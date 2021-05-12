
var items = document.getElementById("items");
var prices = document.getElementById("prices");

items.addEventListener('input', function (event){
    var num_prices = prices.value;
    var num_items = items.value;
    if(num_prices && num_items){
        var cs = document.getElementById("constraint_set");
        cs.innerHTML = "<p> Enter Prices for each item. Each row is for a item and column is for prices</p> <br>";
        cs.style.visibility="visible";
        for(let i=0; i<num_items; i++){
            for(let j=0; j<num_prices; j++){
                let elem = document.createElement('input');
                // <input type="number" id="items" name="num_items" required value="1" min="1" max="10">
                elem.type = "number";
                elem.value = "12.0"
                elem.step = "0.01";
                elem.min = "0.0";
                elem.max = "100.0"
                elem.id = "ent_"+String(i)+String(j);
                elem.required;
                cs.appendChild(elem);
            }
            cs.appendChild(document.createElement('br'));
        }
    }

    if(num_items){
        var elas = document.getElementById("initial_elasticities");
        elas.innerHTML = "<p> Enter Elasticity for each item.</p> <br>";
        elas.style.visibility="visible";

        var dem = document.getElementById("initial_demands");
        dem.innerHTML = "<p> Enter Demands for each item.</p> <br>";
        dem.style.visibility="visible";

        var pri = document.getElementById("initial_prices");
        pri.innerHTML = "<p> Enter price for each item.</p> <br>";
        pri.style.visibility="visible";

        for(let i=0; i<num_items; i++){
            let elem = document.createElement('input');
            let elem2 = document.createElement('input');
            let elem3 = document.createElement('input');
                // <input type="number" id="items" name="num_items" required value="1" min="1" max="10">
            elem.type = "number";
            elem.value = "-2.33"
            elem.step = "0.001";
            elem.min = "-3";
            elem.max = "-1"
            elem.id = "elas_"+String(i);
            elem.required = true;
            elas.appendChild(elem);
            
            elem2.type = "number";
            elem2.step = "1";
            elem2.min = "1";
            elem2.max = "4";
            elem2.id = "dem_"+String(i);
            elem2.value = "2";
            elem2.required = true;
            dem.appendChild(elem2);

            elem3.type = "number";
            elem3.step = "0.01";
            elem3.min = "0.00";
            elem3.max = "100.0";
            elem3.id = "pri_"+String(i);
            elem3.value = "12.00";
            elem3.required = true;
            pri.appendChild(elem3);
        }

        elas.appendChild(document.createElement('br'));
        dem.appendChild(document.createElement('br'));
        pri.appendChild(document.createElement('br'));
    }
})

prices.addEventListener('input', function (event){
    var num_prices = prices.value;
    var num_items = items.value;
    if(num_prices && num_items){
        var cs = document.getElementById("constraint_set");
        cs.innerHTML = "<p> Enter Prices for each item. Each row is for a item and column is for prices</p> <br>"
        cs.style.visibility="visible";
        for(let i=0; i<num_items; i++){
            for(let j=0; j<num_prices; j++){
                let elem = document.createElement('input');
                // <input type="number" id="items" name="num_items" required value="1" min="1" max="10">
                elem.type = "number";
                elem.value = "12.0"
                elem.step = "0.01";
                elem.min = "0.0";
                elem.max = "100.0"
                elem.id = "ent_"+String(i)+String(j);
                elem.required;
                cs.appendChild(elem);
            }
            cs.appendChild(document.createElement('br'));
        }
    }
})

function createRequest(){
    var num_items = Number(items.value);
    var num_prices = Number(prices.value);
    var time_h = Number(document.getElementById("time_h").value);
    var noise_var = Number(document.getElementById("noise_var").value);
    var initial_elasts = [];
    var initial_demand = [];
    var initial_prices = [];
    var constraint_set = [];

    if(!num_items || !num_prices){
        alert("Please fill form correctly");
        return false;
    }
    for(let i=0; i<num_items; i++){
        
        if(!document.getElementById("dem_"+String(i)) || !document.getElementById("elas_"+String(i)) || !document.getElementById("pri_"+String(i))){
            alert("Please fill form correctly. Initial Constriants not filled or wrong.");
            return false;
        }

        var dem = Number(document.getElementById("dem_"+String(i)).value);
        var elas = Number(document.getElementById("elas_"+String(i)).value);
        var pri = Number(document.getElementById("pri_"+String(i)).value);
        
                  
        initial_demand.push(dem);
        initial_elasts.push(elas);
        initial_prices.push(pri);
        
    }

    for(let i=0; i<num_items; i++){
        var col = []
        for(let j=0; j<num_prices; j++){
            if(!document.getElementById("ent_"+String(i)+String(j))){
                alert("Please fill form correctly. Price Constriant Set not filled or empty");
                return false;
            }

            var ent = Number(document.getElementById("ent_"+String(i)+String(j)).value);
            col.push(ent);
        }
        constraint_set.push(col);
    }

    // create request object
    var req_object = new FormData();

    req_object.append("num_items", JSON.stringify(num_items));
    req_object.append("num_prices", JSON.stringify(num_prices));
    req_object.append("time_h", JSON.stringify(time_h));
    req_object.append("noise_var", JSON.stringify(noise_var));
    req_object.append("initial_demands", JSON.stringify(initial_demand));
    req_object.append("initial_prices", JSON.stringify(initial_prices));
    req_object.append("inital_elasticity", JSON.stringify(initial_elasts));
    req_object.append("constraint_set", JSON.stringify(constraint_set));

    var endpoint = '/api';
    $.ajax({
        url: endpoint,
        type: 'POST',
        data: {
            num_items: JSON.stringify(num_items),
            num_prices: JSON.stringify(num_prices),
            time_h: JSON.stringify(time_h),
            noise_var: JSON.stringify(noise_var),
            initial_demands: JSON.stringify(initial_demand),
            initial_prices: JSON.stringify(initial_prices),
            initial_elasticity: JSON.stringify(initial_elasts),
            constraint_set: JSON.stringify(constraint_set)
        },    
        success: function(data) {
            drawLineGraph(data, 'myChartline');
        },
        error: function(error_data) {
            console.log("Error")
        }
      });
    
}

function drawLineGraph(data, id) {
    var labels = data.labels;
    var chartLabel = data.chartLabel;
    var chartdata = data.chartdata;
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