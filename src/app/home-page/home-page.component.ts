import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CountryService } from '../country.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { map, startWith } from 'rxjs/operators';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']

})
export class HomePageComponent implements OnInit {

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
  maxPopulation: number = null;
  diffPopulation: number = null;
  minPopulation: number = null;

  maxPopulationCountry: string = '';
  minPopulationCountry: string = '';

  @ViewChild('countryInput') countryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;  
  @Input('aria-orientation') ariaOrientation: 'vertical';

  constructor(private _compare: CountryService) { 

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // console.log(this.countries, value, input)

    // Add our country
    if(this.selectedCountries.indexOf(value) !== -1){
    if ((value || '').trim()) {
      this.selectedCountries.push(value.trim());
      this.countries.filter( country => {
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
    if(index === -1){
      this.selectedCountries.push(event.option.viewValue);
    }

  console.log(this.selectedCountries)
    this.countryInput.nativeElement.value = '';
    this.myControl.setValue(null);
  }

  ngOnInit() {
    const that = this;
    this._compare.comparassionCountry()
      .subscribe((data) => {
        that.countries = data;
        that.countriesNames = that.countries.map( singleCountry => {
          return singleCountry.name;
        })
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: string | null) => value ? this._filter(value) : this.countriesNames.slice())
        );     
      });
      
  }
  myFunction(country) {
    this.barChartData[0].label = country.name;
    this.ngOnInit();
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countriesNames.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }


maxCompare() {
  this.selectedCountryObjects = [];
  // this.barChartData = [{data: [1], label: "yte"}];
  this.barChartData = [];
  if (this.selectedCountries.length > 4 || this.selectedCountries.length < 2) {
    alert('The number of selected countries must be between two and four');
    return;
  }
    this.selectedCountries.forEach(name => {
      this.countries.forEach(countryObject => {
        if(name == countryObject.name) {
          this.selectedCountryObjects.push(countryObject);
          let tempArr: any[] = [];
          var obj:object = {};
          tempArr.push(countryObject.population);
          obj["data"] = tempArr;
          obj["label"] = countryObject.name;
          this.barChartData.push(obj);
        }
      })
      console.log('barChartData');
      console.log(this.barChartData);
    });
    var populationArray: any[] = [];
    this.selectedCountryObjects.forEach(singlePop => {
      populationArray.push(singlePop.population);
    })
    this.populationComparation(populationArray)
  }
  populationComparation(popArr) {
    this.maxPopulation = Math.max(...popArr);
    this.minPopulation = Math.min(...popArr);
    this.diffPopulation = this.maxPopulation - this.minPopulation;
    this.selectedCountryObjects.forEach(country => {
      if(country.population == this.maxPopulation) {
        this.maxPopulationCountry = country.name;
      } else if (country.population == this.minPopulation) {
        this.minPopulationCountry = country.name;
      }
    })
  }
}

//givenNumber.toLocaleString('en-US')