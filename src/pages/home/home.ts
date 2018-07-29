import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
// import { trigger, style, transition, animate, group, state} from '@angular/animations';
// import { Events } from 'ionic-angular';
// import { Ticker } from '../../models/ticker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiProvider],
})
export class HomePage {

  public tickers:Array<any> = [];
  public start:number = 0;
  public limit:number = 3;
  public currentCount = this.limit;
  public page = 'all';
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
        for(let ticker of this.tickers){
          ticker["state"]="inactive";
        }
        loading.dismiss();
        let time = 0;
        for(let ticker of this.tickers){
          setTimeout(function(){
            ticker["state"]="active"
          }, time+=300);
        }        
      }
    );
  }
  public open(ticker){
    // console.log(ticker);
    console.log('click');
  }

  public move(event){
    console.log(event);
  }
  public addToBest(ticker){
    // ticker['state'] =  ticker['state'] == 'inactive' ? 'active':'inactive';
    console.log('double click');
  }

  public yet(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      // content: '<ion-spinner name="default"></ion-spinner>',
      duration: 100
    });

    this.start += this.limit;
    this.currentCount += this.limit;
    this.apiProvider.get('ticker/?structure=array&start='+this.start+'&limit='+this.limit).subscribe(
      res => {
       let time = 0;        
        for(let key in res['data']){
          let ticker = res['data'][key];
          ticker['state'] = 'inactive';
          this.tickers.push(ticker);
          setTimeout(function(){
            ticker["state"]="active"
          }, time+=300);          
        }
      });
    loading.present();    
  }

  doRefresh(refresher) {
    this.apiProvider.get('ticker/?structure=array&start=0&limit='+this.currentCount).subscribe(
      res => {       
        this.tickers = res['data'];
        for(let ticker of this.tickers){
          ticker["state"]="inactive";
        }
        let time = 0;
        for(let ticker of this.tickers){
          setTimeout(function(){
            ticker["state"]="active"
          }, time+=300);
        } 
        setTimeout(() => {
          refresher.complete();
        }, 1000);
        
      }
    );
  }

}
