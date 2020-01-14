import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDriveTimePolygonFeature } from '../models/drive-time-polygons.model';
import { Observable, of, throwError } from 'rxjs';
import { retryWhen, delay, mergeMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DriveTimePolygonService {

  driveTimePolygonUrl = 'routing/drive-time-polygons/drive-time-queries/';

  constructor( private http: HttpClient ) { }

  getDriveTimePolygon(driveTimeID: number): Observable<IDriveTimePolygonFeature> {
    let retries = 3;
    return this.http.get<IDriveTimePolygonFeature>(`${this.driveTimePolygonUrl}${driveTimeID}/`).pipe(
      retryWhen(((errors: Observable<any>) => {
        return errors.pipe(
          delay(1500),
          mergeMap(error => retries-- > 0 ? of(error) : throwError(error)));
      }))
    );
  }
}
