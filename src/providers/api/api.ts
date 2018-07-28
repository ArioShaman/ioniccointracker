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
  
  constructor(public http: HttpClient) { }

  public get(path) {
      var endpoint = this.API_URL + path;
      return this.http.get(endpoint);
  }
 
  public post(path:string,body:any) {
      var endpoint = this.API_URL + path;
      return this.http.post(endpoint,body);
  }
    
  public delete(path:string){
    var endpoint = this.API_URL + path;
    return this.http.delete(endpoint);
  }  
  
  public update(path:string, body:any){
    var endpoint = this.API_URL + path;
    return this.http.put(endpoint,body);
  }  

}
