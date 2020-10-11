import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CountryService } from '../country.service';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { map, startWith } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { ListKeyManager } from '@angular/cdk/a11y';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']

})
export class HomePageComponent implements OnInit {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;


  logout() {
    this.user.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
 }
  

  public barChartOptions: any = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    scaleShowVerticalLines: true,
    responsive: true
  };

  public mbarChartLabels: string[] = ['Country'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      pointBackgroundColor: 'rgba(105,159,177,1)',
      pointBorderColor: '#fafafa',
      pointHoverBackgroundColor: '#fafafa',
      pointHoverBorderColor: 'rgba(105,159,177)'
    },
    {
      backgroundColor: 'rgba(77,20,96,0.3)',
      borderColor: 'rgba(77,20,96,1)',
      pointBackgroundColor: 'rgba(77,20,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,20,96,1)'
    },
  ];
  public barChartData: any[] = [
    {
      label: 'please select a country'
    }
  ];

  countries: any;
  countriesNames: string[];
  selectedCountries: string[] = [];
  selectedCountryObjects: any[] = [];
  myControl = new FormControl();
  tempIndexArray: any[] = [];
  filteredOptions: Observable<string[]>;
  visible = true;
  selectable = false;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  maxPopulation: any;
  diffPopulation: any;
  minPopulation: any;

  maxPopulationCountry: string = '';
  minPopulationCountry: string = '';

  @ViewChild('countryInput') countryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @Input('aria-orientation') ariaOrientation: 'vertical';

  constructor(private _compare: CountryService, private authService: AuthService, private router: Router, private _snackbar: MatSnackBar) {

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our country
    if (this.selectedCountries.indexOf(value) !== -1) {
      if ((value || '').trim()) {
        this.selectedCountries.push(value.trim());
        this.countries.filter(country => {
          country.name !== value;
        })
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
    this.myControl.setValue(null);
  }
  remove(value: string): void {
    const index = this.selectedCountries.indexOf(value);
    if (index >= 0) {
      this.selectedCountries.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let index = this.selectedCountries.indexOf(event.option.viewValue);
    if (index === -1) {
      this.selectedCountries.push(event.option.viewValue);
    }
    this.countryInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  ngOnInit() {
    const that = this;
    this._compare.comparassionCountry()
      .subscribe((data) => {
        that.countries = data;
        that.countriesNames = that.countries.map(singleCountry => {
          return singleCountry.name;
        })
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: string | null) => value ? this._filter(value) : this.countriesNames.slice())
        );
      });
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countriesNames.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  maxCompare() {
    this.selectedCountryObjects = [];
    this.barChartData = [];
    if (this.selectedCountries.length > 4 || this.selectedCountries.length < 2) {
      this._snackbar.open("The number of selected countries must be between two and four", "OK", {
        duration: 2000
      });
      return;
    }
    this.selectedCountries.forEach(name => {
      this.countries.forEach(countryObject => {
        if (name == countryObject.name) {
          this.selectedCountryObjects.push(countryObject);
          let tempArr: any[] = [];
          var obj: object = {};
          tempArr.push(countryObject.population);
          obj["data"] = tempArr;
          obj["label"] = countryObject.name;
          this.barChartData.push(obj);
        }
      })
    });
    var populationArray: any[] = [];
    this.selectedCountryObjects.forEach(singlePop => {
      populationArray.push(singlePop.population);
    })
    this.populationComparation(populationArray)
  }
  populationComparation(popArr) {
    let maxPopNumber = Math.max(...popArr);
    let minPopNumber = Math.min(...popArr);
    this.maxPopulation = maxPopNumber.toLocaleString('en-US');
    this.minPopulation = minPopNumber.toLocaleString('en-US');
    let diff = maxPopNumber - minPopNumber;
    this.diffPopulation = diff.toLocaleString('en-US');
    this.selectedCountryObjects.forEach(country => {
      if (country.population == maxPopNumber) {
        this.maxPopulationCountry = country.name;
      } else if (country.population == minPopNumber) {
        this.minPopulationCountry = country.name;
      }
    })
  }
  onLogout() {
    this.authService.logout();
  }
}

//givenNumber.toLocaleString('en-US')