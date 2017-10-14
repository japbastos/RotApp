  function drawLineChart() {
    var url = "https://rpmreadapi.herokuapp.com/reads";

    var jsonData = $.ajax({
      url: url,
      dataType: 'json',
    }).done(function(results){

      var motors = {};

      results.forEach(function(read) {
        if(motors[read.motor_number] == null)
          motors[read.motor_number]= [];

        motors[read.motor_number].push(read);
      });

      var datasets = [];
      var datasets2 = [];

      Object.keys(motors).forEach(function(currentKey) {

        var voltages = {};
        var data = [];
        var data2 = [];

        motors[currentKey].forEach(function(read) {
          if(voltages[read.voltage] == null){
            voltages[read.voltage] = {};
            voltages[read.voltage]["rpm_indutive"] = [];
            voltages[read.voltage]["rpm_optic"]   = [];
          }

          voltages[read.voltage]["rpm_indutive"].push(read.rpm_indutivo);
          voltages[read.voltage]["rpm_optic"].push(read.rpm_optico);
        });

        // Calculates the mean of RPM in a voltage
        Object.keys(voltages).forEach(function(voltage) {
          var sum = voltages[voltage]["rpm_indutive"].reduce(add, 0);
          voltages[voltage]["rpm_indutive"] = sum / voltages[voltage]["rpm_indutive"].length;

          sum = voltages[voltage]["rpm_optic"].reduce(add, 0);
          voltages[voltage]["rpm_optic"] = sum / voltages[voltage]["rpm_optic"].length;
        });

        Object.keys(voltages).forEach(function(voltage) {
          if(voltage == 3.3){
            data[0] = voltages[voltage]["rpm_indutive"];
            data2[0] = voltages[voltage]["rpm_optic"];
        }
          else if (voltage == 5){
            data[1] = voltages[voltage]["rpm_indutive"];
            data2[1] = voltages[voltage]["rpm_optic"];
        }
          else if (voltage == 9){
            data[2] = voltages[voltage]["rpm_indutive"];
            data2[2] = voltages[voltage]["rpm_optic"];
        }
          else if (voltage == 12){
            data[3] = voltages[voltage]["rpm_indutive"];
            data2[3] = voltages[voltage]["rpm_optic"];
        }
          else{
            data[4] = voltages[voltage]["rpm_indutive"];
            data2[4] = voltages[voltage]["rpm_optic"];
        }
        });

        console.log("aqui " + data2);

        let color = 'rgb(' + Math.floor(Math.random() * 1000 % 255) + ', ' + Math.floor(Math.random() * 1000 % 255) +  ', '+ Math.floor(Math.random() * 1000 % 255) +')';

        var dataset = {
          label           : 'Motor ' + currentKey,
          fill            : false,
          backgroundColor : color,
          borderColor     : color,
          data            : data
        };

        var dataset2 = {
          label           : 'Motor ' + currentKey,
          fill            : false,
          backgroundColor : color,
          borderColor     : color,
          data            : data2
        };


        console.log(dataset);

        datasets.push(dataset);
        datasets2.push(dataset2);
      });

      // Create the chart.js data structure
      var config = {
        // The type of chart we want to create
        type: 'line',
        data: {
          labels : ["3.3 V", "5 V", "9 V", "12 V", "24 V"],
          datasets : datasets
        },
        options: {
            legend: {
                display: true,
                position: 'right'
            },
            title: {
                display: true,
                text: 'Sensor Indutivo',
                fontSize: 20
            },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
              scaleLabel: {
                display: true,
                labelString: 'RPM'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Tensão'
              }
            }]
          },
        }
      };
      // Create the chart.js data structure
      var config2 = {
        // The type of chart we want to create
        type: 'line',
        data: {
          labels : ["3.3 V", "5 V", "9 V", "12 V", "24 V"],
          datasets : datasets2
        },
        options: {
            legend: {
                display: true,
                position: 'right'
            },
            title: {
                display: true,
                text: 'Sensor Óptico',
                fontSize: 20
            },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero:true
              },
              scaleLabel: {
                display: true,
                labelString: 'RPM'
              }
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Tensão'
              }
            }]
          },
        }
      };
      // Get the context of the canvas element we want to select
      var ctx = document.getElementById("myCanvas").getContext("2d");
      var ctx2 = document.getElementById("myCanvas2").getContext("2d");

      // Instantiate a new chart
      var myLineChart = new Chart(ctx, config);
      var myLineChart2 = new Chart(ctx2, config2);
    });
  }

  // To use with reduce
  function add(a, b) {
      return a + b;
  }

  drawLineChart();
