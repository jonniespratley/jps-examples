// Code goes here

var HighchartDatatableDemo = {
	$report: $('#report'),
	/**
	 * I hold a reference to the table.
	 */
	myTable: null,
	/**
	 * I hold the table element id.
	 */
	myTableEl: '#table',
	/**
	 * I hold a reference to the chart.
	 */
	myChart: null,
	/**
	 * I hold the chart element id.
	 */
	myChartEl: '#chart',
	/**
	 * I hold the start date.
	 */
	startDate: null,
	/**
	 * I hold the end date.
	 */
	endDate: null,
	/**
	 * I am the table options
	 */
	tableOptions: {
		useFloater: false,
		aoColumns: [{
			'sTitle': 'Priority'
		}, {
			'sTitle': 'Machine'
		}, {
			'sTitle': 'Room'
		}, {
			'sTitle': 'Patient'
		}, {
			'sTitle': 'Responder',
			"mRender": function(data) {
				return '<a data-toggle="modal" href="#modal-responder" class="">' + data + '</a>';
			}
		}, {
			'sTitle': 'Created'
		}],
		aaData: null
	},
	/**
	 * I am the chart options
	 */
	chartOptions: {
		chart: {
			//renderTo: '#chart',
			defaultSeriesType: 'bar',
			events: {
				selection: function(event) {
					HighchartDatatableDemo.onSelection(event);
				},
				zoomType: 'x'
			},
			xAxis: {
				type: 'datetime',
				minRange: 7 * 24 * 3600 * 1000, // 7 days
				dateTimeLabelFormats: {
					month: '%b \'%y'
				},
				title: {
					text: null
				}
			},
			yAxis: {
				title: {
					text: 'Count'
				}
			},
			legend: {
				title: {
					text: 'Priority'
				}
			},
			series: [{
				name: 'Urgent',
				pointInterval: 30 * 24 * 3600 * 1000, // one month
				pointStart: Date.UTC(2009, 0, 01),
				data: [82, 59, 58, 55, 96, 75, 94, 99, 71, 57, 62, 90, 75, 89, 89, 66, 86, 88, 68, 73, 71, 75, 93, 99, 94, 87, 79, 35, 47, 86, 68, 94, 44, 91, 49, 40]
			}, {
				name: 'High',
				pointInterval: 30 * 24 * 3600 * 1000, // one month
				pointStart: Date.UTC(2010, 0, 01),
				data: [53, 73, 95, 85, 48, 38, 45, 92, 44, 72, 83, 49, 51, 62, 65, 80, 44, 84, 87, 100, 41, 100, 72, 59, 96, 66, 77, 65, 42, 37, 65, 60, 76, 60, 45, 90]
			}, {
				name: 'Low',
				pointInterval: 30 * 24 * 3600 * 1000, // one month
				pointStart: Date.UTC(2012, 0, 01),
				data: [96, 37, 96, 50, 98, 93, 90, 88, 68, 35, 77, 67, 49, 59, 38, 61, 56, 63, 76, 40, 83, 91, 71, 86, 84, 35, 92, 83, 96, 37, 36, 92, 40, 98, 41, 38]
			}]
		}
	},
	/**
	 * I handle initializing the chart and table.
	 */
	init: function() {
		var self = this;
		self.getData();
		//this.getChartData();

		self.myChart = $(self.myChartEl).highcharts(self.chartOptions);
		return this;
	},
	/**
	 * I handle getting the table data.
	 */
	getData: function() {
		var self = this;
		$.get('chart-data.json').done(function(data) {
			console.log('chart data', data);
			self.tableOptions.aaData = data.data;
			self.myTable = $(self.myTableEl).dataTable(self.tableOptions);
			self.myTable.fnRedraw();
		});
	},
	/**
	 * I handle getting the chart data.
	 */
	getChartData: function() {
		$.get('chart-data.json').done(function(data) {
			//console.log('chart data', data);
			//self.tableOptions.aaData = data.data;
		});
	},
	/**
	 * I handle the selection of the chart.
	 */
	onSelection: function(event) {
		if (event.xAxis) {
			// log the min and max of the primary, datetime x-axis
			HighchartDatatableDemo.startDate = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].min);
			HighchartDatatableDemo.endDate = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', event.xAxis[0].max);

			//Show date range
			HighchartDatatableDemo.$report.html(startDate + ' - ' + endDate);

			//Redraw table
			HighchartDatatableDemo.myTable.fnDraw();
		} else {
			HighchartDatatableDemo.$report.html('Selection reset');
		}
	}
};

/**
 * I handle  Custom filtering function which will filter data in column four
 * between two dates
 */
$.fn.dataTableExt.afnFiltering.push(function(oSettings, aData, iDataIndex) {
	// 7 here is the column where my dates are.
	var date = aData[5];
	var dateMin = HighchartDatatableDemo.startDate;
	var dateMax = HighchartDatatableDemo.endDate;

	// remove the time stamp out of my date
	// 2010-04-11 20:48:22 -> 2010-04-11
	date = date.substring(0, 10);
	// remove the "-" characters
	// 2010-04-11 -> 20100411
	date = date.substring(0, 4) + date.substring(5, 7) + date.substring(8, 10);

	// run through cases
	if (dateMin === "" && date <= dateMax) {
		return true;
	} else if (dateMin === "" && date <= dateMax) {
		return true;
	} else if (dateMin <= date && "" === dateMax) {
		return true;
	} else if (dateMin <= date && date <= dateMax) {
		return true;
	}
	return true;
});

$(document).ready(function() {
  $(HighchartDatatableDemo.myChartEl).highcharts(HighchartDatatableDemo.chartOptions);
	window.HighchartDatatableDemo = HighchartDatatableDemo.init();
});
