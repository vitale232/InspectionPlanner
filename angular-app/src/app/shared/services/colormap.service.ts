import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IColormapQueryParams, IColormap } from '../models/map-settings.model';
import { Observable, of, throwError } from 'rxjs';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColormapService {
  colormapUrl = 'bridges/new-york-bridges/colormap/';

  constructor( private http: HttpClient ) { }

  getColormap(queryParams: IColormapQueryParams) {
    let retries = 3;
    const params = new HttpParams()
      .set('bins', queryParams.bins.toString())
      .set('colormap', queryParams.colormap)
      .set('field', queryParams.field)
      .set('mode', queryParams.mode);
    return this.http.get<IColormap>(this.colormapUrl, { params }).pipe(
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }
}
