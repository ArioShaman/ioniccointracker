import { Component } from '@angular/core';
import { NavController, LoadingController} from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { CacheService } from 'ng2-cache';
// import { Ticker } from '../../models/ticker';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiProvider],
})

export class HomePage {

  public tickers:             Array<any>;// = [];
  public bestTickers:         Array<any>;// = [];
  public start:number                 = 0;
  public limit:number                 = 3;
  public currentCount                 = this.limit;
  public page = 'all';
  public date:                Date;
  public opened:              boolean = false;
  public openedTicker:        Object;


  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              private apiProvider: ApiProvider,
              private cache:CacheService,
  ) {
    this.bestTickers = this.cache.get('bestTickers') ? this.cache.get('bestTickers') : [];
  }


  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      // duration: 1000
    });
    loading.present();
    this.tickers = this.cache.get('tickers') ? this.cache.get('tickers') : [];
    console.log(this.tickers)
    if(this.tickers.length == 0){
      this.apiProvider.get('ticker/?structure=array&start='+this.start+'&limit='+this.limit).subscribe(
        res => {
          this.date = res['metadata']['timestamp'];
          this.cache.set('lastUpdate', this.date);
          this.tickers = res['data'];
          for(let ticker of this.tickers){
            ticker["shared"] = false;
            ticker["opened"] = false;
            ticker["state"]= "inactive";
            for(let best of this.bestTickers){
                if(ticker['id'] == best['id']){
                  ticker['shared'] = true;
                }
            }
          }
          let time = 0;
          for(let ticker of this.tickers){
            setTimeout(function(){
              ticker["state"]="active";
            }, time+=300);
          }
          this.cache.set('tickers', this.tickers);
          loading.dismiss();

        }

      );
    }else{
      loading.dismiss();
      console.log('load');
      this.date = this.cache.get('lastUpdate');
      // this.openedTicker = this.tickers[0];
    }
    let time = 0;
    for(let ticker of this.tickers){
      ticker["state"]="inactive";
      setTimeout(function(){
        ticker["state"]="active";
      }, time+=300);
    }
  }
  public open(ticker){
    this.opened = true;
    this.openedTicker = ticker;
    for(let listel of this.tickers){
      if(ticker != listel){
        listel["opened"] = false;
      }
    }
    ticker["opened"] = !ticker["opened"];
    // console.log(this.openedTicker);
  }

  public close(ticker){
    this.opened = false;
    ticker["opened"] = false;
    this.openedTicker = undefined;
  }
  public move(event){
    console.log(event);
  }
  public share(ticker){
    ticker['shared'] = !ticker['shared'];
    this.bestTickers.push(ticker);
    this.cache.set('bestTickers', this.bestTickers);
  }

  public destroy(ticker){
    ticker['shared'] = !ticker['shared'];
    let index = this.bestTickers.indexOf(ticker, 0);
    if (index > -1) {
       this.bestTickers.splice(index, 1);
    }
    this.cache.set('bestTickers', this.bestTickers);
    for(let ticker of this.tickers){
      for(let best of this.bestTickers){
        if(ticker['id'] == best['id']){
          ticker['shared'] = true;
        }
      }
    }
  }

  public yet(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      // content: '<ion-spinner name="default"></ion-spinner>',
      duration: 100
    });

    this.start += this.limit + 1;
    this.currentCount += this.limit;
    this.apiProvider.get('ticker/?structure=array&start='+this.start+'&limit='+this.limit).subscribe(
      res => {
       let time = 0;
        for(let key in res['data']){
          this.date = res['metadata']['timestamp'];
          this.cache.set('lastUpdate', this.date);
          let ticker = res['data'][key];
          ticker['state'] = 'inactive';
          ticker["opened"] = false;
          ticker["shared"] = false;
          this.tickers.push(ticker);
          for(let best of this.bestTickers){
              if(ticker['id'] == best['id']){
                ticker['shared'] = true;
              }
          }
          setTimeout(function(){
            ticker["state"]="active"
          }, time+=300);
        }
        // console.log(res['data']);
        this.cache.set('tickers', this.tickers);
        console.log(this.cache.get('tickers'));
      });
    loading.present();
  }

  doRefresh(refresher) {
    this.apiProvider.get('ticker/?structure=array&start=0&limit='+this.currentCount).subscribe(
      res => {
        this.tickers = res['data'];
        this.date = res['metadata']['timestamp'];
        this.cache.set('lastUpdate', this.date);
        console.log(this.cache.get('lastUpdate'));
        for(let ticker of this.tickers){
          ticker["state"]="inactive";
          for(let best of this.bestTickers){
              if(ticker['id'] == best['id']){
                ticker['shared'] = true;
              }
          }
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
