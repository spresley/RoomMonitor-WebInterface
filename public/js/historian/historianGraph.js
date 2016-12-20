/*******************************************************************************
* Copyright (c) 2014 IBM Corporation and other Contributors.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
* IBM - Initial Contribution
*******************************************************************************/

var HistorianGraph = function(){

	this.palette = new Rickshaw.Color.Palette( { scheme: [
	        "#7f1c7d",
	 		"#00b2ef",
			"#00649d",
			"#00a6a0",
			"#ee3e96"
	    ] } );


	this.drawGraph = function(seriesData)
	{
		// instantiate our graph!

		this.graph = new Rickshaw.Graph( {
			element: document.getElementById("chart"),
			width: 900,
			height: 500,
			renderer: 'line',
			stroke: true,
			preserve: true,
			series: seriesData
		} );

		this.graph.render();

		this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: this.graph,
			xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}
		} );

		this.annotator = new Rickshaw.Graph.Annotate( {
			graph: this.graph,
			element: document.getElementById('timeline')
		} );

		this.legend = new Rickshaw.Graph.Legend( {
			graph: this.graph,
			element: document.getElementById('legend')

		} );

		this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: this.graph,
			legend: this.legend
		} );

		this.order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: this.graph,
			legend: this.legend
		} );

		this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: this.graph,
			legend: this.legend
		} );

		this.smoother = new Rickshaw.Graph.Smoother( {
			graph: this.graph,
			element: document.querySelector('#smoother')
		} );

		this.ticksTreatment = 'glow';

		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.graph,
			ticksTreatment: this.ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.xAxis.render();

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: this.ticksTreatment
		} );

		this.yAxis.render();


		this.controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: this.graph
		} );

	};

	this.displayHistChart = function(device,histData){
		console.log("displayHistChart enter")

		var seriesData = [];

		console.log("type of histdata:");
		console.log(typeof(histData));

		var data = histData;
		data.length = Object.keys(data).length // returns 5

		console.log("number hist data entries = %d", data.length );
		console.log(data);
		console.log("data[0]:");
		console.log(data[0]);

		seriesData[0]={};
		seriesData[0].name = 'Light Level';
		seriesData[0].color = this.palette.color();
		seriesData[0].data = [];
		seriesData[1]={};
		seriesData[1].name = 'Activity Level';
		seriesData[1].color = this.palette.color();
		seriesData[1].data = [];


		for (var i = 0; i<data.length; i++){
			seriesData[0].data[i]={};
			seriesData[0].data[i].x= Date.parse(data[i].value.payload.d.time_stamp)/1000;
			seriesData[0].data[i].y= data[i].value.payload.d.light_level;
			seriesData[1].data[i]={};
			seriesData[1].data[i].x= Date.parse(data[i].value.payload.d.time_stamp)/1000;
			seriesData[1].data[i].y= data[i].value.payload.d.activity_level;

		}

		var epoc = Date.parse(data[0].value.payload.d.time_stamp);
		var epocdate = Date(epoc);

		console.log("time stamp string: %s, epoc number:%d, back again: %s", data[0].value.payload.d.time_stamp, epoc, epocdate.toString())
		this.drawGraph(seriesData);

	};

};
