import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { INominatimApiResponse, IFilterSearch } from '../models/nominatim-api.model';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NominatimSearchService {

  nominatimUrl = 'https://nominatim.openstreetmap.org/search';

  constructor( private http: HttpClient ) { }

  query(q: string): Observable<INominatimApiResponse[]> {
    const params = {
      q,
      format: 'json'
    };
    let retries = 3;
    return this.http.get<INominatimApiResponse[]>(this.nominatimUrl, { params } ).pipe(
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }

  paramQuery(query: IFilterSearch): Observable<INominatimApiResponse[]> {
    let retries = 3;
    const params = {
      street: query.streetAddress,
      city: query.city,
      state: query.state,
      country: query.country,
      format: 'json'
    };
    return this.http.get<INominatimApiResponse[]>(this.nominatimUrl, { params } ).pipe(
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }

}
