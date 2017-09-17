import { Injectable } from '@angular/core';

let Chart = require('chart.js');

Chart.defaults.global.responsive = true;
Chart.defaults.global.maintainAspectRatio = true;
Chart.defaults.global.tooltips.bodySpacing = 4;

Chart.plugins.register({
  beforeDraw: function(chartInstance: any) {
    var ctx = chartInstance.chart.ctx;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
  }
});

const lineChartOptions = {
  responsive: true,
  title: {
    display: true,
    text: 'Chart'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    position: 'nearest'
  },
  hover: {
    mode: 'nearest',
    intersect: true
  }
};

@Injectable()
class ChartService {
  public chart: any;
  public lineChartOptions: any;

  constructor() {
    this.chart = Chart;
    this.lineChartOptions = lineChartOptions;
  }
}

export {
  ChartService
};
