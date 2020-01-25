import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';
import { IDistinctField } from '../models/map-settings.model';

@Injectable({
  providedIn: 'root'
})
export class DistinctFieldsService {

  distinctUrl = 'bridges/new-york-bridges/distinct/';

  constructor( private http: HttpClient ) { }

  getFieldValues(field: string): Observable<IDistinctField> {
    let retries = 3;
    return this.http.get<IDistinctField>(`${this.distinctUrl}${field}/`).pipe(
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }
}
