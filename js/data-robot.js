$(function () {
	
	var mlp = []; // dataPoints
	var ctup = [];
	var clp = [];
	var alp = [];

	var chart = new CanvasJS.Chart("memoirelibre",{
		title :{
			text: "Donnees Robot"
		},	
		axisY: {
				title: "Releves",
		},		
		axisX: {
				title: "Temps (s)",
		},		
		toolTip: {
			shared: true,
			content: function(e){
				var body = new String;
				var head ;
				for (var i = 0; i < e.entries.length; i++){
					var  str = "<span style= 'color:"+e.entries[i].dataSeries.color + "'> " + e.entries[i].dataSeries.name + "</span>: <strong>"+  e.entries[i].dataPoint.y + "</strong>'' <br/>" ; 
					body = body.concat(str);
				}
				head = "<span style = 'color:DodgerBlue; '><strong>"+ (e.entries[0].dataPoint.label) + "</strong></span><br/>";

				return (head.concat(body));
			}
		},
		legend: {
				horizontalAlign :"center"
		},
		data: [{
			type: "spline",
			showInLegend: true,
			name: "Memoire Libre",
			dataPoints: mlp 
		},
		{
			type: "spline",
			showInLegend: true,
			name: "CPU Time Usage",
			dataPoints: ctup 
		},
		{
			type: "spline",
			showInLegend: true,
			name: "CPU Load",
			dataPoints: clp 
		},
		{
			type: "spline",
			showInLegend: true,
			name: "Average load",
			dataPoints: alp 
		}
		],
		legend :{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "Mesures :" || e.dataSeries.visible) {
				e.dataSeries.visible = false;
              }
              else{
				e.dataSeries.visible = true;
              }
              chart.render();
            }
        }
	});

	var xVal = 0;
	var yValMlp = 4000000000;	
	var yValCtup = 500000000;
	var yValClp = 0.02;
	var yValAlp = -1.0;
	var updateInterval = 5000;
	var dataLength = 10; // number of dataPoints visible at any point

	var updateChart = function () {
		
		$.post('Robotdata', {},
	        function(data,status){
	            yValMlp = data.freememory;
				yValCtup = data.cputimeusage;
				yValClp = data.cpuload;
				yValAlp = data.averageload;
	        }  
	    );
		mlp.push({
			x: xVal,
			y: yValMlp
		});
		ctup.push({
			x: xVal,
			y: yValCtup
		});
		clp.push({
			x: xVal,
			y: yValClp
		});
		alp.push({
			x: xVal,
			y: yValAlp
		});
		
		xVal++;

		if (mlp.length > dataLength)
		{
			mlp.shift();
			ctup.shift();
			clp.shift();
			alp.shift();
		}
		
		chart.render();		

	};

	// update chart after specified time. 
	setInterval(function(){updateChart();}, updateInterval); 

});