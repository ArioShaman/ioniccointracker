import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Events } from 'ionic-angular';
// import { Ticker } from '../../models/ticker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiProvider]
})
export class HomePage {

  public tickers:Array<any> = [];
  public start:number = 0;
  public limit:number = 4;
  public currentCount = this.limit;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider
  ) {
  }


  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      // duration: 1000
    });
    loading.present();
    this.apiProvider.get('ticker/?structure=array&start='+this.start+'&limit='+this.limit).subscribe(
      res => {
        this.tickers = res['data'];
        loading.dismiss();
      }
    );
  }
  public show(){
    console.log(this.tickers);
  }
  public open(ticker){
    console.log(ticker);
  }

  public yet(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      // content: '<ion-spinner name="default"></ion-spinner>',
      duration: 1000
    });

    this.start += this.limit;
    this.currentCount += this.limit;
    this.apiProvider.get('ticker/?structure=array&start='+this.start+'&limit='+this.limit).subscribe(
      res => {
        for(let key in res['data']){
          this.tickers.push(res['data'][key]);
        }
      });
    loading.present();    
  }

  doRefresh(refresher) {

    this.apiProvider.get('ticker/?structure=array&start=0&limit='+this.currentCount).subscribe(
      res => {       
        this.tickers = res['data'];
        setTimeout(() => {
          refresher.complete();
        }, 1000);
        
      }
    );
  }
  doPulling(puller){
    console.log('pull')
  }


  move(event) {
    console.log(event);
  }  
}
