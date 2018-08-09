import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  API_URL : string = "https://api.coinmarketcap.com/v2/";
  API2_URL :string = "https://min-api.cryptocompare.com/";
  public endpoint: string;
  constructor(public http: HttpClient) { }

  public get(path, url = 'first') {
      console.log(url);
      if(url == 'first'){
        this.endpoint = this.API_URL + path;
        return this.http.get(this.endpoint);
      }else{
        this.endpoint = this.API2_URL + path;
        return this.http.get(this.endpoint);
      }
  }

  public post(path:string,body:any) {
      this.endpoint = this.API_URL + path;
      return this.http.post(this.endpoint,body);
  }

  public delete(path:string){
    this.endpoint = this.API_URL + path;
    return this.http.delete(this.endpoint);
  }

  public update(path:string, body:any){
    this.endpoint = this.API_URL + path;
    return this.http.put(this.endpoint,body);
  }

}
