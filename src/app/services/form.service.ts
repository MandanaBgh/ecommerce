import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private CountryUrl = 'http://localhost:8080/api/countries';
  private StateUrl = 'http://localhost:8080/api/states';
  constructor(private httpClient: HttpClient) { }



  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountry>(this.CountryUrl).pipe(
      map(response => response._embedded.countries)
    );

  }

  getStates(theCountryCode: string): Observable<State[]> {
    const fullPath = `${this.StateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseState>(fullPath).pipe(
      map(response => response._embedded.states)
    )
  }

  getCreditMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = Number(new Date().getFullYear());

    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {

      data.push(theYear);
    }

    return of(data);
  }

}
interface GetResponseCountry {
  _embedded: {
    countries: Country[];
  }

}

interface GetResponseState {
  _embedded: {
    states: State[];
  }
}