import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map} from 'rxjs/operators';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor( private _http: HttpClient) { }

  comparassionCountry() {
    return this._http.get('https://restcountries.eu/rest/v2/all')
     .pipe(map(results => results));
  }
}
