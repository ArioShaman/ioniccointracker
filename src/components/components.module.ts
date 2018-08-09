import { LineChartComponent } from './line-chart/line-chart';
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { MyApp } from '../app/app.component';

@NgModule({
	declarations: [
    LineChartComponent
  ],
	imports: [
		AmChartsModule,
		BrowserModule,
		FormsModule,
    IonicModule.forRoot(MyApp)
	],
	exports: [
    LineChartComponent
  ]
})
export class ComponentsModule {}
