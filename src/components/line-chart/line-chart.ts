import { Component, Input } from '@angular/core';
import { AmChartsService, AmChart } from "@amcharts/amcharts3-angular";
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'line-chart',
  templateUrl: 'line-chart.html'
})
export class LineChartComponent {

  public chart: AmChart;

  public daysLineChartData:   Array<any>;
  public monthLineChartData:  Array<any>;
  public yearsLineChartData:  Array<any>;
  public kindData: string = 'days';
  @Input() activeCoin:string;

  constructor(public AmCharts: AmChartsService,
              public api: ApiProvider,
  ) {

  }

  ngOnInit() {
    console.log(this.activeCoin);
    this.daysData();
    // console.log(this.ng);
  }

  onSegmentChanged(event) {
    switch(event.value) {
       case 'days': {
          this.daysData();
          break;
       }
       case 'month': {
         console.log('month');
          break;
       }
       case 'year':{
         console.log('year');
         break;
       }
       default: {
          this.daysData();
          break;
       }
    }
  }

  public daysData():void{
    if(this.activeCoin){
        this.api.get('data/histoday?fsym=' + this.activeCoin + '&tsym=USD&limit=30&aggregate=1&e=CCCAGG', 'second').subscribe(
          res => {
            this.daysLineChartData = res['Data'];
            for(let dayData of this.daysLineChartData){
              let date = new Date(dayData['time']*1000);
              console.log(date);
              var year = date.getFullYear();
              var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
              console.log(month );
              var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
              dayData['date'] = year + '-' + month + '-' + day;
            }
            console.log(this.daysLineChartData);
            this.chart = this.AmCharts.makeChart( "chartdiv", {
              "type": "serial",
              "theme": "light",
              "dataDateFormat":"YYYY-MM-DD",
              "valueAxes": [ {
                "position": "left"
              } ],
              "graphs": [ {
                "id": "g1",
                "proCandlesticks": true,
                "balloonText": "Open:<b>[[open]]</b><br>Low:<b>[[low]]</b><br>High:<b>[[high]]</b><br>Close:<b>[[close]]</b><br>",
                "closeField": "close",
                "fillColors": "#7f8da9",
                "highField": "high",
                "lineColor": "#7f8da9",
                "lineAlpha": 1,
                "lowField": "low",
                "fillAlphas": 0.9,
                "negativeFillColors": "#db4c3c",
                "negativeLineColor": "#db4c3c",
                "openField": "open",
                "title": "Price:",
                "type": "candlestick",
                "valueField": "close"
              } ],
              "chartScrollbar": {
                "graph": "g1",
                "graphType": "line",
                "scrollbarHeight": 30
              },
              "chartCursor": {
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true
              },
              "categoryField": "date",
              "categoryAxis": {
                "parseDates": true
              },
              "dataProvider": this.daysLineChartData

            });
          },
          err => {
              console.log(err);
          }

        );
      }
    }

    public monthData():void{
      console.log('month');
    }
}
