
import { Component } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { CountryService } from './country.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'country-compare-app';


  constructor( private _compare: CountryService) { }


  ngOnInit() {

  }

}
